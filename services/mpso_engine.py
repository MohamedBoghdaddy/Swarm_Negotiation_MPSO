import random
from fitness_function import negotiation_fitness

def run_mpso(user, manufacturers, weights, max_iters=3):
    best_offers = []

    for m in manufacturers:
        current_offer = m['initialOffer']
        swarm = [current_offer.copy() for _ in range(5)]  # Multi-swarm (5 particles per manufacturer)
        best_offer = current_offer
        best_fitness = negotiation_fitness(current_offer, user, weights)

        for _ in range(max_iters):
            for particle in swarm:
                # Adjust based on local (particle) and global best
                particle['price'] = max(m['minPrice'], particle['price'] - random.uniform(0.1, 0.5))
                particle['delivery'] = max(m['minDelivery'], particle['delivery'] - random.randint(0, 1))
                # Quality remains fixed to allowed qualities
                particle['quality'] = m['qualities'][0]

                fitness = negotiation_fitness(particle, user, weights)
                if fitness > best_fitness:
                    best_offer = particle.copy()
                    best_fitness = fitness

        best_offers.append({
            'manufacturerID': m['id'],
            'optimizedOffer': best_offer,
            'fitness': round(best_fitness, 4)
        })

    # Sort by fitness
    best_offers.sort(key=lambda x: x['fitness'], reverse=True)
    return best_offers
