from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from mpso_engine import run_mpso

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

class User(BaseModel):
    fabricType: str
    quantity: int
    priceRange: int
    qualityPreference: str
    deliveryTimeline: int

class Manufacturer(BaseModel):
    id: int
    initialOffer: dict
    minPrice: int
    minDelivery: int
    qualities: List[str]
    maxQualityCost: float
    deliveryCapacity: int

class RequestData(BaseModel):
    user: User
    manufacturers: List[Manufacturer]
    weights: Optional[dict] = {
        "user": 0.5, "manufacturer": 0.5
    }

@app.post("/optimize")
async def optimize(request_data: RequestData):
    try:
        user = request_data.user.dict()
        manufacturers = [m.dict() for m in request_data.manufacturers]
        weights = request_data.weights
        results = run_mpso(user, manufacturers, weights)
        return JSONResponse({
            "recommended": results[0],
            "rejected": results[1:],
            "allResults": results
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))