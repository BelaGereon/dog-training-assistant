**Summary**
Service that buckets exercises into Overdue / Due Today / Upcoming and sorts correctly.

**Acceptance Criteria**
- Overdue: dueAt < today; Due Today: dueAt === today; Upcoming: dueAt > today.
- Sorted oldest overdue first ? due today ? nearest upcoming.

**Test Plan**
- Unit tests with fixed dates; verify bucketing + sort order.
