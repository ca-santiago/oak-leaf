import { HabitsCollection } from "@/core/types";

interface Props {
  habits: HabitsCollection;
}

const WeekView = (props: Props) => {
  const {
    habits,
  } = props;

  return (
    <div>
      
      { habits.map(h => (
        <div key={ h.id }>{ h.habitName }</div>
      )) }
    </div>
  );
}

export default WeekView;
