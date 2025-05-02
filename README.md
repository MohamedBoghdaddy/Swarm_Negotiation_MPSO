```markdown
# Tuah App 🤝🧠

*Tuah App* is an AI-powered negotiation platform that leverages *Multi-Swarm Particle Swarm Optimization (MPSO)* to mediate dynamic trade negotiations between users and manufacturers based on *price, quality, and delivery time*.

The platform features dual interfaces—one for users and one for manufacturers—allowing for fair, adaptive, and real-time multi-round negotiation via an intelligent MPSO agent.

```

## ⚙️ Tech Stack

- *Stack*: MERN + Python
- *Frontend*: React.js, Axios, Tailwind CSS (optional)
- *Backend*: Node.js, Express.js
- *Database*: MongoDB
- *AI Engine*: Python (Flask) – MPSO algorithm
- *Authentication*: JWT
- *Deployment*: Vercel (frontend), Render (backend & Python service)

```

## 🚀 Features

- *Multi-Agent Negotiation via MPSO* 🤖  
  Dynamically balances user preferences and manufacturer constraints using swarms of optimization particles.

- *Dual Interfaces* 🧑‍💼🏭  
  - **User Dashboard*: Submit offers and accept optimized deals  
  - **Manufacturer Portal**: Set constraints and auto-respond with feasible counter-offers

- *Multi-Round Optimizatio* 🔄  
  Adaptive negotiation cycles allow re-offers and finalization based on real-time adjustments.

- *Fitness-Based Decision Making* 📊  
  Negotiation decisions are scored based on weighted fitness of price, quality, and delivery.

```

## 📊 Negotiation Workflow

> This outlines the real-time interaction loop between user offers, manufacturer responses, and MPSO optimization:

1. *User submits offer* (fabric type, quantity, price range, quality, delivery time).
2. *Manufacturers input constraints* (minimum price, quality levels, delivery).
3. *MPSO agent runs optimization* over multiple rounds.
4. *System recommends best deal* based on calculated fitness.
5. *User confirms* or requests further negotiation.

```

## 🗂 Project Structure

```
TuahApp/
├── client/              # React frontend
├── server/              # Node.js backend (controllers, routes, models)
├── services/            # Python MPSO microservice (Flask API)
```

```

## 🛠️ Installation

To run Tuah App locally:

#### 1. Clone the Repository

```bash
git clone https://github.com/MohamedBoghdaddy/Swarm_Negotiation.git
cd Swarm_Negotiation
```

### 2. Install Dependencies

#### Frontend:
```bash
cd client
npm install
npm start
```

#### Backend:
```bash
cd ../server
npm install
node server.js
```

#### Python MPSO Service:
```bash
cd ../services
pip install -r requirements.txt
python app.py
```

---

## 🌐 API Overview

### POST `/api/negotiation/start` (Node.js Backend)  
Triggers a negotiation round by collecting user and manufacturer inputs.

### POST `/optimize` (Python MPSO Microservice)  
Processes negotiation inputs and returns optimized offers sorted by fitness.

---

## 📥 Example Input (to `/optimize`)

```json
{
  "priceRange": [5, 15],
  "qualityPreference": "Premium",
  "deliveryTime": 6
}
```

```

## 📜 License

This project is licensed under the MIT License. See the [`LICENSE`](LICENSE) file for details.
```
