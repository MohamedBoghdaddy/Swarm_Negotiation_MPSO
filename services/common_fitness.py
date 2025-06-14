# services/common_fitness.py

import json
import os
from datetime import datetime

QUALITY_MAP = {'Economy': 0.3, 'Standard': 0.6, 'Premium': 1.0}


def log_to_json(filename, data):
    os.makedirs("results", exist_ok=True)
    filepath = os.path.join("results", filename)
    with open(filepath, "a") as f:
        json.dump(data, f)
        f.write("\n")


def negotiation_fitness(offer, user, manufacturer, weights, verbose=False, algo_name="pso"):
    """
    Multi-objective negotiation fitness for PSO and comparison engines.
    Supports user-manufacturer balance with logging and JSON saving.
    """

    # Convert quality to numerical value
    quality_offer = offer['quality']
    if isinstance(quality_offer, str):
        quality_offer = QUALITY_MAP.get(quality_offer, 0.6)

    # === USER SATISFACTION ===
    price_target = user['priceRange']
    quality_user = QUALITY_MAP.get(user['qualityPreference'], 0.6)
    delivery_target = user['deliveryTimeline']

    price_score_user = max(0, 1 - abs(offer['price'] - price_target) / price_target)
    quality_score_user = max(0, 1 - abs(quality_offer - quality_user))
    delivery_score_user = max(0, 1 - abs(offer['delivery'] - delivery_target) / delivery_target)
    user_satisfaction = (price_score_user + quality_score_user + delivery_score_user) / 3

    # === MANUFACTURER SATISFACTION ===
    min_price = manufacturer['minPrice']
    quality_cost_limit = manufacturer['maxQualityCost']
    delivery_capacity = manufacturer['deliveryCapacity']

    price_score_manu = max(0, (offer['price'] - min_price) / min_price)
    quality_score_manu = max(0, 1 - abs(quality_offer - quality_cost_limit))
    delivery_score_manu = max(0, 1 - abs(offer['delivery'] - delivery_capacity) / delivery_capacity)
    manufacturer_satisfaction = (price_score_manu + quality_score_manu + delivery_score_manu) / 3

    # === COMBINED FITNESS ===
    total_fitness = (
        weights['user'] * user_satisfaction +
        weights['manufacturer'] * manufacturer_satisfaction
    )

    log_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "algorithm": algo_name,
        "offer": offer,
        "user": user,
        "manufacturer": manufacturer,
        "weights": weights,
        "user_satisfaction": {
            "price": price_score_user,
            "quality": quality_score_user,
            "delivery": delivery_score_user,
            "total": user_satisfaction
        },
        "manufacturer_satisfaction": {
            "price": price_score_manu,
            "quality": quality_score_manu,
            "delivery": delivery_score_manu,
            "total": manufacturer_satisfaction
        },
        "total_fitness": total_fitness
    }

    log_to_json(f"{algo_name}_results.json", log_entry)

    if verbose:
        print(f"[User] Price: {price_score_user:.2f}, Quality: {quality_score_user:.2f}, Delivery: {delivery_score_user:.2f} → Satisfaction: {user_satisfaction:.2f}")
        print(f"[Manufacturer] Price: {price_score_manu:.2f}, Quality: {quality_score_manu:.2f}, Delivery: {delivery_score_manu:.2f} → Satisfaction: {manufacturer_satisfaction:.2f}")
        print(f"[Fitness] Total: {total_fitness:.4f} with weights {weights}")
        print("=" * 70)

    return total_fitness


def abc_genetic_fitness(chromosome, user_preferences, verbose=False, algo_name="abc"):
    """
    Weighted-sum fitness for ABC or GA.
    Lower is better.
    Logs in a consistent format.
    """
    price, delivery, quality = chromosome
    w_price = user_preferences.get("weight_price", 1.0)
    w_time = user_preferences.get("weight_time", 1.0)
    w_quality = user_preferences.get("weight_quality", 1.0)

    quality_penalty = 1.0 - (quality / 100.0)
    fitness = (w_price * price) + (w_time * delivery) + (w_quality * quality_penalty)

    log_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "algorithm": algo_name,
        "chromosome": {
            "price": price,
            "delivery": delivery,
            "quality": quality
        },
        "weights": user_preferences,
        "components": {
            "price_score": w_price * price,
            "delivery_score": w_time * delivery,
            "quality_penalty_score": w_quality * quality_penalty
        },
        "total_fitness": fitness
    }

    log_to_json(f"{algo_name}_results.json", log_entry)

    if verbose:
        print(f"[{algo_name.upper()}] Price: {w_price * price:.2f}, Delivery: {w_time * delivery:.2f}, QualityPenalty: {w_quality * quality_penalty:.2f} → Total Fitness: {fitness:.4f}")
        print("=" * 70)

    return fitness


if __name__ == "__main__":
    offer = {'price': 950, 'quality': 'Standard', 'delivery': 7}
    user = {'priceRange': 1000, 'qualityPreference': 'Premium', 'deliveryTimeline': 5}
    manufacturer = {'minPrice': 800, 'maxQualityCost': 0.7, 'deliveryCapacity': 10}
    weights = {'user': 0.5, 'manufacturer': 0.5}

    print("\n--- Negotiation Fitness (PSO Style) ---")
    negotiation_fitness(offer, user, manufacturer, weights, verbose=True, algo_name="pso")

    print("\n--- ABC Fitness Function ---")
    chromosome_abc = [950, 7, 60]  # quality in %
    user_prefs = {"weight_price": 1.0, "weight_time": 1.0, "weight_quality": 1.0}
    abc_genetic_fitness(chromosome_abc, user_prefs, verbose=True, algo_name="abc")

    print("\n--- Genetic Algorithm Fitness Function ---")
    chromosome_ga = [900, 6, 75]
    abc_genetic_fitness(chromosome_ga, user_prefs, verbose=True, algo_name="ga")
