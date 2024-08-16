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
      s.today.moment = date;
      s.today.formatted = date.format(DATE_FORMAT);
    })),
  }));
}

export {
  createHabitsStore,
};
