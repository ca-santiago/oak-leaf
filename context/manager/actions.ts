import { Habit } from "@/core/types";
import { ManagerState } from "./reducer";

export interface SetHabitsAction {
  type: "SET_HABITS";
  payload: Habit[];
}

export interface SetInitStateAction {
  type: "SET_INIT_STATE";
  payload: ManagerState;
}

export function setHabits(params: Habit[]): SetHabitsAction {
  return {
    type: "SET_HABITS",
    payload: params,
  };
}

export function setInitState(s: ManagerState): SetInitStateAction {
  return {
    type: "SET_INIT_STATE",
    payload: s,
  };
}