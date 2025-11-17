import { describe, it, expect } from "vitest";
import type { Buckets, Exercise } from "../services/bucketing";

const dayKeyUTC = (d: Date) => d.toISOString().slice(0, 10);

describe("Bucketing - ", () => {
  describe("when an exercise is added", () => {
    const today = new Date("2025-01-01");
    const exercise: Exercise = {
      id: "1",
      title: "Sample Exercise",
      dueAt: today.toISOString(),
    };
    const buckets: Buckets = {
      overdue: [],
      dueToday: [],
      upcoming: [],
    };

    it("places the exercise in the correct bucket based on due date", () => {
      function bucketByDueDate(exercise: Exercise, dueDate: Date): void {
        if (dayKeyUTC(dueDate) === dayKeyUTC(today)) {
          buckets.dueToday.push(exercise);
        }
      }

      const dueDate = new Date(exercise.dueAt);

      bucketByDueDate(exercise, dueDate);

      expect(buckets.overdue).toHaveLength(0);
      expect(buckets.dueToday).toHaveLength(1);
      expect(buckets.dueToday).toContain(exercise);
      expect(buckets.upcoming).toHaveLength(0);
    });
  });
});
