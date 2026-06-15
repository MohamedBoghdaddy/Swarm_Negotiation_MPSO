import random

def crossover(parent1, parent2):
    point = random.randint(1, len(parent1) - 1)
    return parent1[:point] + parent2[point:]

def mutate(offer, issue_values, mutation_rate=0.1):
    new_offer = offer[:]
    for i in range(len(offer)):
        if random.random() < mutation_rate:
            new_offer[i] = random.randint(0, issue_values[i] - 1)
    return new_offer

def generate_initial_population(num_issues, issue_values, pop_size):
    return [[random.randint(0, issue_values[i] - 1) for i in range(num_issues)] for _ in range(pop_size)]