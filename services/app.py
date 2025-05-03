from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from mpso_engine import run_mpso
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

# CORS Middleware Configuration: Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods, including OPTIONS
    allow_headers=["*"],  # Allows all headers
)

# Define Pydantic models for request validation
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

class RequestData(BaseModel):
    user: User
    manufacturers: List[Manufacturer]
    weights: Optional[dict] = {
        "price": 0.4,
        "quality": 0.4,
        "delivery": 0.2
    }

# POST endpoint to handle the optimization logic
@app.post("/optimize")
async def optimize(request_data: RequestData):
    try:
        # Log the incoming request data to inspect it
        print(request_data)

        user = request_data.user.dict()
        manufacturers = request_data.manufacturers
        weights = request_data.weights

        # Run optimization using the provided data
        results = run_mpso(user, manufacturers, weights)

        best = results[0]
        rejected = results[1:]

        return JSONResponse(content={
            "recommended": best,
            "rejected": rejected,
            "allResults": results
        })

    except Exception as e:
        # Log the error for debugging
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error processing request: {str(e)}")

# If you want to run this app with Uvicorn, use the command below (do not include this in the file):
# uvicorn app:app --reload
