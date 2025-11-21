import { describe, it, expect } from "vitest";
import { bucketExercisesByDueDate } from "../services/bucketing";
import { type Exercise } from "../domain/exercise";

describe("Bucketing - ", () => {
  describe("bucketExercisesByDueDate", () => {
    it("puts an exercise due today into the 'dueToday' bucket", () => {
      const now = new Date("2025-01-01T10:00:00");
      const exercise: Exercise = {
        id: "1",
        title: "Sample Exercise",
        dueAt: "2025-01-01T18:00:00",
      };

      const result = bucketExercisesByDueDate([exercise], now);

      expect(result.overdue).toHaveLength(0);
      expect(result.dueToday).toHaveLength(1);
      expect(result.dueToday[0]).toEqual(exercise);
      expect(result.upcoming).toHaveLength(0);
    });

    it("puts an exercise due before today into the 'overdue' bucket", () => {
      const now = new Date("2025-01-02T10:00:00");
      const exercise: Exercise = {
        id: "2",
        title: "Overdue Exercise",
        dueAt: "2025-01-01T23:59:59",
      };

      const result = bucketExercisesByDueDate([exercise], now);

      expect(result.overdue).toHaveLength(1);
      expect(result.overdue[0]).toEqual(exercise);
      expect(result.dueToday).toHaveLength(0);
      expect(result.upcoming).toHaveLength(0);
    });

    it("puts an exercise due after today into the 'upcoming' bucket", () => {
      const now = new Date("2025-01-01T10:00:00");
      const exercise: Exercise = {
        id: "3",
        title: "Upcoming Exercise",
        dueAt: "2025-01-02T00:00:00",
      };

      const result = bucketExercisesByDueDate([exercise], now);

      expect(result.overdue).toHaveLength(0);
      expect(result.dueToday).toHaveLength(0);
      expect(result.upcoming).toHaveLength(1);
      expect(result.upcoming[0]).toEqual(exercise);
    });

    it("splits multiple exercises into the correct buckets", () => {
      const now = new Date("2025-01-10T12:00:00");
      const exercises: Exercise[] = [
        {
          id: "1",
          title: "Overdue Exercise",
          dueAt: "2025-01-09T23:59:59",
        },
        {
          id: "2",
          title: "Due Today Exercise",
          dueAt: "2025-01-10T08:00:00",
        },
        {
          id: "3",
          title: "Upcoming Exercise",
          dueAt: "2025-01-11T00:00:00",
        },
      ];

      const result = bucketExercisesByDueDate(exercises, now);

      expect(result.overdue).toHaveLength(1);
      expect(result.overdue[0].id).toBe("1");
      expect(result.dueToday).toHaveLength(1);
      expect(result.dueToday[0].id).toBe("2");
      expect(result.upcoming).toHaveLength(1);
      expect(result.upcoming[0].id).toBe("3");
    });

    it("uses the local calendar day, not UTC, when determining 'today'", () => {
      // Imagine a user in Europe/Berlin (UTC+1).
      // - Exercise is due just after local midnight on Jan 2.
      // - 'now' is midday on Jan 2.
      //
      // In local time, both are Jan 2 → should be 'dueToday'.

      const now = new Date("2025-01-02T12:00:00+01:00");
      const exercise: Exercise = {
        id: "4",
        title: "Edge case: just after midnight",
        dueAt: "2025-01-02T00:01:00+01:00",
      };

      const result = bucketExercisesByDueDate([exercise], now);

      expect(result.overdue).toHaveLength(0);
      expect(result.dueToday).toHaveLength(1);
      expect(result.dueToday[0]).toEqual(exercise);
      expect(result.upcoming).toHaveLength(0);
    });

    it("throws when encountering an exercise with an invalid dueAt", () => {
      const now = new Date("2025-01-01T10:00:00");
      const bad: Exercise = { id: "x", title: "Broken", dueAt: "not-a-date" };

      expect(() => bucketExercisesByDueDate([bad], now)).toThrowError();
    });

    it("orders exercises inside each bucket by due date ascending", () => {
      const now = new Date("2025-01-10T12:00:00");
      const exercises: Exercise[] = [
        { id: "second", title: "", dueAt: "2025-01-10T20:00:00" },
        { id: "first", title: "", dueAt: "2025-01-10T08:00:00" },
      ];

      const result = bucketExercisesByDueDate(exercises, now);

      expect(result.dueToday.map((e) => e.id)).toEqual(["first", "second"]);
    });
  });
});
