```markdown
# 🧠 Tuah App – Multi-Swarm Negotiation Platform

Tuah App is a **web-based intelligent negotiation platform** built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) integrated with a **Python-based Multi-Swarm Particle Swarm Optimization (MPSO)** engine.

It enables users to negotiate with manufacturers based on **price, quality, and delivery time**. The MPSO agent dynamically adjusts offers over multiple rounds to achieve optimal agreements.

---

## 📌 Features

### 🧑‍💼 User Interface
- Submit offer: fabric type, quantity, price range, quality preference, delivery deadline
- Receive optimized manufacturer offers
- Finalize or repeat negotiation

### 🏭 Manufacturer Interface
- Input: minimum acceptable price, quality standards, delivery capabilities
- Automatic participation in negotiations

### 🤖 Intelligent MPSO Agent
- Uses Multi-Swarm PSO to optimize offers based on:
  - User priorities
  - Manufacturer constraints
- Supports multi-round negotiation
- Evaluates trade-offs in real-time

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Axios, Tailwind (optional) |
| Backend | Node.js, Express.js, MongoDB |
| Optimization Engine | Python Flask + MPSO |
| Auth & Security | JWT (JSON Web Tokens) |
| Deployment | Vercel (client), Render/Railway (server & Python) |

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

**Frontend (React)**

```bash
cd client
npm install
npm start
```

**Backend (Node.js)**

```bash
cd ../server
npm install
node server.js
```

**Python MPSO Service**

```bash
cd ../services
pip install -r requirements.txt
python app.py
```

---

## 🌐 API Overview

### POST `/api/negotiation/start`
Starts a negotiation session using user offer and manufacturer constraints.

### POST `/optimize` (Python Service)
Returns optimized manufacturer offers sorted by fitness score.

---

## 📊 Example User Input

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

---
Stack ✖️ Python AI ✖️ Real-Time Multi-Agent Optimization
```



