import random
import os
import json
from datetime import datetime
from common_fitness import negotiation_fitness

class GA_Negotiation:
    def __init__(self, population_size, generations, mutation_rate, bounds, user, manufacturer, weights):
        self.population_size = population_size
        self.generations = generations
        self.mutation_rate = mutation_rate
        self.bounds = bounds  # [(min_price, max_price), (min_days, max_days), (min_quality%, max_quality%)]
        self.user = user
        self.manufacturer = manufacturer
        self.weights = weights

    def evaluate_fitness(self, chromosome):
        mapped_offer = {
            'price': chromosome[0],
            'delivery': chromosome[1],
            'quality': chromosome[2] / 100.0
        }
        return negotiation_fitness(mapped_offer, self.user, self.manufacturer, self.weights, verbose=True, algo_name="ga_mixed")

    def initialize_population(self):
        population = []
        for _ in range(self.population_size):
            chrom = [
                round(random.uniform(*self.bounds[0]), 2),
                random.randint(*self.bounds[1]),
                random.randint(*self.bounds[2])
            ]
            population.append(chrom)
        return population

    def selection(self, population):
        population.sort(key=lambda x: self.evaluate_fitness(x))
        return population[:len(population) // 2]  # top 50%

    def crossover(self, parent1, parent2):
        # Uniform crossover
        return [
            parent1[i] if random.random() < 0.5 else parent2[i]
            for i in range(3)
        ]

    def mutate(self, chromosome):
        if random.random() < self.mutation_rate:
            idx = random.randint(0, 2)
            # Interdependent mutation logic
            if idx == 0:  # price mutation
                chromosome[0] = round(random.uniform(*self.bounds[0]), 2)
                if chromosome[0] > 4.5:
                    chromosome[2] = min(chromosome[2] + 5, self.bounds[2][1])  # more quality
            elif idx == 1:  # delivery mutation
                chromosome[1] = random.randint(*self.bounds[1])
                if chromosome[1] > 20:
                    chromosome[0] = max(chromosome[0] - 0.5, self.bounds[0][0])  # delayed, cheaper
            else:  # quality mutation
                chromosome[2] = random.randint(*self.bounds[2])
                if chromosome[2] < 85:
                    chromosome[0] = min(chromosome[0] + 0.3, self.bounds[0][1])  # low quality, increase price
        return chromosome

    def run(self):
        population = self.initialize_population()

        for _ in range(self.generations):
            selected = self.selection(population)
            offspring = []

            while len(offspring) < self.population_size:
                p1, p2 = random.sample(selected, 2)
                child = self.crossover(p1, p2)
                child = self.mutate(child)
                offspring.append(child)

            population = offspring

        best = min(population, key=lambda x: self.evaluate_fitness(x))
        fitness_score = self.evaluate_fitness(best)
        final_result = {
            "price": best[0],
            "delivery_time": best[1],
            "quality_score": best[2] / 100.0,
            "fitness": fitness_score
        }

        os.makedirs("results", exist_ok=True)
        with open("results/ga_mixed_issue_results.json", "a") as f:
            json.dump({
                "timestamp": datetime.utcnow().isoformat(),
                "result": final_result
            }, f)
            f.write("\n")

        return final_result


if __name__ == "__main__":
    bounds = [(3.5, 5.0), (5, 30), (80, 100)]
    user = {'priceRange': 4.5, 'qualityPreference': 'Premium', 'deliveryTimeline': 7}
    manufacturer = {'minPrice': 3.8, 'maxQualityCost': 0.9, 'deliveryCapacity': 15}
    weights = {'user': 0.6, 'manufacturer': 0.4}

    ga = GA_Negotiation(population_size=20, generations=50, mutation_rate=0.25, bounds=bounds, user=user, manufacturer=manufacturer, weights=weights)
    result = ga.run()
    print("🧬 Best GA Mixed-Issue Offer:", result)
