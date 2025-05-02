from flask import Flask, request, jsonify
from mpso_engine import run_mpso

app = Flask(__name__)

@app.route('/optimize', methods=['POST'])
def optimize():
    data = request.get_json()
    user = data['user']
    manufacturers = data['manufacturers']
    weights = data.get('weights', {
        "price": 0.4,
        "quality": 0.4,
        "delivery": 0.2
    })

    results = run_mpso(user, manufacturers, weights)

    best = results[0]
    rejected = results[1:]

    return jsonify({
        "recommended": best,
        "rejected": rejected,
        "allResults": results
    })

if __name__ == '__main__':
    app.run(port=8000)
