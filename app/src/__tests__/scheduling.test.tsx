import { describe, it, expect } from "vitest";
import type { ScheduleResult, ScheduleState } from "../types";
import { nextSchedule } from "../services/scheduling";

const getDateFromISODate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

describe('Scheduling - when I log today as "OK" (rating=2)', () => {
  it("it schedules the next review roughly 40% farther out (rounded up) and sets dueAt accordingly", () => {
    const today: Date = new Date("2025-01-01");

    const currentSchedule: ScheduleState = {
      intervalInDays: 5,
      ease: 2.5,
      deck: 3,
    };

    const result: ScheduleResult = nextSchedule(currentSchedule, 2, today);
    const dueDateISO = getDateFromISODate(result.dueAt);

    expect(result.intervalInDays).toBe(7); // 5 * 1.4 = 7
    expect(dueDateISO).toBe("2025-01-08"); // 2025-01-01 + 7 days
  });
});
