import { create } from "zustand"

interface HabitCreationFlowState {
  currentStepIndex: number;
};

interface HabitCreationFlowActions {
  setStepIndex: (i: number) => any;
};

type HabitCreationFlowStore = HabitCreationFlowState & HabitCreationFlowActions;

export const useHabitCreatorStore = create<HabitCreationFlowStore>(set => ({
    currentStepIndex: 0,
    setStepIndex: (i) => set(s => ({ currentStepIndex: i })),
  })
);
