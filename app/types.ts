export interface Habit {
  id: string;
  habitName: string;
  description?: string;
  createdAt: string;
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
}

export interface Habit_Completions extends Habit {
  completions: Completion[];
}

export interface Habit_Incidences extends Habit {
  incidences: Incidence[];
}
