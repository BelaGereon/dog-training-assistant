export type Exercise = {
  id: string;
  title: string;
  dueAt: string;
};

export type Buckets = {
  overdue: Exercise[];
  dueToday: Exercise[];
  upcoming: Exercise[];
};

export function bucketExercisesByDueDate(
  exercises: Exercise[],
  now: Date
): Buckets {
  const dayKeyUTC = (d: Date) => d.toISOString().split("T")[0];

  const buckets: Buckets = {
    overdue: [],
    dueToday: [],
    upcoming: [],
  };

  for (const exercise of exercises) {
    const dueDate = new Date(exercise.dueAt);
    const dueKey = dayKeyUTC(dueDate);

    if (dueKey === dayKeyUTC(now)) {
      buckets.dueToday.push(exercise);
    }
    if (dueKey < dayKeyUTC(now)) {
      buckets.overdue.push(exercise);
    }
  }

  return buckets;
}
