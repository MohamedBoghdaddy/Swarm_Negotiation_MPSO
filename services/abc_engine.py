import random
import json
import os
from datetime import datetime
from common_fitness import negotiation_fitness

class Bee:
    def __init__(self, offer, fitness):
        self.offer = offer  # [price, delivery, quality %]
        self.fitness = fitness
        self.trial = 0

class ABCNegotiation:
    def __init__(self, num_bees, limit, max_iter, bounds, user, manufacturer, weights):
        self.num_bees = num_bees
        self.limit = limit
        self.max_iter = max_iter
        self.bounds = bounds  # [(min_price, max_price), (min_delivery, max_delivery), (min_quality%, max_quality%)]
        self.user = user
        self.manufacturer = manufacturer
        self.weights = weights
        self.bees = []

    def evaluate_fitness(self, offer):
        mapped_offer = {
            'price': offer[0],
            'delivery': offer[1],
            'quality': offer[2] / 100.0  # normalize to 0.3–1.0 range if needed
        }
        return negotiation_fitness(mapped_offer, self.user, self.manufacturer, self.weights, verbose=True, algo_name="abc_mng")

    def random_offer(self):
        return [
            round(random.uniform(*self.bounds[0]), 2),  # price
            random.randint(*self.bounds[1]),            # delivery
            random.randint(*self.bounds[2])             # quality (as percentage)
        ]

    def initialize_population(self):
        self.bees = []
        for _ in range(self.num_bees):
            offer = self.random_offer()
            fit = self.evaluate_fitness(offer)
            self.bees.append(Bee(offer, fit))

    def multi_neighbor_mutation(self, offer):
        neighbors = random.sample(self.bees, k=min(3, len(self.bees)))
        mutated = offer[:]
        for i in range(len(offer)):
            phi = random.uniform(-1, 1)
            neighbor_vals = [b.offer[i] for b in neighbors]
            neighbor_mean = sum(neighbor_vals) / len(neighbor_vals)
            mutated[i] = offer[i] + phi * (neighbor_mean - offer[i])
            # Clamp values to bounds
            min_val, max_val = self.bounds[i]
            mutated[i] = round(max(min(mutated[i], max_val), min_val), 2 if i == 0 else 0)
        return mutated

    def employed_bee_phase(self):
        for i in range(self.num_bees):
            candidate = self.multi_neighbor_mutation(self.bees[i].offer)
            candidate_fitness = self.evaluate_fitness(candidate)
            if candidate_fitness < self.bees[i].fitness:
                self.bees[i].offer = candidate
                self.bees[i].fitness = candidate_fitness
                self.bees[i].trial = 0
            else:
                self.bees[i].trial += 1

    def onlooker_bee_phase(self):
        total_fitness = sum(1 / (bee.fitness + 1e-6) for bee in self.bees)
        probs = [(1 / (bee.fitness + 1e-6)) / total_fitness for bee in self.bees]

        for _ in range(self.num_bees):
            i = self.roulette_wheel_selection(probs)
            candidate = self.multi_neighbor_mutation(self.bees[i].offer)
            candidate_fitness = self.evaluate_fitness(candidate)
            if candidate_fitness < self.bees[i].fitness:
                self.bees[i].offer = candidate
                self.bees[i].fitness = candidate_fitness
                self.bees[i].trial = 0
            else:
                self.bees[i].trial += 1

    def scout_bee_phase(self):
        for i in range(self.num_bees):
            if self.bees[i].trial >= self.limit:
                new_offer = self.random_offer()
                self.bees[i] = Bee(new_offer, self.evaluate_fitness(new_offer))

    def roulette_wheel_selection(self, probs):
        r = random.random()
        cumulative = 0.0
        for i, p in enumerate(probs):
            cumulative += p
            if r <= cumulative:
                return i
        return len(probs) - 1

    def run(self):
        self.initialize_population()
        best_solution = min(self.bees, key=lambda b: b.fitness)

        for _ in range(self.max_iter):
            self.employed_bee_phase()
            self.onlooker_bee_phase()
            self.scout_bee_phase()
            current_best = min(self.bees, key=lambda b: b.fitness)
            if current_best.fitness < best_solution.fitness:
                best_solution = current_best

        final_offer = {
            "price": best_solution.offer[0],
            "delivery_time": best_solution.offer[1],
            "quality_score": best_solution.offer[2] / 100.0,
            "fitness": best_solution.fitness
        }

        os.makedirs("results", exist_ok=True)
        with open("results/abc_mng_results.json", "a") as f:
            json.dump({
                "timestamp": datetime.utcnow().isoformat(),
                "result": final_offer
            }, f)
            f.write("\n")

        return final_offer


if __name__ == "__main__":
    bounds = [(3.5, 5.0), (5, 30), (80, 100)]  # price, delivery, quality%
    user = {'priceRange': 4.5, 'qualityPreference': 'Premium', 'deliveryTimeline': 7}
    manufacturer = {'minPrice': 3.8, 'maxQualityCost': 0.9, 'deliveryCapacity': 15}
    weights = {'user': 0.6, 'manufacturer': 0.4}

    abc = ABCNegotiation(num_bees=15, limit=5, max_iter=30, bounds=bounds, user=user, manufacturer=manufacturer, weights=weights)
    result = abc.run()
    print("📦 Best ABC-MNG Offer:", result)
