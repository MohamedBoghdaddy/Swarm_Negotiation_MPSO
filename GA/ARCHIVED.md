# Archived — experimental prototype

This folder is a standalone, abstract bilateral-negotiation prototype
(issue-based agents, not DealHive's price/quality/delivery domain). It is not
imported by `services/` or `server/`.

DealHive's actual Genetic Algorithm engine is `services/genetic_engine.py`,
which is run via `services/algorithm_runner.py` and compared against
PSO/MPSO and ABC using the shared fitness function in
`services/common_fitness.py`.

This folder is kept for reference only.
