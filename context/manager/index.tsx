"use client";
import {
  ManagerReducerAction,
  ManagerState,
  managerReducer,
} from "@/context/manager/reducer";
import React, { Dispatch } from "react";

export const INIT_MANAGER_STATE: ManagerState = {} as ManagerState;

interface ManagerContext {
  state: ManagerState;
  dispatch: Dispatch<ManagerReducerAction>;
}

export const managerContext = React.createContext<ManagerContext | null>(null);

export const useManagerContext = () => {
  const context = React.useContext(managerContext);
  if (!context)
    throw new Error(
      "useManagerContext should be used under a valid AppContext.Provider"
    );

  return context;
};

export const ManagerContextProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [state, dispatch] = React.useReducer(managerReducer, INIT_MANAGER_STATE);

  return (
    <managerContext.Provider value={{ dispatch, state }}>
      {children}
    </managerContext.Provider>
  );
};
