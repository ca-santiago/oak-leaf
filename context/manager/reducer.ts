import React from "react";
import { SetHabitsAction, SetInitStateAction } from "./actions";
import { Account, Habit } from "@/core/types";

export interface ManagerState {
  habits: Habit[];
  token: string;
  account: Account;
  selectedHabit: Habit | null;
}

export type ManagerReducerAction = SetHabitsAction | SetInitStateAction;
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
    default:
      return state;
  }
};
