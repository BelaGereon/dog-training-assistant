import type { ScheduleState, ScheduleResult, Rating } from "../types";

const OK_FACTOR = 1.4; // multiplier for "OK" rating to extend interval by ~40%

export function nextSchedule(
  currentState: ScheduleState,
  userRating: Rating,
  today: Date
): ScheduleResult {
  const ratingMultiplier = userRating === 2 ? OK_FACTOR : 1;

  function getNextInterval(): number {
    if (userRating === 0) {
      return 1; // if "Forgot", schedule for next day
    }

    return Math.max(
      1,
      Math.ceil(currentState.intervalInDays * ratingMultiplier)
    );
  } // ensure at least 1 day

  // Compute the next interval rounding up to the nearest whole day
  const nextInterval = getNextInterval();

  // Create a new Date for the due date so we don't mutate the input date
  const dueAt = new Date(today);

  dueAt.setDate(dueAt.getDate() + nextInterval);

  // Return the new schedule state carrying over ease and deck, with updated interval and due date
  return { ...currentState, intervalInDays: nextInterval, dueAt }; // spread existing state and add new fields
}
