from agent import NegotiationAgent
from negotiate import negotiate

NUM_ISSUES = 3
ISSUE_VALUES = [5, 5, 5]

agent_a = NegotiationAgent(NUM_ISSUES, ISSUE_VALUES)
agent_b = NegotiationAgent(NUM_ISSUES, ISSUE_VALUES)

result = negotiate(agent_a, agent_b)
from agent import NegotiationAgent
from negotiate import negotiate

# 4 issues: Style, Quantity, Price Tier, Quality
NUM_ISSUES = 4
ISSUE_VALUES = [5, 5, 5, 5]  # Each issue has 5 levels

customer = NegotiationAgent(NUM_ISSUES, ISSUE_VALUES, role="Customer")
factory = NegotiationAgent(NUM_ISSUES, ISSUE_VALUES, role="Clothing Factory")

MAX_ROUNDS = 20
ACCEPTANCE_THRESHOLD = 0.9

print("🧥 Clothing Negotiation Between Customer and Clothing Factory\n")
print("Issues: [Style (0-4), Quantity (0-4), Price Tier (0-4), Quality (0-4)]\n")

for round_num in range(MAX_ROUNDS):
    offer_c = customer.propose_offer()
    score_f = factory.evaluate(offer_c)
    print(f"🟢 Round {round_num + 1} - Customer offers {offer_c} (Factory evaluates: {score_f:.2f})")

    if score_f >= ACCEPTANCE_THRESHOLD:
        print(f"✅ Factory accepted the offer.")
        print(f"🤝 Agreement reached on round {round_num + 1}: {offer_c}")
        break

    factory.opponent_offers.append(offer_c)

    offer_f = factory.propose_offer()
    score_c = customer.evaluate(offer_f)
    print(f"🔵 Round {round_num + 1} - Factory offers {offer_f} (Customer evaluates: {score_c:.2f})")

    if score_c >= ACCEPTANCE_THRESHOLD:
        print(f"✅ Customer accepted the offer.")
        print(f"🤝 Agreement reached on round {round_num + 1}: {offer_f}")
        break

    customer.opponent_offers.append(offer_f)
else:
    print("\n❌ No agreement reached after maximum rounds.")


print("Negotiation Result:", result)