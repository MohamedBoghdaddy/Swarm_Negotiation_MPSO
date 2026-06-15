# fitness.py

def fitness_function(offer, user_preferences):
    """
    Compute fitness based on user preferences.
    Lower fitness is better.
    """
    price, delivery_time, quality = offer
    w_price = user_preferences.get("weight_price", 1.0)
    w_time = user_preferences.get("weight_time", 1.0)
    w_quality = user_preferences.get("weight_quality", 1.0)

    # Normalize quality to a loss form: (1 - quality)
    norm_quality = 1.0 - (quality / 100.0)

    # Compute weighted sum
    fitness = (w_price * price) + (w_time * delivery_time) + (w_quality * norm_quality)
    return fitness
