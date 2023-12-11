export interface Habit {
  id: string;
  habitName: string;
  description?: string;
  createdAt: string;
  incidences: Incidence[];
}

export interface Completion {
  id: string;
  completed: boolean;
  completionDate: string;
}

export interface Incidence {
  id: string;
  habitId: string;
  createdAt: string;
  dateRanges: string;
  endDate: string;
  yearRange: string;
}
