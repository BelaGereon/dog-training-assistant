import { describe, it, expect, beforeEach } from "vitest";
import type { ScheduleResult, ScheduleState } from "../types";
import { nextSchedule } from "../services/scheduling";

const iso = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};
const TODAY = new Date("2025-01-01");

describe("Scheduling - ", () => {
  let currentSchedule: ScheduleState;
  let result: ScheduleResult;
  let originalEase: number;

  describe('when I log the exercise as "OK" (rating=2)', () => {
    const rating = 2;
    const run = () => nextSchedule(currentSchedule, rating, TODAY);

    beforeEach(() => {
      currentSchedule = {
        intervalInDays: 5,
        ease: 2.5,
        deck: 3,
      };

      originalEase = currentSchedule.ease;

      result = run();
    });

    it("schedules the next exercise roughly 40% farther out (rounded up) and sets dueAt accordingly", () => {
      expect(result.intervalInDays).toBe(7); // 5 * 1.4 = 7
      expect(iso(result.dueAt)).toBe("2025-01-08"); // 2025-01-01 + 7 days
    });

    it("keeps the ease unchanged", () => {
      expect(result.ease).toBe(originalEase);
    });

    it("retains the same deck", () => {
      expect(result.deck).toBe(currentSchedule.deck);
    });
  });

  describe('when I log the exercise as "Forgot" (rating=0)', () => {
    const rating = 0;

    const run = () => nextSchedule(currentSchedule, rating, TODAY);

    beforeEach(() => {
      currentSchedule = {
        intervalInDays: 10,
        ease: 2.5,
        deck: 3,
      };
      originalEase = currentSchedule.ease;
      result = run();
    });

    it("schedules the exercise for the next day", () => {
      expect(result.intervalInDays).toBe(1);
      expect(iso(result.dueAt)).toBe("2025-01-02"); // 2025-01-01 + 1 day
    });

    it("moves the exercise into the first deck", () => {
      expect(result.deck).toBe(1);
    });

    it("reduces ease by 0.30", () => {
      expect(result.ease).toBeCloseTo(originalEase - 0.3, 5);
    });

    describe("when ease is already near the minimum", () => {
      beforeEach(() => {
        currentSchedule = {
          ...currentSchedule,
          ease: 1.81,
        };
        originalEase = currentSchedule.ease;
        result = run();
      });

      it("clamps ease at 1.8", () => {
        expect(result.ease).toBe(1.8);
      });
    });
  });

  describe('when I log the exercise as "Easy" (rating=3)', () => {
    const rating = 3;
    const run = () => nextSchedule(currentSchedule, rating, TODAY);

    beforeEach(() => {
      currentSchedule = {
        intervalInDays: 4,
        ease: 2.5,
        deck: 3,
      };

      originalEase = currentSchedule.ease;

      result = run();
    });

    it("doubles the training interval and sets dueAt accordingly", () => {
      expect(result.intervalInDays).toBe(8);
      expect(iso(result.dueAt)).toBe("2025-01-09"); // 2025-01-01 + 8 days
    });

    it("raises ease by 0.05", () => {
      expect(result.ease).toBeCloseTo(originalEase + 0.05, 5);
    });

    it("moves the exercise up one deck", () => {
      expect(result.deck).toBe(currentSchedule.deck + 1);
    });

    describe("when ease is already close to the maximum", () => {
      beforeEach(() => {
        currentSchedule = {
          ...currentSchedule,
          ease: 2.98,
        };
        originalEase = currentSchedule.ease;
        result = run();
      });

      it("caps ease at 3.0", () => {
        expect(result.ease).toBe(3.0);
      });
    });
  });

  describe('when I log the exercise as "Hard" (rating=1)', () => {
    const rating = 1;
    const run = () => nextSchedule(currentSchedule, rating, TODAY);

    beforeEach(() => {
      currentSchedule = {
        intervalInDays: 10,
        ease: 2.5,
        deck: 3,
      };
      originalEase = currentSchedule.ease;
      result = run();
    });

    it("schedules the exercise for 2 days later", () => {
      expect(result.intervalInDays).toBe(2);
      expect(iso(result.dueAt)).toBe("2025-01-03"); // 2025-01-01 + 2 days
    });

    it("moves the exercise down one deck", () => {
      expect(result.deck).toBe(currentSchedule.deck - 1);
    });

    it("reduces ease by 0.15", () => {
      expect(result.ease).toBeCloseTo(originalEase - 0.15, 5);
    });

    describe("when ease is already near the minimum", () => {
      beforeEach(() => {
        currentSchedule = {
          ...currentSchedule,
          ease: 1.84,
        };
        originalEase = currentSchedule.ease;
        result = run();
      });

      it("clamps ease at 1.8", () => {
        expect(result.ease).toBe(1.8);
      });
    });
  });
});
