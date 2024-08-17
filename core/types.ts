import { Account, Habit } from '@prisma/client';
import { Moment } from 'moment';

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

export type HabitsCollection = Habit[];

export interface AuthState {
  account: Account;
  token: string;
  userId: string;
}

export interface HabitsStoreState {
  selectedHabit: Habit | null;
  today: {
    moment: Moment;
    formatted: string;
  };
  habits: {
    all: HabitsCollection;
    allCompleted: HabitsCollection,
    otherHabitsNoReminder: HabitsCollection,
    otherHabitsNoReminderUncompleted: HabitsCollection,
    todayHabits: HabitsCollection,
    todayUncompletedHabits: HabitsCollection,
  }
}

export interface HabitsStoreActions {
  init: (args: HabitsStoreState) => any;
  setHabits: (habits: HabitsStoreState['habits']) => any;
  setToday: (m: Moment) => any;
  setSelectedHabit: (h: Habit) => any;
  removeSelectedHabit: () => any;
}

export type HabitsStore = HabitsStoreState & HabitsStoreActions;




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

export interface YearRange {
  year: string;
  ranges: string[];
}

export type YearRangeCollection = YearRange[];

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
