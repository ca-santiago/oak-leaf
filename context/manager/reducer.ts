import React from "react";
import {
  SetInitStateAction,
} from "./actions";
import { Account } from "@/core/types";

export interface ManagerState {
  token: string;
  account: Account;
  userId: string;
}
export type ManagerReducerAction = SetInitStateAction;
export type ManagerReducer = React.Reducer<ManagerState, ManagerReducerAction>;

export const managerReducer: ManagerReducer = (state, action) => {
  switch (action.type) {
    case "SET_INIT_STATE":
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};
