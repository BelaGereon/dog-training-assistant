// scheduling.ts
import type { ScheduleState, ScheduleResult } from "../types";

export const POLICY = {
  ratings: { FORGOT: 0, HARD: 1, OK: 2, EASY: 3 },
  factors: { OK: 1.4, EASY: 2.0 },
  ease: { FORGOT: -0.3, HARD: -0.15, OK: 0.0, EASY: +0.05 },
  easeMin: 1.8,
  easeMax: 3.0,
  hardDays: 2,
  forgotDays: 1,
  deckBaseline: [1, 3, 7, 14, 30],
} as const;

export type Rating = keyof typeof POLICY.ratings; // "FORGOT" | "HARD" | "OK" | "EASY"

export function nextSchedule(
  state: ScheduleState,
  rating: Rating,
  today: Date
): ScheduleResult {
  const proposed = proposedInterval(state.intervalInDays, rating);
  const nextDeck = computeNextDeck(state.deck, rating);
  const baseline = POLICY.deckBaseline[nextDeck - 1];
  const interval = Math.max(proposed, baseline);

  const ease = adjustEase(state.ease, rating);
  const dueAt = addDaysUTC(today, interval);

  return { ...state, intervalInDays: interval, ease, deck: nextDeck, dueAt };
}

// --- helpers ---

function proposedInterval(prev: number, rating: Rating): number {
  switch (rating) {
    case "FORGOT":
      return POLICY.forgotDays;
    case "HARD":
      return POLICY.hardDays;
    case "OK":
      return Math.ceil(prev * POLICY.factors.OK);
    case "EASY":
      return Math.ceil(prev * POLICY.factors.EASY);
  }
}

function computeNextDeck(current: number, rating: Rating): number {
  const unclamped =
    rating === "FORGOT"
      ? 1
      : rating === "HARD"
      ? current - 1
      : rating === "OK"
      ? current
      : current + 1;
  return Math.max(1, Math.min(5, unclamped));
}

function adjustEase(ease: number, rating: Rating): number {
  const delta = POLICY.ease[rating];
  const next = ease + delta;
  return Math.max(POLICY.easeMin, Math.min(POLICY.easeMax, next));
}

function addDaysUTC(d: Date, days: number): Date {
  const utc = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  );
  utc.setUTCDate(utc.getUTCDate() + days);
  return utc;
}
