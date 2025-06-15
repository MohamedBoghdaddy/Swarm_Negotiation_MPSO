import numpy as np
from scipy.spatial import distance
from pygmo import hypervolume


def is_dominated(p1, p2):
    return all(a >= b for a, b in zip(p2, p1)) and any(a > b for a, b in zip(p2, p1))


def get_pareto_front(points):
    """Extract non-dominated solutions"""
    points = np.array(points)
    pareto_front = []
    for i, p in enumerate(points):
        if not any(is_dominated(p, q) for j, q in enumerate(points) if i != j):
            pareto_front.append(p.tolist())
    return pareto_front


def calculate_igd(solution_set, reference_set):
    """Inverted Generational Distance (lower = better)"""
    distances = []
    for ref_point in reference_set:
        min_dist = min(distance.euclidean(ref_point, sol) for sol in solution_set)
        distances.append(min_dist)
    return np.mean(distances)


def calculate_hypervolume(pareto_front, reference_point):
    """Hypervolume (higher = better)"""
    hv = hypervolume(pareto_front)
    return hv.compute(reference_point)


def calculate_hv_contributions(pareto_front, reference_point):
    """Compute per-point HV contribution (used for ranking/archiving)"""
    base_hv = calculate_hypervolume(pareto_front, reference_point)
    contributions = []
    for i in range(len(pareto_front)):
        reduced_front = pareto_front[:i] + pareto_front[i+1:]
        hv_reduced = calculate_hypervolume(reduced_front, reference_point)
        contrib = base_hv - hv_reduced
        contributions.append(round(contrib, 6))
    return contributions


def calculate_pareto_metrics(algorithm_data, reference_point=None):
    """
    Evaluate Pareto metrics for all algorithms:
    - Pareto front size
    - IGD
    - Hypervolume
    - HV contribution per solution (optional for ranking)
    """
    metrics = {}
    all_points = []

    for algo, points in algorithm_data.items():
        all_points.extend(points)

    if reference_point is None:
        reference_point = [
            max(p[0] for p in all_points) * 1.1,
            max(p[1] for p in all_points) * 1.1
        ]

    for algo, points in algorithm_data.items():
        pareto_front = get_pareto_front(points)
        igd = calculate_igd(pareto_front, all_points)
        hv = calculate_hypervolume(pareto_front, reference_point)
        hv_contribs = calculate_hv_contributions(pareto_front, reference_point)

        metrics[algo] = {
            "pareto_size": len(pareto_front),
            "igd": round(igd, 5),
            "hypervolume": round(hv, 5),
            "hv_contributions": hv_contribs,
            "max_hv_contrib": round(max(hv_contribs), 6),
            "avg_hv_contrib": round(np.mean(hv_contribs), 6)
        }

    return metrics
