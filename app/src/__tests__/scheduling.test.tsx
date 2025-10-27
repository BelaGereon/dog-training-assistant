import { describe, it, expect } from "vitest";

type ScheduleState = {
  intervalInDays: number; // in days
  ease: number; // ease factor
  deck: number; // deck number
};

// Describes the result of computing the next schedule, including due date
type ScheduleResult = ScheduleState & { dueAt: Date };
// Computes the next schedule based on current state, a rating, and today's date
function nextSchedule(
  state: ScheduleState, // the current scheduling state (interval, ease, deck)
  rating: number, // user's quality rating for the review (e.g., 2 means "OK")
  today: Date // the reference date from which to schedule the next review
): ScheduleResult {
  // Choose a multiplier based on rating; spec for rating=2 is ~40% farther
  const multiplier = rating === 2 ? 1.4 : 1; // use 1.4x for OK, otherwise keep interval unchanged
  // Compute the next interval rounding up to the nearest whole day
  const nextInterval = Math.max(
    1,
    Math.ceil(state.intervalInDays * multiplier)
  ); // ensure at least 1 day
  // Create a new Date for the due date so we don't mutate the input date
  const dueAt = new Date(today); // start from 'today'
  // Add the computed interval in days to obtain the due date
  dueAt.setDate(dueAt.getDate() + nextInterval); // increment by the interval
  // Return the new schedule state carrying over ease and deck, with updated interval and due date
  return { ...state, intervalInDays: nextInterval, dueAt }; // spread existing state and add new fields
}

describe('Scheduling - when I log today as "OK" (rating=2)', () => {
  it("it schedules the next review roughly 40% farther out (rounded up) and sets dueAt accordingly", () => {
    const today = new Date("2025-01-01");

    const currentSchedule: ScheduleState = {
      intervalInDays: 5,
      ease: 2.5,
      deck: 3,
    };

    const result = nextSchedule(currentSchedule, 2, today);

    expect(result.intervalInDays).toBe(7); // 5 * 1.4 = 7
    expect(result.dueAt.toISOString().split("T")[0]).toBe("2025-01-08"); // 2025-01-01 + 7 days
  });
});
