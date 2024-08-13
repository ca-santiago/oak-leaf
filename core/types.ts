export type {
  Habit,
  Account,
  AccountInvite,
} from '@prisma/client';

interface FlaggedResponse<T> {
  success: boolean;
  data: T | null;
};

interface FlaggedSuccess<T> extends FlaggedResponse<T> {
  success: true,
  data: T;
}

interface FlaggedFailure<T> extends FlaggedResponse<T> {
  success: false;
  data: null;
}

export type FlaggedResult<T> = FlaggedSuccess<T> | FlaggedFailure<T>;

export interface ReminderConfig {
  daysOfWeek: string;
  hourOfDay: string;
}

// export interface Habit {
//   id: string;
//   userId: string;
//   habitName: string;
//   description: string | null;
//   createdAt: string;
//   completions: string;

//   iconKey: string;
//   colorKey: string;
// }

// export interface Account {
//   contactEmail: string;
//   createdAt: string;
//   externalId: string;
//   id: string;
//   imageUri: string | null;
//   planEndDate: string;
//   planInitDate: string;
//   planType: string;
//   preferredName: string | null;
//   updatedAt: string;
// }

// export interface AccountInvite {
//   id: string;
//   accountId: string;
//   inviteCode: string;
//   createdAt: string;
//   usedByUserId?: string;
// }

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
