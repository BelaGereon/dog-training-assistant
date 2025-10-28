import { describe, it, expect, beforeEach } from "vitest";
import type { ScheduleResult, ScheduleState } from "../types";
import { nextSchedule } from "../services/scheduling";

const iso = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

describe('Scheduling - when I log today as "OK" (rating=2)', () => {
  const today: Date = new Date("2025-01-01");
  const currentSchedule: ScheduleState = {
    intervalInDays: 5,
    ease: 2.5,
    deck: 3,
  };

  let result: ScheduleResult;

  beforeEach(() => {
    result = nextSchedule(currentSchedule, 2, today);
  });

  it("it schedules the next review roughly 40% farther out (rounded up) and sets dueAt accordingly", () => {
    expect(result.intervalInDays).toBe(7); // 5 * 1.4 = 7
    expect(iso(result.dueAt)).toBe("2025-01-08"); // 2025-01-01 + 7 days
  });

  it("it does not change the ease of the excercise", () => {
    expect(result.ease).toBe(currentSchedule.ease);
  });

  it("it does not change the deck of the excercise", () => {
    expect(result.deck).toBe(currentSchedule.deck);
  });
});

describe('Scheduling - when I log today as "Forgot" (rating=0)', () => {
  it("it schedules the next review for the next day", () => {
    const today: Date = new Date("2025-01-01");

    const currentSchedule: ScheduleState = {
      intervalInDays: 10,
      ease: 2.5,
      deck: 3,
    };

    const result: ScheduleResult = nextSchedule(currentSchedule, 0, today);

    expect(result.intervalInDays).toBe(1);
    expect(iso(result.dueAt)).toBe("2025-01-02"); // 2025-01-01 + 1 day
    expect(result.ease).toBe(currentSchedule.ease);
    expect(result.deck).toBe(currentSchedule.deck);
  });
});

describe('Scheduling - when I log today as "Easy" (rating=3)', () => {
  it("it doubles the training interval and sets dueAt accordingly", () => {
    const today: Date = new Date("2025-01-01");

    const currentSchedule: ScheduleState = {
      intervalInDays: 4,
      ease: 2.5,
      deck: 3,
    };

    const result: ScheduleResult = nextSchedule(currentSchedule, 3, today);

    expect(result.intervalInDays).toBe(8);
    expect(iso(result.dueAt)).toBe("2025-01-09"); // 2025-01-01 + 8 days
    expect(result.ease).toBe(currentSchedule.ease);
    expect(result.deck).toBe(currentSchedule.deck);
  });
});

describe('Scheduling - when I log today as "Hard" (rating=1)', () => {
  it("it schedules the next review for 2 days later", () => {
    const today: Date = new Date("2025-01-01");

    const currentSchedule: ScheduleState = {
      intervalInDays: 10,
      ease: 2.5,
      deck: 3,
    };

    const result: ScheduleResult = nextSchedule(currentSchedule, 1, today);

    expect(result.intervalInDays).toBe(2);
    expect(iso(result.dueAt)).toBe("2025-01-03"); // 2025-01-01 + 2 days
    expect(result.ease).toBe(currentSchedule.ease);
    expect(result.deck).toBe(currentSchedule.deck);
  });
});
