import type { ScheduleState, ScheduleResult, Rating } from "../types";

const OK_FACTOR = 1.4; // multiplier for "OK" rating to extend interval by ~40%
const EASY_FACTOR = 2.0; // multiplier for "Easy" rating to double the interval

export function nextSchedule(
  currentState: ScheduleState,
  userRating: Rating,
  today: Date
): ScheduleResult {
  const nextInterval = getNextInterval(userRating, currentState.intervalInDays);
  const ease = getEase(userRating, currentState.ease);

  const dueAt = new Date(today);
  dueAt.setDate(dueAt.getDate() + nextInterval);

  // Return the new schedule state carrying over ease and deck, with updated interval and due date
  return { ...currentState, intervalInDays: nextInterval, ease, dueAt }; // spread existing state and add new fields
}

function getNextInterval(userRating: Rating, intervalInDays: number): number {
  if (userRating === 0) {
    return 1; // if "Forgot", schedule for next day
  }

  if (userRating === 1) {
    return 2; // if "Hard", schedule for 2 days later
  }

  const ratingMultiplier =
    userRating === 2 ? OK_FACTOR : userRating === 3 ? EASY_FACTOR : 1;

  return Math.max(
    1, // ensure at least 1 day
    Math.ceil(intervalInDays * ratingMultiplier)
  );
}

function getEase(userRating: Rating, currentEase: number): number {
  const EASE_BOTTOM_CAP = 1.8;
  const EASE_TOP_CAP = 3;

  if (userRating === 0) {
    return Math.max(EASE_BOTTOM_CAP, currentEase - 0.3); // decrease ease but not below 1.8
  }

  if (userRating === 1) {
    return Math.max(EASE_BOTTOM_CAP, currentEase - 0.15); // decrease ease but not below 1.3
  }

  if (userRating === 3) {
    return Math.min(EASE_TOP_CAP, currentEase + 0.05); // increase ease but not above 3
  }

  return currentEase; // keep ease unchanged for "OK"
}
