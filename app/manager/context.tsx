"use client";

import React, { PropsWithChildren } from "react";
import { Account } from "@/core/types";
import { ManagerReducer, managerReducer } from "../../context/manager/reducer";
import { managerContext } from "@/context/manager";

interface Props {
  account: Account;
  token: string;
}

export const ManagerContextWrapper = (props: PropsWithChildren<Props>) => {
  const {
    account,
    token,
    children,
  } = props;

  const [state, dispatch] = React.useReducer<ManagerReducer>(managerReducer, {
    token,
    account,
    userId: account.id,
  });

  return (
    <managerContext.Provider
      value={{
        dispatch,
        state,
      }}
    >
      { children }
    </managerContext.Provider>
  );
};
