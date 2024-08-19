'use client';

import { useHabitsStore } from "@/context/habits";
import HabitWeekViewCard from "./web-view-card";
import React from "react";

const HabitWeekView = () => {
  const habits = useHabitsStore(s => s.habits.all);
  const today = useHabitsStore(s => s.today);

  React.useEffect(() => {
    console.log('Habits has changed');
  }, [habits]);

  React.useEffect(() => {
    console.log('Today has changed');
  }, [today])

  return (
    <div className="flex flex-col gap-4 mt-3"> 
      { habits.map(h => <HabitWeekViewCard key={ h.id } habit={ h } /> ) }
    </div>
  );
}

export default HabitWeekView;
