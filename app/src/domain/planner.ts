import type { Exercise } from "./exercise";

/**
 * PlannerBuckets
 *
 * Logical grouping of exercises for "review today".
 * The ordering inside each array is important:
 * - Planner decides the sort order.
 * - UI just renders in the order given (no re-sorting in components).
 */
export type PlannerBuckets = {
  overdue: Exercise[];
  dueToday: Exercise[];
  upcoming: Exercise[];
};

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
  getTodayBuckets(): Promise<PlannerBuckets>;
}
