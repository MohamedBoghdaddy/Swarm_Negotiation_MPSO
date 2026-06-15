def negotiate(agent1, agent2, max_rounds=20, acceptance_threshold=0.9):
    for round_num in range(max_rounds):
        offer1 = agent1.propose_offer()
        if agent2.evaluate(offer1) >= acceptance_threshold:
            return {"agreement": offer1, "round": round_num + 1}
        agent2.opponent_offers.append(offer1)

        offer2 = agent2.propose_offer()
        if agent1.evaluate(offer2) >= acceptance_threshold:
            return {"agreement": offer2, "round": round_num + 1}
        agent1.opponent_offers.append(offer2)

    return {"agreement": None, "round": max_rounds}