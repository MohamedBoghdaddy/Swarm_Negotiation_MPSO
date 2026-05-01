# DealHive

DealHive is an AI-powered negotiation platform that leverages Multi-Swarm Particle Swarm Optimization (MPSO) to support dynamic trade negotiations between users and manufacturers.

The system evaluates offers based on price, quality, and delivery time, then uses an intelligent optimization engine to recommend balanced and feasible negotiation outcomes. DealHive provides dedicated interfaces for users and manufacturers, enabling structured, adaptive, and multi-round negotiation.

---

## Tech Stack

- **Stack:** MERN + Python
- **Frontend:** React.js, Axios, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI Engine:** Python Flask microservice using MPSO
- **Authentication:** JWT
- **Deployment:** Vercel for frontend, Render for backend and Python service

---

## Features

### Multi-Agent Negotiation Using MPSO

DealHive applies Multi-Swarm Particle Swarm Optimization to balance user preferences and manufacturer constraints. The optimization engine evaluates multiple possible offers and recommends the most suitable negotiation outcome.

### Dual Interfaces

The platform includes two main interfaces:

- **User Dashboard:** Allows users to submit negotiation requests, review optimized offers, and accept final deals.
- **Manufacturer Portal:** Allows manufacturers to define constraints, review negotiation requests, and respond with feasible counter-offers.

### Multi-Round Optimization

DealHive supports adaptive multi-round negotiation. Users and manufacturers can revise offers, allowing the system to continuously refine recommendations based on updated constraints and preferences.

### Fitness-Based Decision Making

Each offer is evaluated using a fitness score based on weighted negotiation factors, including price, quality, and delivery time. This helps the system identify offers that provide the best balance between both parties.

---

## Negotiation Workflow

The negotiation process follows a structured optimization loop:

1. The user submits an offer, including fabric type, quantity, price range, quality preference, and delivery time.
2. Manufacturers provide their constraints, including minimum price, available quality levels, and delivery capacity.
3. The MPSO engine runs an optimization process across multiple candidate offers.
4. The system ranks and recommends the best deal based on calculated fitness scores.
5. The user can accept the recommended offer or continue negotiation.

---

## Project Structure

```text
DealHive/
├── client/              # React frontend
├── server/              # Node.js backend, including controllers, routes, and models
├── services/            # Python MPSO microservice using Flask
```

---

## Installation

Follow the steps below to run DealHive locally.

### 1. Clone the Repository

```bash
git clone https://github.com/MohamedBoghdaddy/Swarm_Negotiation.git
cd Swarm_Negotiation
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

### 4. Install Python MPSO Service Dependencies

```bash
cd ../services
pip install -r requirements.txt
python app.py
```

---

## API Overview

### POST `/api/negotiation/start`

Triggers a negotiation round by collecting user and manufacturer inputs through the Node.js backend.

### POST `/optimize`

Processes negotiation inputs through the Python MPSO microservice and returns optimized offers sorted by fitness score.

---

## Example Input

Example request body for the `/optimize` endpoint:

```json
{
  "priceRange": [5, 15],
  "qualityPreference": "Premium",
  "deliveryTime": 6
}
```

---

## License

This project is licensed under the MIT License. See the [`LICENSE`](LICENSE) file for details.
