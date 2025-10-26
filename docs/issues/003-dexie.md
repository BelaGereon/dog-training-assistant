**Summary**
Define Dexie database (exercises, reviews) and simple repository helpers.

**Acceptance Criteria**
- Tables: exercises(id, name, tags, createdAt, lastReviewedAt, intervalDays, dueAt, ease, deck), reviews(id, exerciseId, ratedAt, rating, notes).
- Basic CRUD helpers and an index on dueAt.

**Test Plan**
- Insert exercise + review; query due items for today; verify persistence.
