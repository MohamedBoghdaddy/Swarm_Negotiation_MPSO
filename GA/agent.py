import random
from utility import generate_random_utility_function, evaluate_offer
from ga import generate_initial_population, mutate, crossover

NUM_GENERATIONS = 30
POP_SIZE = 20

class NegotiationAgent:
    def __init__(self, num_issues, issue_values, role="Agent"):
        self.num_issues = num_issues
        self.issue_values = issue_values
        self.role = role  # Role of the agent, e.g., "Customer" or "Clothing Factory"
        self.weights, self.issue_prefs = generate_random_utility_function(num_issues, issue_values)
        self.opponent_offers = []

    def evaluate(self, offer):
        return evaluate_offer(offer, self.weights, self.issue_prefs)

    def propose_offer(self):
        # Initialize the population of candidate offers
        population = generate_initial_population(self.num_issues, self.issue_values, POP_SIZE)

        for _ in range(NUM_GENERATIONS):
            # Evaluate all offers in the population
            scored = [(offer, self.evaluate(offer)) for offer in population]
            # Sort offers by their evaluation score (descending)
            scored.sort(key=lambda x: x[1], reverse=True)

            # Keep top half of population
            top_half = [x[0] for x in scored[:POP_SIZE // 2]]

            new_population = top_half.copy()

            # Generate new population by crossover and mutation until full size reached
            while len(new_population) < POP_SIZE:
                parent1, parent2 = random.sample(top_half, 2)
                child = crossover(parent1, parent2)
                child = mutate(child, self.issue_values)
                new_population.append(child)

            population = new_population

        # Select the best offer from final population
        best_offer = max(population, key=self.evaluate)
        return best_offer
