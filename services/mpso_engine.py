import random
from fitness_function import negotiation_fitness

def run_mpso(user, manufacturers, weights, max_iters=3):
    best_offers = []

    for m in manufacturers:
        current_offer = m['initialOffer']
        # Initialize swarm with 5 particles for this manufacturer
        swarm = [current_offer.copy() for _ in range(5)]  
        best_offer = current_offer
        best_fitness = negotiation_fitness(current_offer, user, weights)
        rounds = []

        for iter_num in range(max_iters):
            round_particles = []

            for particle in swarm:
                # Adjust price (never below manufacturer's minPrice)
                particle['price'] = max(m['minPrice'], particle['price'] - random.uniform(0.1, 0.5))

                # Adjust delivery (never below minDelivery)
                particle['delivery'] = max(m['minDelivery'], particle['delivery'] - random.randint(0, 1))

                # Choose from available quality levels (random exploration)
                particle['quality'] = random.choice(m['qualities'])

                # Evaluate fitness
                fitness = negotiation_fitness(particle, user, weights)

                round_particles.append({
                    "iteration": iter_num + 1,
                    "offer": particle.copy(),
                    "fitness": round(fitness, 4)
                })

                # Update best offer if the current fitness is higher
                if fitness > best_fitness:
                    best_offer = particle.copy()
                    best_fitness = fitness

            rounds.append(round_particles)

        # Append results for the current manufacturer
        best_offers.append({
            'manufacturerID': m['id'],
            'optimizedOffer': best_offer,
            'fitness': round(best_fitness, 4),
            'roundHistory': rounds
        })

    # Sort best offers by fitness (descending order)
    best_offers.sort(key=lambda x: x['fitness'], reverse=True)
    return best_offers
