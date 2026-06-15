# Archived — not the active Python service

This folder is an earlier, single-algorithm (PSO/MPSO-only, `/optimize`)
FastAPI service. It predates `services/`, which is the canonical Python
optimizer used by the Node backend (`/compare-algorithms`, `/full-evaluation`,
PSO/MPSO + ABC + GA).

Nothing in `server/` or `services/` imports from this folder. It is kept for
reference only — do not deploy or wire this up as the active service.
