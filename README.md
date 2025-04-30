Here is the final, clean version of your `README.md` **without the credits or promotional lines at the bottom**:

```markdown
# 🧠 Tuah App – Multi-Swarm Negotiation Platform

**Tuah App** is a **web-based intelligent negotiation platform** built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) and integrated with a **Python-based Multi-Swarm Particle Swarm Optimization (MPSO)** engine.

It enables users to negotiate with manufacturers based on **price, quality, and delivery time**. The MPSO agent dynamically adjusts offers over multiple rounds to achieve optimal agreements.

---

## 📌 Features

### 🧑‍💼 User Interface
- Submit offers including fabric type, quantity, price range, quality preference, and delivery deadline.
- View optimized manufacturer offers powered by MPSO.
- Finalize the best offer or request further negotiation.

### 🏭 Manufacturer Interface
- Define minimum acceptable price, supported quality levels, and feasible delivery times.
- Automatically respond to incoming negotiations based on internal constraints.

### 🤖 Intelligent MPSO Agent
- Multi-Swarm PSO-based optimization.
- Adapts to both user preferences and manufacturer constraints.
- Supports multi-round negotiations with adaptive offer adjustments.
- Uses weighted fitness scoring to evaluate trade-offs between price, quality, and delivery.

---

## 🧱 Tech Stack

| Layer              | Technology                         |
|-------------------|-------------------------------------|
| Frontend           | React.js, Axios, Tailwind (optional) |
| Backend            | Node.js, Express.js, MongoDB       |
| Optimization Engine| Python Flask + MPSO                |
| Auth & Security    | JWT (JSON Web Tokens)              |
| Deployment         | Vercel (client), Render (server + MPSO) |

---

## 🗂 Project Structure

```
TuahApp/
├── client/              # React frontend
├── server/              # Node.js backend (API, controllers, routes)
├── services/            # Python MPSO microservice (Flask app)
```

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Swarm_Negotiation.git
cd Swarm_Negotiation
```

### 2. Install dependencies

**Frontend (React):**
```bash
cd client
npm install
npm start
```

**Backend (Node.js):**
```bash
cd ../server
npm install
node server.js
```

**Python MPSO Service:**
```bash
cd ../services
pip install -r requirements.txt
python app.py
```

---

## 🌐 API Overview

### POST `/api/negotiation/start` (Node.js)
Starts a new negotiation session by receiving the user’s offer and manufacturer constraints.

### POST `/optimize` (Python MPSO Service)
Processes negotiation data and returns optimized offers sorted by fitness score.

---

## 📊 Example User Input (to `/optimize`)

```json
{
  "priceRange": [5, 15],
  "qualityPreference": "Premium",
  "deliveryTime": 6
}
```

---

## 📘 License

MIT License © 2024 Mohamed Boghdady
```

