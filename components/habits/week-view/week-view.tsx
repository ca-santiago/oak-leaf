'use client';

import { useHabitsStore } from "@/context/habits";
import HabitWeekViewCard from "./web-view-card";

const HabitWeekView = () => {
  const habits = useHabitsStore(s => s.habits.all);

  return (
    <div className="flex flex-col gap-4 mt-3"> 
      { habits.map(h => <HabitWeekViewCard key={ h.id } habit={ h } /> ) }
    </div>
  );
}

export default HabitWeekView;
