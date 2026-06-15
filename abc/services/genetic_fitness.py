# genetic_fitness.py

def fitness_function(chromosome, user_preferences):
    """
    Lower fitness = better offer.
    chromosome = [price, delivery_time, quality]
    """
    price, delivery, quality = chromosome
    w_price = user_preferences.get("weight_price", 1.0)
    w_time = user_preferences.get("weight_time", 1.0)
    w_quality = user_preferences.get("weight_quality", 1.0)

    quality_penalty = 1.0 - (quality / 100.0)
    fitness = (w_price * price) + (w_time * delivery) + (w_quality * quality_penalty)
    return fitness
