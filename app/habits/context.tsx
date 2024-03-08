"use client";
import React, { PropsWithChildren } from "react";
import { Account, Habit } from "@/core/types";
import { ManagerReducer, managerReducer } from "../../context/manager/reducer";
import { managerContext } from "@/context/manager";

interface Props {
  habits: Habit[];
  account: Account;
  token: string;
}

export const ManagerContextWrapper = ({
  habits,
  account,
  token,
  children,
}: PropsWithChildren<Props>) => {

  const [state, dispatch] = React.useReducer<ManagerReducer>(managerReducer, {
    token,
    account,
    habits,
    selectedHabit: null,
  });

  return (
    <managerContext.Provider
      value={{
        dispatch,
        state,
      }}
    >
      {children}
    </managerContext.Provider>
  );
};
