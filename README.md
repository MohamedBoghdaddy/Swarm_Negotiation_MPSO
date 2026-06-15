# DealHive

DealHive is an AI-powered negotiation platform that compares three
optimization algorithms — **PSO/MPSO**, **Artificial Bee Colony (ABC)**, and a
**Genetic Algorithm (GA)** — to support dynamic trade negotiations between
users and manufacturers.

The system evaluates offers based on price, quality, and delivery time. All
three algorithms are evaluated with the **same shared fitness function**
(higher fitness = better offer), so their results can be compared fairly on
offer quality, fitness score, and execution time. DealHive provides dedicated
interfaces for users and manufacturers, enabling structured, adaptive,
multi-round negotiation.

---

## Tech Stack

- **Stack:** MERN + Python
- **Frontend:** React.js, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI Engine:** Python FastAPI microservice (`services/`) running PSO/MPSO,
  ABC, and GA negotiation engines
- **Authentication:** JWT

---

## Features

### Multi-Algorithm Negotiation Optimization

DealHive runs three independent optimization engines — PSO/MPSO, ABC, and
GA — against the same negotiation request and ranks their offers using a
shared fitness function (price, quality, and delivery satisfaction for both
the user and the manufacturer).

### Dual Interfaces

- **User Dashboard:** Allows users to submit negotiation requests and review
  optimized offers.
- **Manufacturer Portal:** Allows manufacturers to define product constraints
  (price, delivery, quality, capacity) that feed the optimizer.

### Multi-Round Optimization

DealHive supports adaptive multi-round negotiation. Users and manufacturers
can revise offers, allowing the system to continuously refine recommendations
based on updated constraints and preferences.

### Fitness-Based Decision Making

Each candidate offer is scored with `services/common_fitness.py`, which
combines user satisfaction and manufacturer satisfaction (price, quality, and
delivery) into a single 0–1 fitness score. **Higher is always better**, for
all three algorithms.

---

## Negotiation Workflow

1. The user submits a request, including fabric type, quantity, price range,
   quality preference, and delivery time.
2. Manufacturers' stored constraints (minimum price, quality levels, delivery
   capacity, etc.) are sent along with the request.
3. The Node backend forwards the request to the Python service's
   `/compare-algorithms` endpoint.
4. PSO/MPSO, ABC, and GA each independently optimize an offer per
   manufacturer, scored with the same fitness function.
5. The backend saves the comparison results and returns them to the
   frontend, including the winning algorithm/offer per manufacturer.

---

## Project Structure

```text
Swarm_Negotiation_MPSO/
├── client/              # React frontend
├── server/              # Node.js backend (controllers, routes, models)
├── services/            # ACTIVE Python FastAPI optimizer (PSO/MPSO, ABC, GA)
├── abc/services/        # ARCHIVED — earlier single-algorithm prototype
└── GA/                   # ARCHIVED — unrelated experimental negotiation prototype
```

`services/` is the only Python service used by the Node backend.
`abc/services/` and `GA/` are kept for reference only — see the
`ARCHIVED.md` file in each folder.

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/MohamedBoghdaddy/Swarm_Negotiation_MPSO.git
cd Swarm_Negotiation_MPSO
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
npm start
```

### 3. Install Backend Dependencies

```bash
cd ../server
npm install
node server.js
```

Required environment variables (`server/.env`):

```env
PORT=4000
MONGO_URL=mongodb://localhost:27017/dealhive
JWT_SECRET=change-me
CLIENT_URL=http://localhost:3000
PYTHON_API_BASE_URL=http://127.0.0.1:8000
```

### 4. Install and Run the Python Optimization Service

```bash
cd ../services
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Once running, interactive API docs are available at
`http://127.0.0.1:8000/docs`.

---

## API Overview

### POST `/api/negotiation/start`

Runs a full PSO/MPSO + ABC + GA comparison via the Node backend and persists
the negotiation session.

### POST `/compare-algorithms` (Python service)

Runs PSO/MPSO, ABC, and GA for each manufacturer and returns ranked,
schema-compatible results.

Example request body:

```json
{
  "user": {
    "fabricType": "Cotton",
    "quantity": 500,
    "priceRange": 1000,
    "qualityPreference": "Premium",
    "deliveryTimeline": 5
  },
  "manufacturers": [
    {
      "id": 1,
      "initialOffer": { "price": 1200, "quality": "Standard", "delivery": 10 },
      "minPrice": 800,
      "minDelivery": 3,
      "qualities": ["Economy", "Standard", "Premium"],
      "maxQualityCost": 0.8,
      "deliveryCapacity": 9
    }
  ],
  "weights": { "user": 0.5, "manufacturer": 0.5 }
}
```

Each algorithm result has the shape:

```json
{
  "manufacturerID": 1,
  "optimizedOffer": { "price": 950.0, "delivery": 7, "quality": "Standard" },
  "fitness": 0.81,
  "metadata": { "execution_time": 0.12 }
}
```

### POST `/full-evaluation` (Python service)

Computes classification and Pareto-front metrics across a batch of
`/compare-algorithms` results.

---

## License

This project is licensed under the MIT License. See the [`LICENSE`](LICENSE)
file for details.
