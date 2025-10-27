import type { ScheduleState, ScheduleResult } from "../types";

// Computes the next schedule based on current state, a rating, and today's date

export function nextSchedule(
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
