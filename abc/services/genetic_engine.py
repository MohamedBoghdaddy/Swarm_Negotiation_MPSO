# genetic_engine.py

import random
from genetic_fitness import fitness_function

class GA_Negotiation:
    def __init__(self, population_size, generations, mutation_rate, bounds, user_preferences):
        self.population_size = population_size
        self.generations = generations
        self.mutation_rate = mutation_rate
        self.bounds = bounds  # [(min_price, max_price), (min_days, max_days), (min_quality, max_quality)]
        self.user_preferences = user_preferences

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
        population.sort(key=lambda x: fitness_function(x, self.user_preferences))
        return population[:int(len(population) / 2)]  # top 50%

    def crossover(self, parent1, parent2):
        # Uniform crossover
        child = [
            parent1[0] if random.random() < 0.5 else parent2[0],
            parent1[1] if random.random() < 0.5 else parent2[1],
            parent1[2] if random.random() < 0.5 else parent2[2]
        ]
        return child

    def mutate(self, chromosome):
        if random.random() < self.mutation_rate:
            idx = random.randint(0, 2)
            if idx == 0:
                chromosome[0] = round(random.uniform(*self.bounds[0]), 2)
            elif idx == 1:
                chromosome[1] = random.randint(*self.bounds[1])
            else:
                chromosome[2] = random.randint(*self.bounds[2])
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

        best = min(population, key=lambda x: fitness_function(x, self.user_preferences))
        return {
            "price": best[0],
            "delivery_time": best[1],
            "quality_score": best[2],
            "fitness": fitness_function(best, self.user_preferences)
        }
        
if __name__ == "__main__":
    bounds = [(3.5, 5.0), (5, 30), (80, 100)]
    prefs = {"weight_price": 0.5, "weight_time": 0.3, "weight_quality": 0.2}

    ga = GA_Negotiation(population_size=20, generations=50, mutation_rate=0.2, bounds=bounds, user_preferences=prefs)
    result = ga.run()
    print("🧬 GA Offer:", result)
