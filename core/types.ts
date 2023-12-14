export interface Habit {
  id: string;
  habitName: string;
  description?: string;
  createdAt: string;
  incidences: Incidence[];

  iconKey: string;
  colorKey: string;
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

export interface Account {
  contactEmail: string;
  createdAt: string;
  externalId: string;
  id: string;
  imageUri: string;
  planEndDate: string;
  planInitDate: string;
  planType: string;
  preferredName: string;
  updatedAt: string;
}
