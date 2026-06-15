import sys

# The algorithm engines print emoji/arrow characters for progress logging.
# On Windows, uvicorn's stdout/stderr default to the legacy "charmap"
# encoding, which raises UnicodeEncodeError on those characters and turns
# into a 400 response. Force UTF-8 so those prints can't crash requests.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any
from algorithm_runner import run_all_algorithms
from evaluation_metrics import compute_confusion_metrics

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
                'time_comparison': {k: v['metadata']['execution_time'] for k, v in algo_results.items()}
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


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/full-evaluation")
async def full_evaluation(algorithm_results: List[AlgorithmComparisonResult]):
    try:
        # Imported lazily because pygmo (used for hypervolume metrics) is
        # difficult to install via pip on Windows. /compare-algorithms and
        # /health do not depend on it.
        try:
            from pareto_metrics import calculate_pareto_metrics
        except ImportError as imp_err:
            raise HTTPException(
                status_code=503,
                detail=(
                    "Pareto metrics unavailable: 'pygmo' is not installed. "
                    f"Install it (e.g. via conda) to use /full-evaluation. ({imp_err})"
                ),
            )

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
        all_times = [algo['metadata']['execution_time'] for res in algorithm_results for algo in res.algorithms.values()]
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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
