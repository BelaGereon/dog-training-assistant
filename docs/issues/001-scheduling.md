**Summary**
Implement the pure scheduling function that updates interval/ease/deck and computes the next due date.

**Acceptance Criteria**
- Given (interval,ease,deck) and rating 0/1/2/3 ? returns new (interval,ease,deck,dueAt) per rules in /docs/project-context.md.
- Deck clamps applied (1=1d, 2=3d, 3=7d, 4=14d, 5=30d).
- Deterministic date handling (inject "today").

**Test Plan**
- Unit tests cover: easy doubles interval; ok ~×1.4; hard?2; forgot?1; ease clamps; deck movement; dueAt math.
