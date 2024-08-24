import { registerHabitCreatorField as registerField, useHabitCreatorStepInfo } from "@/components/habit-creation-flow/manager";
import HabitCreatorFlowActionButtons from "../habit-creator-flow-action-buttons";
import HabitCreatorFlowHeader from "../habit-creator-flow-header";
import HabitCreatorFlowLayout from "../habit-creator-flow-layout";

function HabitCreatorTitleStep() {
  return (
    <HabitCreatorFlowLayout>
      <form className="">
        <input
          className="border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm px-3 py-2 w-full"
          placeholder="Title" 
          { ...registerField('title') }
          />
      </form>
    </HabitCreatorFlowLayout>
  );
}

export default HabitCreatorTitleStep;
