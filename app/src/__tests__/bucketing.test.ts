import { describe, it, expect } from "vitest";
import { bucketExercisesByDueDate, type Exercise } from "../services/bucketing";

describe("Bucketing - ", () => {
  describe("bucketExercisesByDueDate", () => {
    it("puts an exercise due today into the 'dueToday' bucket", () => {
      const now = new Date("2025-01-01T10:00:00.000Z");
      const exercise: Exercise = {
        id: "1",
        title: "Sample Exercise",
        dueAt: now.toISOString(),
      };

      const result = bucketExercisesByDueDate([exercise], now);

      expect(result.overdue).toHaveLength(0);
      expect(result.dueToday).toHaveLength(1);
      expect(result.dueToday[0]).toEqual(exercise);
      expect(result.upcoming).toHaveLength(0);
    });

    it.todo("puts an exercise due before today into the 'overdue' bucket");
    it.todo("puts an exercise due after today into the 'upcoming' bucket");
    it.todo("splits multiple exercises into the correct buckets");
  });
});
