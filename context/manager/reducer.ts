import React from "react";
import {
  CleanSelectedHabitAction,
  RemoveHabitAction,
  SetHabitsAction,
  SetInitStateAction,
  SetSelectedHabitAction,
} from "./actions";
import { Account, Habit } from "@/core/types";

export interface ManagerState {
  habits: Habit[];
  token: string;
  account: Account;
  selectedHabit: Habit | null;
}

export type ManagerReducerAction =
  | SetHabitsAction
  | SetInitStateAction
  | SetSelectedHabitAction
  | CleanSelectedHabitAction
  | RemoveHabitAction;

export type ManagerReducer = React.Reducer<ManagerState, ManagerReducerAction>;

export const managerReducer: ManagerReducer = (state, action): ManagerState => {
  switch (action.type) {
    case "SET_HABITS":
      return {
        ...state,
        habits: action.payload,
      };
    case "SET_INIT_STATE":
      return {
        ...action.payload,
      };
    case "SET_SELECTED_HABIT": {
      return {
        ...state,
        selectedHabit: action.payload,
      };
    }
    case "CLEAN_SELECTED_HABIT": {
      return {
        ...state,
        selectedHabit: null,
      };
    }
    case "REMOVE_HABIT": {
      return {
        ...state,
        habits: state.habits.filter((h) => h.id !== action.payload),
      };
    }
    default:
      return state;
  }
};
