import { HabitsStore, HabitsStoreState } from "@/core/types";
import { createStore } from "zustand/vanilla";
import { produce } from 'immer';
import { DATE_FORMAT } from "@/core/constants";

type State = HabitsStoreState;

const createHabitsStore = (initialState: HabitsStoreState) => {
  return createStore<HabitsStore>((set) => ({
    ...initialState,
    init: ({ habits }) => set(() => ({ habits })),
    setHabits: (hs) => set(() => ({ habits: hs })),
    setToday: (date) => set(produce((s: State) => {
      s.currentWeekMetadata.today = date;
      s.currentWeekMetadata.todayFormatted = date.format(DATE_FORMAT);
    })),
    removeSelectedHabit: () => set(produce((s: State) => {
      s.selectedHabit = null
    })),
    setSelectedHabit: (h) => set(produce((s: State) => {
      s.selectedHabit = h
    })),
  }));
}

export {
  createHabitsStore,
};
