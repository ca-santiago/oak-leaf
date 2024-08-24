import { useHabitCreatorStepInfo } from "./manager";


function HabitCreatorFlowHeader() {
  const {
    stepKey,
    strings,
    fieldNames,
    fields
  } = useHabitCreatorStepInfo();

  return (
    <div className="ml-1">
      <h3 className="font-semibold text-lg text-slate-700">{ strings.title }</h3>
      { strings.description && <p>{ strings.description }</p> }
    </div>
  );
}

export default HabitCreatorFlowHeader;
