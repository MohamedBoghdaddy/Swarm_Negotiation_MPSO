def negotiation_fitness(offer, user, manufacturer, weights):
    """
    Fair PSO-based fitness evaluation considering both user and manufacturer satisfaction.

    Parameters:
    - offer (dict): Proposed offer with fields: price, quality, delivery
    - user (dict): User preferences: priceRange, qualityPreference, deliveryTimeline
    - manufacturer (dict): Manufacturer constraints: minPrice, maxQualityCost, deliveryCapacity
    - weights (dict): Weights like {'user': 0.5, 'manufacturer': 0.5}

    Returns:
    - float: Combined fitness score
    """

    # === USER SATISFACTION ===
    price_target = user['priceRange']
    price_score_user = max(0, 1 - abs(offer['price'] - price_target) / price_target)

    quality_map = {'Economy': 0.3, 'Standard': 0.6, 'Premium': 1.0}
    quality_user = quality_map.get(user['qualityPreference'], 0.6)
    quality_offer = offer['quality'] if isinstance(offer['quality'], float) else quality_map.get(offer['quality'], 0.6)
    quality_score_user = max(0, 1 - abs(quality_offer - quality_user))

    delivery_target = user['deliveryTimeline']
    delivery_score_user = max(0, 1 - abs(offer['delivery'] - delivery_target) / delivery_target)

    user_satisfaction = (price_score_user + quality_score_user + delivery_score_user) / 3
    print(f"[User] Price: {price_score_user:.2f}, Quality: {quality_score_user:.2f}, Delivery: {delivery_score_user:.2f} → User Satisfaction: {user_satisfaction:.2f}")

    # === MANUFACTURER SATISFACTION ===
    min_price = manufacturer['minPrice']
    price_score_manu = max(0, (offer['price'] - min_price) / min_price)

    quality_cost_limit = manufacturer['maxQualityCost']
    quality_score_manu = max(0, 1 - abs(quality_offer - quality_cost_limit))

    delivery_capacity = manufacturer['deliveryCapacity']
    delivery_score_manu = max(0, 1 - abs(offer['delivery'] - delivery_capacity) / delivery_capacity)

    manufacturer_satisfaction = (price_score_manu + quality_score_manu + delivery_score_manu) / 3
    print(f"[Manufacturer] Price: {price_score_manu:.2f}, Quality: {quality_score_manu:.2f}, Delivery: {delivery_score_manu:.2f} → Manufacturer Satisfaction: {manufacturer_satisfaction:.2f}")

    # === FINAL FAIRNESS-BASED FITNESS ===
    total_fitness = (
        weights['user'] * user_satisfaction +
        weights['manufacturer'] * manufacturer_satisfaction
    )

    print(f"[Fitness] Total Balanced Fitness: {total_fitness:.4f} with weights {weights}")
    print("=" * 70)

    return total_fitness


if __name__ == "__main__":
    offer = {'price': 950, 'quality': 'Standard', 'delivery': 7}
    user = {'priceRange': 1000, 'qualityPreference': 'Premium', 'deliveryTimeline': 5}
    manufacturer = {'minPrice': 800, 'maxQualityCost': 0.7, 'deliveryCapacity': 10}
    weights = {'user': 0.5, 'manufacturer': 0.5}

    fitness = negotiation_fitness(offer, user, manufacturer, weights)
    print(f"\n[RESULT] Final Negotiation Fitness: {fitness:.4f}")
