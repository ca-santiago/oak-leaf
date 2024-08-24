import { PropsWithChildren } from "react";
import HabitCreatorFlowActionButtons from "./habit-creator-flow-action-buttons";
import HabitCreatorFlowHeader from "./habit-creator-flow-header";

function HabitCreatorFlowLayout(props: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-4 justify-between h-fit w-full">
      <HabitCreatorFlowHeader />
      { props.children }
      <HabitCreatorFlowActionButtons />
    </div>
  );
}

export default HabitCreatorFlowLayout;
