import type { Buckets } from "../services/bucketing";

/**
 * PlannerService
 *
 * Boundary between:
 *   - data & scheduling logic (how due dates are calculated, spaced repetition, Dexie, etc.)
 * and
 *   - UI (Home screen, other pages).
 *
 * Home will depend on this interface, NOT on Dexie or raw DB queries.
 */
export interface PlannerService {
  /**
   * Returns all exercises that are relevant "as of today",
   * grouped into overdue / dueToday / upcoming.
   *
   * Implementation details are hidden behind this contract.
   */
  getTodayBuckets(): Promise<Buckets>;
}
