import time
from abc_engine import ABCNegotiation
from genetic_engine import GA_Negotiation
from pso_engine import run_mpso_one_manufacturer


def run_all_algorithms(user, manufacturer, weights):
    # Unified bounds: price, delivery, quality (as normalized float or percentage)
    bounds = [
        (manufacturer['minPrice'], manufacturer['initialOffer']['price']),
        (manufacturer['minDelivery'], manufacturer['initialOffer']['delivery']),
        (80, 100)  # Quality in percentage for GA/ABC (will be normalized internally)
    ]

    results = {}

    # --- Run MPSO (PSO + contribution-based multi-agent)
    start = time.time()
    pso_result = run_mpso_one_manufacturer(user, manufacturer, weights, max_iters=30)
    results['MPSO'] = {
        **pso_result,
        'execution_time': round(time.time() - start, 4)
    }

    # --- Run ABC-MNG
    start = time.time()
    abc = ABCNegotiation(
        num_bees=15,
        limit=8,
        max_iter=50,
        bounds=bounds,
        user=user,
        manufacturer=manufacturer,
        weights=weights
    )
    abc_result = abc.run()
    results['ABC-MNG'] = {
        **abc_result,
        'execution_time': round(time.time() - start, 4)
    }

    # --- Run GA-Mixed (NSGA-II inspired with HV selection)
    start = time.time()
    ga = GA_Negotiation(
        population_size=25,
        generations=60,
        mutation_rate=0.2,
        bounds=bounds,
        user=user,
        manufacturer=manufacturer,
        weights=weights
    )
    ga_result = ga.run()
    results['GA-HV'] = {
        **ga_result,
        'execution_time': round(time.time() - start, 4)
    }

    return results
