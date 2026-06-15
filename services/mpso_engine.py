import json
from datetime import datetime
import os
import random
from fitness_function import negotiation_fitness


def run_mpso(user, manufacturers, weights, max_iters=5):
    best_offers = []
    full_logs = []  # Store all logs

    inertia = 0.5
    cognitive = 1.5
    social = 1.5

    quality_map = {'Economy': 0.3, 'Standard': 0.6, 'Premium': 1.0}
    reverse_quality_map = {v: k for k, v in quality_map.items()}

    for m in manufacturers:
        log_entry = {"manufacturer_id": m["id"], "iterations": []}
        num_particles = random.randint(5, 10)

        full_logs.append({
            "stage": "init",
            "manufacturer_id": m["id"],
            "num_particles": num_particles,
            "price_range": [m["minPrice"], m["initialOffer"]["price"]],
            "delivery_range": [m["minDelivery"], m["initialOffer"]["delivery"]],
            "quality_options": m["qualities"]
        })

        swarm, velocities, local_bests, local_best_fitness = [], [], [], []
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

            offer = {
                "price": particle["price"],
                "delivery": particle["delivery"],
                "quality": reverse_quality_map.get(round(particle["quality"], 1), "Standard")
            }

            fitness = negotiation_fitness(offer, user, m, weights)

            full_logs.append({
                "stage": "init_particle",
                "manufacturer_id": m["id"],
                "particle_id": idx + 1,
                "particle": particle,
                "velocity": velocity,
                "fitness": fitness
            })

            swarm.append(particle)
            velocities.append(velocity)
            local_bests.append(particle.copy())
            local_best_fitness.append(fitness)

            if fitness > global_best_fitness:
                global_best = particle.copy()
                global_best_fitness = fitness

        for iter_num in range(max_iters):
            iter_logs = {"iteration": iter_num + 1, "particles": []}
            for i, particle in enumerate(swarm):
                update_log = {"particle_id": i + 1, "updates": {}, "fitness_eval": {}}

                for dim in ["price", "delivery", "quality"]:
                    r1, r2 = random.random(), random.random()
                    vel_update = (
                        inertia * velocities[i][dim]
                        + cognitive * r1 * (local_bests[i][dim] - particle[dim])
                        + social * r2 * (global_best[dim] - particle[dim])
                    )
                    particle[dim] += vel_update
                    velocities[i][dim] = vel_update

                    update_log["updates"][dim] = {
                        "new_value": particle[dim],
                        "velocity": vel_update
                    }

                    # Detailed velocity log
                    full_logs.append({
                        "stage": "velocity_update",
                        "manufacturer_id": m["id"],
                        "iteration": iter_num + 1,
                        "particle_id": i + 1,
                        "dimension": dim,
                        "new_value": particle[dim],
                        "velocity": vel_update
                    })

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
                update_log["fitness_eval"] = {
                    "offer": offer,
                    "fitness": fitness,
                    "is_new_local_best": False,
                    "is_new_global_best": False
                }

                if fitness > local_best_fitness[i]:
                    local_bests[i] = particle.copy()
                    local_best_fitness[i] = fitness
                    update_log["fitness_eval"]["is_new_local_best"] = True

                if fitness > global_best_fitness:
                    global_best = particle.copy()
                    global_best_fitness = fitness
                    update_log["fitness_eval"]["is_new_global_best"] = True

                iter_logs["particles"].append(update_log)

            log_entry["iterations"].append(iter_logs)

        full_logs.append({
            "stage": "result",
            "manufacturer_id": m["id"],
            "best_offer": global_best,
            "fitness": global_best_fitness
        })

        best_offers.append({
            'manufacturerID': m['id'],
            'optimizedOffer': {
                "price": round(global_best["price"], 2),
                "delivery": int(global_best["delivery"]),
                "quality": reverse_quality_map.get(round(global_best["quality"], 1), "Standard")
            },
            'fitness': round(global_best_fitness, 4),
            'roundHistory': log_entry["iterations"]
        })

    # Save logs to JSON
    os.makedirs("outputs", exist_ok=True)
    log_filename = f"outputs/run_logs_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(log_filename, "w") as f:
        json.dump(full_logs, f, indent=4)

    print(f"\n📝 All logs saved to: {log_filename}")
    best_offers.sort(key=lambda x: x['fitness'], reverse=True)
    return best_offers


if __name__ == "__main__":
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
            "initialOffer": {"price": 1200, "quality": "Standard", "delivery": 10},
            "minPrice": 800,
            "minDelivery": 3,
            "qualities": ["Economy", "Standard", "Premium"],
            "maxQualityCost": 0.8,
            "deliveryCapacity": 9
        },
        {
            "id": 2,
            "initialOffer": {"price": 1100, "quality": "Premium", "delivery": 7},
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

    # Save final offers to JSON
    output_dir = "outputs"
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = os.path.join(output_dir, f"negotiation_results_{timestamp}.json")

    with open(output_path, "w") as f:
        json.dump(results, f, indent=4)

    print(f"\n📁 Results saved to: {output_path}")
