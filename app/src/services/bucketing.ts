import type { Exercise } from "../domain/exercise";

export type Buckets = {
  overdue: Exercise[];
  dueToday: Exercise[];
  upcoming: Exercise[];
};

export function bucketExercisesByDueDate(
  exercises: Exercise[],
  now: Date
): Buckets {
  const dayKeyLocal = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  const todayKey = dayKeyLocal(now);

  const buckets: Buckets = {
    overdue: [],
    dueToday: [],
    upcoming: [],
  };

  for (const exercise of exercises) {
    const dueDate = new Date(exercise.dueAt);
    const dueKey = dayKeyLocal(dueDate);

    if (Number.isNaN(dueDate.getTime())) {
      throw new Error(`Invalid dueAt date for exercise ${exercise.id}`);
    }

    if (dueKey < todayKey) {
      buckets.overdue.push(exercise);
    } else if (dueKey === todayKey) {
      buckets.dueToday.push(exercise);
    } else {
      buckets.upcoming.push(exercise);
    }
  }

  return buckets;
}
