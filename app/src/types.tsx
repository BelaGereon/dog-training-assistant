export type ScheduleState = {
  intervalInDays: number;
  ease: number;
  deck: number;
};

export type ScheduleResult = ScheduleState & { dueAt: Date };
