import { ManagerState } from "./reducer";

export interface SetInitStateAction {
  type: "SET_INIT_STATE";
  payload: ManagerState;
}

export function setInitState(s: ManagerState): SetInitStateAction {
  return {
    type: "SET_INIT_STATE",
    payload: s,
  };
}
