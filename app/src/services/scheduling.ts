import type { ScheduleState, ScheduleResult, Rating } from "../types";

const OK_FACTOR = 1.4; // multiplier for "OK" rating to extend interval by ~40%
const EASY_FACTOR = 2.0; // multiplier for "Easy" rating to double the interval

const MIN_EASE = 1.8;
const MAX_EASE = 3.0;

export function nextSchedule(
  currentState: ScheduleState,
  userRating: Rating,
  today: Date
): ScheduleResult {
  const nextInterval = getNextInterval(userRating, currentState.intervalInDays);
  const nextEase = adjustEase(currentState.ease, userRating);

  const dueAt = new Date(today);
  dueAt.setDate(dueAt.getDate() + nextInterval);

  // Return the new schedule state carrying over ease and deck, with updated interval and due date
  return {
    ...currentState,
    intervalInDays: nextInterval,
    ease: nextEase,
    dueAt,
  }; // spread existing state and add new fields
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

function adjustEase(ease: number, rating: Rating): number {
  // prettier-ignore
  const modifier =
    rating === 3 ? +0.05 :
    rating === 1 ? -0.15 :
    rating === 0 ? -0.30 : 0.0;

  const next = ease + modifier;
  return Math.max(MIN_EASE, Math.min(MAX_EASE, next));
}
