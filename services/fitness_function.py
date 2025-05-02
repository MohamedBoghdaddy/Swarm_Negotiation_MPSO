def negotiation_fitness(offer, user, weights):
    # Price fitness: higher if closer to user's minimum acceptable price
    price_f = max(0, 1 - (offer['price'] - user['priceRange'][0]) / 
                         (user['priceRange'][1] - user['priceRange'][0]))

    # Quality fitness: based on mapping and closeness to user preference
    quality_map = {'Economy': 0.3, 'Standard': 0.6, 'Premium': 1.0}
    quality_f = quality_map.get(offer['quality'], 0)
    quality_pref = quality_map.get(user['qualityPreference'], 0)
    quality_score = 1 - abs(quality_f - quality_pref)

    # Delivery fitness: higher score for faster delivery
    delivery_f = max(0, 1 - (offer['delivery'] - user['deliveryTime']) / user['deliveryTime'])

    # Weighted total fitness score
    return (
        price_f * weights['price'] +
        quality_score * weights['quality'] +
        delivery_f * weights['delivery']
    )
