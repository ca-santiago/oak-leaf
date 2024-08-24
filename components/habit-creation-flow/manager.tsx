import { createStepFollower } from "@/core/step-follower-manager";
import HabitCreatorDescriptionStep from "@/components/habit-creation-flow/steps/creator-flow-desciption";
import HabitCreatorIconStep from "@/components/habit-creation-flow/steps/creator-flow-icon";
import HabitCreatorTitleStep from "@/components/habit-creation-flow/steps/creator-flow-title";
import Joi from "joi";
import HabitCreatorColorStep from "./steps/creator-flow-color";
import { Habit } from "@prisma/client";

export const HabitCreatorFlowStepKey = {
  "title": "title",
  "description": "description",
  "color": "color",
  "icon": "icon",
};

export function isValidStepKey(key: string): boolean {
  return !!HabitCreatorFlowStepKey[key];
}

type HabitCreationFlowState = Exclude<Habit, 'id'> & {
  id?: string;
};

const stepFollower = createStepFollower<HabitCreationFlowState>({
  steps: [
    {
      component: HabitCreatorTitleStep,
      key: HabitCreatorFlowStepKey.title,
      uiStrings: {
        title: 'Habit name',
        description: 'Lets add a title',
      },
      fields: {
        habitName: Joi.string().min(3).required(),
      },
    },
    {
      component: HabitCreatorDescriptionStep,
      key: HabitCreatorFlowStepKey.description,
      uiStrings: {
        title: 'Descripción',
        // description: "Agreguemos mas detalles"
      },
      fields: {
        'description': Joi.string().optional(),
      },
    },
    {
      component: HabitCreatorIconStep,
      key: HabitCreatorFlowStepKey.color,
      uiStrings: {
        title: 'Icon',
      },
      fields: {
        iconKey: Joi.string().required(),
      },
    },
    {
      component: HabitCreatorColorStep,
      key: HabitCreatorFlowStepKey.title,
      uiStrings: {
        title: 'Color',
      },
      fields: {
        colorKey: Joi.string().required(),
      },
    },
  ],
  initialState: {
    colorKey: '',
    completions: '',
    createdAt: new Date(),
    daysOfWeek: '',
    description: '',
    habitName: '',
    hourOfDay: '',
    iconKey: '',
    periodicity: '',
    userId: '',
    id: ''
  }
});

export const {
  registerField: registerHabitCreatorField,
  useStepFollower,
  useActions: useHabitCreatorActions,
  useStepInfo: useHabitCreatorStepInfo,
  useStepState: useHabitCreatorStepState,
} = stepFollower;
