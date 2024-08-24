import { registerHabitCreatorField as registerField } from "@/components/habit-creation-flow/manager";
import HabitCreatorFlowHeader from "../habit-creator-flow-header";
import HabitCreatorFlowActionButtons from "../habit-creator-flow-action-buttons";
import HabitCreatorFlowLayout from "../habit-creator-flow-layout";

function HabitCreatorDescriptionStep() {

  return (
    <HabitCreatorFlowLayout>
      <form>
        <input
          className="border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-sm px-2 py-1 w-full"
          placeholder="Description"
          {...registerField('description')}
          />
      </form>
    </HabitCreatorFlowLayout>
  );
}

export default HabitCreatorDescriptionStep;
