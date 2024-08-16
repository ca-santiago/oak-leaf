'use client';

import React, { createContext, PropsWithChildren, useContext, useRef } from "react";
import { createHabitsStore } from "../habitsStore";
import { HabitsCollection, HabitsStore } from "@/core/types";

import { useStore } from "zustand";
import moment, { Moment } from "moment";
import { DATE_FORMAT } from "@/core/constants";
import { computeHabitsInfo } from "@/helpers/habits";


export type HabitsStoreApi = ReturnType<typeof createHabitsStore>;

const habitsContext = createContext<HabitsStoreApi | undefined>(undefined);

interface ProviderProps {
  habits: HabitsCollection;
}

export const HabitsContextProvider = (props: PropsWithChildren<ProviderProps>) => {
  const {
    habits,
  } = props;

  const storeRef = useRef<HabitsStoreApi>();

  if (!storeRef.current) {
    const today = moment();
    storeRef.current = createHabitsStore({
      habits: computeHabitsInfo(habits, moment()),
      today: {
        moment: today,
        formatted: today.format(DATE_FORMAT),
      }
    });
  }

  const setHabits = useStore(storeRef.current, s => s.setHabits);

  React.useEffect(() => {
    setHabits(computeHabitsInfo(habits, moment()));
  }, [habits]);

  return (
    <habitsContext.Provider value={storeRef.current}>
      {props.children}
    </habitsContext.Provider>
  );
}

export const useHabitsStore = <T,>(
  selector: (store: HabitsStore) => T,
): T => {
  const habitsStoreContext = useContext(habitsContext);

  if (!habitsStoreContext) throw new Error(`${name} myst be used within ${HabitsContextProvider.name}`);

  return useStore(habitsStoreContext, selector);
}
