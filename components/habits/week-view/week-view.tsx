'use client';

import { useHabitsStore } from "@/context/habits";
import HabitWeekViewCard from "./web-view-card";
import React from "react";

const HabitWeekView = () => {
  const habits = useHabitsStore(s => s.habits.all);

  return (
    <div className="flex flex-col gap-2 mt-3"> 
      { habits.map(h => <HabitWeekViewCard key={ h.id } habit={ h } /> ) }
    </div>
  );
}

export default HabitWeekView;
