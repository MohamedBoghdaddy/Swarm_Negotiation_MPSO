# abc_engine.py

import random
from fitness import fitness_function

class Bee:
    def __init__(self, offer, fitness):
        self.offer = offer
        self.fitness = fitness
        self.trial = 0

class ABCNegotiation:
    def __init__(self, num_bees, limit, max_iter, bounds, user_preferences):
        self.num_bees = num_bees
        self.limit = limit
        self.max_iter = max_iter
        self.bounds = bounds  # [ (min_price, max_price), (min_days, max_days), (min_quality, max_quality) ]
        self.user_preferences = user_preferences
        self.bees = []

    def initialize_population(self):
        self.bees = []
        for _ in range(self.num_bees):
            offer = self.random_offer()
            fit = fitness_function(offer, self.user_preferences)
            self.bees.append(Bee(offer, fit))

    def random_offer(self):
        return [
            round(random.uniform(*self.bounds[0]), 2),  # price
            random.randint(*self.bounds[1]),            # delivery_time
            random.randint(*self.bounds[2])             # quality %
        ]

    def mutate_offer(self, offer):
        index = random.randint(0, 2)
        mutated = offer[:]
        if index == 0:
            mutated[0] = round(random.uniform(*self.bounds[0]), 2)
        elif index == 1:
            mutated[1] = random.randint(*self.bounds[1])
        else:
            mutated[2] = random.randint(*self.bounds[2])
        return mutated

    def employed_bee_phase(self):
        for i in range(self.num_bees):
            candidate = self.mutate_offer(self.bees[i].offer)
            candidate_fitness = fitness_function(candidate, self.user_preferences)
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
            candidate = self.mutate_offer(self.bees[i].offer)
            candidate_fitness = fitness_function(candidate, self.user_preferences)
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
                self.bees[i] = Bee(new_offer, fitness_function(new_offer, self.user_preferences))

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

        return {
            "price": best_solution.offer[0],
            "delivery_time": best_solution.offer[1],
            "quality_score": best_solution.offer[2],
            "fitness": best_solution.fitness
        }
        
if __name__ == "__main__":
    bounds = [(3.5, 5.0), (5, 30), (80, 100)]  # price, delivery days, quality
    prefs = {"weight_price": 0.5, "weight_time": 0.3, "weight_quality": 0.2}

    abc = ABCNegotiation(num_bees=10, limit=5, max_iter=50, bounds=bounds, user_preferences=prefs)
    result = abc.run()
    print("📦 ABC Offer:", result)
