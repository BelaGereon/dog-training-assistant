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
