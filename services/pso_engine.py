import json
import random
import os
from datetime import datetime
from common_fitness import negotiation_fitness, QUALITY_MAP

# Constants
REVERSE_QUALITY_MAP = {v: k for k, v in QUALITY_MAP.items()}
BASE_SOCIAL = 1.5
COGNITIVE = 1.5
INERTIA = 0.5

def run_mpso(user, manufacturers, weights, max_iters=50):
    best_offers = []
    full_logs = []  # Flat log for all events
    structured_logs = []  # Manufacturer-structured logs

    for m in manufacturers:
        # Initialize manufacturer log
        m_log = {
            "manufacturer_id": m["id"],
            "num_particles": random.randint(5, 10),
            "price_range": [m["minPrice"], m["initialOffer"]["price"]],
            "delivery_range": [m["minDelivery"], m["initialOffer"]["delivery"]],
            "quality_options": m["qualities"],
            "iterations": []
        }
        structured_logs.append(m_log)
        
        num_particles = m_log["num_particles"]
        swarm, velocities = [], []
        local_bests, local_best_fitness = [], []
        contributions = [0] * num_particles

        # Global best initialization
        global_best = None
        global_best_fitness = -float('inf')

        # Log initialization
        full_logs.append({
            "stage": "init",
            "manufacturer_id": m["id"],
            "num_particles": num_particles,
            **m_log
        })

        # Particle initialization
        for i in range(num_particles):
            q_val = QUALITY_MAP[random.choice(m['qualities'])]
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

            # Convert to offer format for fitness evaluation
            offer = {
                "price": particle["price"],
                "delivery": particle["delivery"],
                "quality": REVERSE_QUALITY_MAP.get(round(particle["quality"], 1), "Standard")
            }

            fitness = negotiation_fitness(offer, user, m, weights)

            # Store initialization logs
            particle_log = {
                "stage": "init_particle",
                "manufacturer_id": m["id"],
                "particle_id": i,
                "particle": particle.copy(),
                "velocity": velocity.copy(),
                "fitness": fitness
            }
            full_logs.append(particle_log)
            m_log["particles_init"] = m_log.get("particles_init", []) + [particle_log]

            # Update bests
            swarm.append(particle)
            velocities.append(velocity)
            local_bests.append(particle.copy())
            local_best_fitness.append(fitness)

            if fitness > global_best_fitness:
                global_best = particle.copy()
                global_best_fitness = fitness

        # Optimization loop
        for iter_num in range(max_iters):
            iter_log = {"iteration": iter_num + 1, "particles": []}
            m_log["iterations"].append(iter_log)

            for i, particle in enumerate(swarm):
                update_log = {"particle_id": i, "updates": {}, "fitness_eval": {}}
                iter_log["particles"].append(update_log)
                
                # Dynamic social factor
                social_factor = BASE_SOCIAL + (contributions[i] / (iter_num + 1))

                # Update each dimension
                for dim in ["price", "delivery", "quality"]:
                    r1, r2 = random.random(), random.random()
                    vel_update = (
                        INERTIA * velocities[i][dim] +
                        COGNITIVE * r1 * (local_bests[i][dim] - particle[dim]) +
                        social_factor * r2 * (global_best[dim] - particle[dim])
                    )
                    
                    # Apply updates
                    particle[dim] += vel_update
                    velocities[i][dim] = vel_update

                    # Dimension-specific logging
                    dim_log = {
                        "stage": "velocity_update",
                        "manufacturer_id": m["id"],
                        "iteration": iter_num + 1,
                        "particle_id": i,
                        "dimension": dim,
                        "new_value": particle[dim],
                        "velocity": vel_update
                    }
                    full_logs.append(dim_log)
                    update_log["updates"][dim] = dim_log.copy()

                # Apply constraints
                particle["price"] = max(m["minPrice"], min(particle["price"], m["initialOffer"]["price"]))
                particle["delivery"] = max(m["minDelivery"], min(int(particle["delivery"]), m["initialOffer"]["delivery"]))
                particle["quality"] = max(0.3, min(particle["quality"], 1.0))

                # Prepare offer for fitness evaluation
                quality_label = REVERSE_QUALITY_MAP.get(round(particle["quality"], 1), "Standard")
                offer = {
                    "price": particle["price"],
                    "delivery": int(particle["delivery"]),
                    "quality": quality_label
                }

                # Evaluate fitness
                fitness = negotiation_fitness(offer, user, m, weights)
                is_local_best = False
                is_global_best = False

                # Update bests
                if fitness > local_best_fitness[i]:
                    local_bests[i] = particle.copy()
                    local_best_fitness[i] = fitness
                    is_local_best = True

                if fitness > global_best_fitness:
                    global_best = particle.copy()
                    global_best_fitness = fitness
                    contributions[i] += 1
                    is_global_best = True

                # Fitness evaluation logging
                fitness_log = {
                    "offer": offer,
                    "fitness": fitness,
                    "is_new_local_best": is_local_best,
                    "is_new_global_best": is_global_best,
                    "contribution_score": contributions[i]
                }
                update_log["fitness_eval"] = fitness_log
                full_logs.append({
                    "stage": "fitness_eval",
                    "manufacturer_id": m["id"],
                    "iteration": iter_num + 1,
                    "particle_id": i,
                    **fitness_log
                })

        # Final best offer conversion
        quality_label = REVERSE_QUALITY_MAP.get(round(global_best["quality"], 1), "Standard")
        best_offer = {
            "price": round(global_best["price"], 2),
            "delivery": int(global_best["delivery"]),
            "quality": quality_label
        }

        # Store manufacturer results
        result_log = {
            "stage": "result",
            "manufacturer_id": m["id"],
            "best_offer": best_offer,
            "fitness": global_best_fitness,
            "contributions": contributions
        }
        full_logs.append(result_log)

        best_offers.append({
            'manufacturerID': m['id'],
            'optimizedOffer': best_offer,
            'fitness': round(global_best_fitness, 4),
            'contributions': contributions,
            'roundHistory': m_log["iterations"]
        })

    # Save logs
    os.makedirs("outputs", exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save flat logs
    with open(f"outputs/full_logs_{timestamp}.json", "w") as f:
        json.dump(full_logs, f, indent=4)
    
    # Save structured logs
    with open(f"outputs/structured_logs_{timestamp}.json", "w") as f:
        json.dump(structured_logs, f, indent=4)
    
    # Save results
    with open(f"outputs/results_{timestamp}.json", "w") as f:
        json.dump(best_offers, f, indent=4)

    print(f"\n📝 Logs saved to: outputs/full_logs_{timestamp}.json")
    print(f"📝 Structured logs saved to: outputs/structured_logs_{timestamp}.json")
    print(f"📁 Results saved to: outputs/results_{timestamp}.json")

    # Sort by fitness
    best_offers.sort(key=lambda x: x['fitness'], reverse=True)
    return best_offers


def run_mpso_one_manufacturer(user, manufacturer, weights, max_iters=50):
    """Wrapper to run PSO for a single manufacturer"""
    results = run_mpso(user, [manufacturer], weights, max_iters)
    if results:
        return results[0]
    return None


if __name__ == "__main__":
    # Test configuration
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
    
    print("\n🚀 Running Multi-Agent PSO Negotiation")
    results = run_mpso(user, manufacturers, weights, max_iters=10)
    
    print("\n✅ Final Offers (sorted by fitness):")
    for res in results:
        print(json.dumps(res, indent=2))