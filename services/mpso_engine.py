import random
from fitness_function import negotiation_fitness

def run_mpso(user, manufacturers, weights, max_iters=10):
    best_offers = []
    inertia = 0.5
    cognitive = 1.5
    social = 1.5

    quality_map = {'Economy': 0.3, 'Standard': 0.6, 'Premium': 1.0}
    reverse_quality_map = {v: k for k, v in quality_map.items()}

    for m in manufacturers:
        print(f"\n=== Optimizing for Manufacturer ID: {m['id']} ===")
        num_particles = random.randint(5, 10)
        print(f"[Init] Number of Particles: {num_particles}")
        swarm = []
        velocities = []
        local_bests = []
        local_best_fitness = []
        global_best = None
        global_best_fitness = -1

        for idx in range(num_particles):
            q_val = quality_map[random.choice(m['qualities'])]
            particle = {
                "price": random.uniform(m['minPrice'], m['initialOffer']['price']),
                "delivery": random.randint(m['minDelivery'], m['initialOffer']['delivery']),
                "quality": q_val
            }
            velocity = {
                "price": random.uniform(-1, 1),
                "delivery": random.uniform(-1, 1),
                "quality": random.uniform(-0.2, 0.2)
            }
            fitness = negotiation_fitness(
                {
                    "price": particle["price"],
                    "delivery": particle["delivery"],
                    "quality": reverse_quality_map.get(round(particle["quality"], 1), "Standard")
                },
                user,
                m,
                weights
            )
            print(f"[Init] Particle {idx+1}: {particle} Fitness: {fitness:.4f}")
            swarm.append(particle)
            velocities.append(velocity)
            local_bests.append(particle.copy())
            local_best_fitness.append(fitness)
            if fitness > global_best_fitness:
                global_best = particle.copy()
                global_best_fitness = fitness

        rounds = []

        for iter_num in range(max_iters):
            print(f"\n[Iter {iter_num + 1}] ---------------------------")
            round_particles = []
            for i, particle in enumerate(swarm):
                for dim in ["price", "delivery", "quality"]:
                    r1, r2 = random.random(), random.random()
                    vel_update = (
                        inertia * velocities[i][dim]
                        + cognitive * r1 * (local_bests[i][dim] - particle[dim])
                        + social * r2 * (global_best[dim] - particle[dim])
                    )
                    particle[dim] += vel_update
                    velocities[i][dim] = vel_update

                particle["price"] = max(m["minPrice"], min(particle["price"], m["initialOffer"]["price"]))
                particle["delivery"] = max(m["minDelivery"], min(particle["delivery"], m["initialOffer"]["delivery"]))
                particle["quality"] = min(1.0, max(0.3, particle["quality"]))

                quality_label = reverse_quality_map.get(round(particle["quality"], 1), "Standard")
                offer = {
                    "price": particle["price"],
                    "delivery": particle["delivery"],
                    "quality": quality_label
                }
                fitness = negotiation_fitness(offer, user, m, weights)

                print(f"[Particle {i+1}] User Offer: {user['priceRange']}, {user['deliveryTimeline']}, {user['qualityPreference']} → Counter: {offer} | Manufacturer: {m['initialOffer']} → Fitness: {fitness:.4f}")

                if fitness > local_best_fitness[i]:
                    local_bests[i] = particle.copy()
                    local_best_fitness[i] = fitness

                if fitness > global_best_fitness:
                    global_best = particle.copy()
                    global_best_fitness = fitness

                round_particles.append({
                    "iteration": iter_num + 1,
                    "offer": {
                        "price": round(particle["price"], 2),
                        "delivery": int(particle["delivery"]),
                        "quality": quality_label
                    },
                    "fitness": round(fitness, 4)
                })
            rounds.append(round_particles)

        print(f"\n[Result] Best Offer for Manufacturer {m['id']}: {global_best} → Fitness: {global_best_fitness:.4f}")

        best_offers.append({
            'manufacturerID': m['id'],
            'optimizedOffer': {
                "price": round(global_best["price"], 2),
                "delivery": int(global_best["delivery"]),
                "quality": reverse_quality_map.get(round(global_best["quality"], 1), "Standard")
            },
            'fitness': round(global_best_fitness, 4),
            'roundHistory': rounds
        })

    best_offers.sort(key=lambda x: x['fitness'], reverse=True)
    return best_offers

if __name__ == "__main__":
    from fitness_function import negotiation_fitness
    import json
    from datetime import datetime
    import os

    user = {
        "fabricType": "Cotton",
        "quantity": 500,
        "priceRange": 1000,
        "qualityPreference": "Premium",
        "deliveryTimeline": 5
    }

    manufacturers = [
        {
            "id": 1,
            "initialOffer": {
                "price": 1200,
                "quality": "Standard",
                "delivery": 10
            },
            "minPrice": 800,
            "minDelivery": 3,
            "qualities": ["Economy", "Standard", "Premium"],
            "maxQualityCost": 0.8,
            "deliveryCapacity": 9
        },
        {
            "id": 2,
            "initialOffer": {
                "price": 1100,
                "quality": "Premium",
                "delivery": 7
            },
            "minPrice": 850,
            "minDelivery": 4,
            "qualities": ["Standard", "Premium"],
            "maxQualityCost": 0.9,
            "deliveryCapacity": 8
        }
    ]

    weights = {"user": 0.5, "manufacturer": 0.5}

    print("\n🚀 Running PSO Optimization Test:")
    results = run_mpso(user, manufacturers, weights, max_iters=5)

    print("\n✅ Final Sorted Offers:")
    for res in results:
        print(res)

    # === Save to JSON ===
    output_dir = "outputs"
    os.makedirs(output_dir, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = os.path.join(output_dir, f"negotiation_results_{timestamp}.json")

    with open(output_path, "w") as f:
        json.dump(results, f, indent=4)

    print(f"\n📁 Results saved to: {output_path}")