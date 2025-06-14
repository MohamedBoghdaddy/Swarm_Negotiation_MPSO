from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any
from algorithm_runner import run_all_algorithms
from evaluation_metrics import compute_confusion_metrics
from pareto_metrics import calculate_pareto_metrics

app = FastAPI()

# --- Input Models ---
class ManufacturerData(BaseModel):
    id: int
    initialOffer: Dict[str, Any]
    minPrice: float
    minDelivery: int
    qualities: List[str]
    maxQualityCost: float
    deliveryCapacity: int

class UserData(BaseModel):
    fabricType: str
    quantity: int
    priceRange: float
    qualityPreference: str
    deliveryTimeline: int

class RequestData(BaseModel):
    user: UserData
    manufacturers: List[ManufacturerData]
    weights: Dict[str, float]

class AlgorithmComparisonResult(BaseModel):
    manufacturer_id: int
    algorithms: Dict[str, Dict[str, Any]]
    winner: str
    winning_offer: Dict[str, Any]
    comparison_metrics: Dict[str, Any]


# --- Routes ---
@app.post("/compare-algorithms")
async def compare_algorithms(request_data: RequestData):
    try:
        user = request_data.user.dict()
        manufacturers = [m.dict() for m in request_data.manufacturers]
        weights = request_data.weights

        all_results = []

        for manufacturer in manufacturers:
            algo_results = run_all_algorithms(user, manufacturer, weights)
            winner = max(algo_results.keys(), key=lambda k: algo_results[k]['fitness'])

            comparison = {
                'fitness_comparison': {k: v['fitness'] for k, v in algo_results.items()},
                'time_comparison': {k: v['execution_time'] for k, v in algo_results.items()}
            }

            all_results.append({
                "manufacturer_id": manufacturer['id'],
                "algorithms": algo_results,
                "winner": winner,
                "winning_offer": algo_results[winner],
                "comparison_metrics": comparison
            })

        return JSONResponse(all_results)

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/full-evaluation")
async def full_evaluation(algorithm_results: List[AlgorithmComparisonResult]):
    try:
        true_winners = [res.winner for res in algorithm_results]
        predicted_winners = true_winners  # Placeholder

        class_metrics = compute_confusion_metrics(true_winners, predicted_winners)

        # Build Pareto input
        pareto_data = {}
        for res in algorithm_results:
            pareto_data[res.manufacturer_id] = {
                'MPSO': [res.algorithms['MPSO']['fitness'], res.algorithms['MPSO']['execution_time']],
                'ABC-MNG': [res.algorithms['ABC-MNG']['fitness'], res.algorithms['ABC-MNG']['execution_time']],
                'GA-HV': [res.algorithms['GA-HV']['fitness'], res.algorithms['GA-HV']['execution_time']]
            }

        # Calculate reference point based on worst-case (max time, max fitness buffer)
        all_times = [algo['execution_time'] for res in algorithm_results for algo in res.algorithms.values()]
        reference_point = [1.0, max(all_times) * 1.1]

        pareto_metrics = {}
        for mid, algo_points in pareto_data.items():
            pareto_metrics[mid] = calculate_pareto_metrics({k: [v] for k, v in algo_points.items()}, reference_point)

        return JSONResponse({
            "classification_metrics": class_metrics,
            "pareto_metrics": pareto_metrics
        })

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
