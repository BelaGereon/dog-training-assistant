import type { Exercise } from "../domain/exercise";

export type Buckets = {
  overdue: Exercise[];
  dueToday: Exercise[];
  upcoming: Exercise[];
};

const dayKeyLocal = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const parseDueDate = (exercise: Exercise): Date => {
  const dueDate = new Date(exercise.dueAt);
  if (Number.isNaN(dueDate.getTime())) {
    throw new Error(`Invalid dueAt date for exercise ${exercise.id}`);
  }
  return dueDate;
};

const byDueDate = (a: Exercise, b: Exercise) =>
  parseDueDate(a).getTime() - parseDueDate(b).getTime();

export function bucketExercisesByDueDate(
  exercises: Exercise[],
  now: Date
): Buckets {
  const todayKey = dayKeyLocal(now);
  const buckets: Buckets = {
    overdue: [],
    dueToday: [],
    upcoming: [],
  };

  for (const exercise of exercises) {
    const dueDate = parseDueDate(exercise);
    const dueKey = dayKeyLocal(dueDate);

    if (dueKey < todayKey) {
      buckets.overdue.push(exercise);
    } else if (dueKey === todayKey) {
      buckets.dueToday.push(exercise);
    } else {
      buckets.upcoming.push(exercise);
    }
  }

  buckets.overdue.sort(byDueDate);
  buckets.dueToday.sort(byDueDate);
  buckets.upcoming.sort(byDueDate);

  return buckets;
}
