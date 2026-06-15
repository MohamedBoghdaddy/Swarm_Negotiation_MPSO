import numpy as np

def generate_random_utility_function(num_issues, issue_values):
    weights = np.random.dirichlet(np.ones(num_issues))
    issue_prefs = [np.random.rand(n) for n in issue_values]
    for i in range(num_issues):
        issue_prefs[i] /= np.sum(issue_prefs[i])
    return weights, issue_prefs

def evaluate_offer(offer, weights, issue_prefs):
    score = 0
    for i in range(len(offer)):
        score += weights[i] * issue_prefs[i][offer[i]]
    return score