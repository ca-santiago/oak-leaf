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

export interface SetSelectedHabitAction {
  type: "SET_SELECTED_HABIT";
  payload: Habit;
}

export interface RemoveHabitAction {
  type: "REMOVE_HABIT";
  payload: string;
}

export interface CleanSelectedHabitAction {
  type: "CLEAN_SELECTED_HABIT";
}

export function setHabits(params: Habit[]): SetHabitsAction {
  return {
    type: "SET_HABITS",
    payload: params,
  };
}

export function removeHabit(hId: string): RemoveHabitAction {
  return {
    type: "REMOVE_HABIT",
    payload: hId,
  };
}

export function setInitState(s: ManagerState): SetInitStateAction {
  return {
    type: "SET_INIT_STATE",
    payload: s,
  };
}

export function setSelectedHabit(h: Habit): SetSelectedHabitAction {
  return {
    type: "SET_SELECTED_HABIT",
    payload: h,
  };
}

export function cleanSelectedHabit(): CleanSelectedHabitAction {
  return {
    type: "CLEAN_SELECTED_HABIT",
  };
}
