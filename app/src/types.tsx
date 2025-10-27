export type Rating = 0 | 1 | 2 | 3; // 0=Forgot, 1=Hard, 2=OK, 3=Easy

export type ScheduleState = {
  intervalInDays: number;
  ease: number;
  deck: number;
};

export type ScheduleResult = ScheduleState & { dueAt: Date };
