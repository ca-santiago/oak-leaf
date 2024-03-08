export interface Habit {
  id: string;
  habitName: string;
  description?: string;
  createdAt: string;
  completions: string;

  iconKey: string;
  colorKey: string;
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

export interface AccountInvite {
  id: string;
  accountId: string;
  inviteCode: string;
  createdAt: string;
  usedByUserId?: string;
}

// Internal types

export interface YearRangeData {
  year: string;
  ranges: string[];
}

// date               MM-dd                           02-13
// dateRange          <date>:<date>                   02-13:04:25
// dateRanges         <dateRange>,<dateRange>         02-13:04:25,04-27:08:05
// yearRanges         YYYY=<dateRanges>               2024=02-13:04:25,04-27:08:05
// CompletionsRecord   "<yearRanges>|<yearRanges>"     2023=02-13:04:25,04-27:08:05|2024=01-01:01-01:01-01:01-01,

// YearRangeData    { year: YYYY, ranges: <dateRanges> }         // Basically a yearRange formatted into an object to quickly filter by year

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  status: string;
  ownerId: string;
  habitId: string;
  createdAt: string;
}
