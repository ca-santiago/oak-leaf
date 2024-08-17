"use client";

import React from "react";
import { HabitDetails } from "./card";
import { HabitCreator } from "../createHabit";
import { useHabitsStore } from "@/context/habits";

// TODO: Commented lines are because we are moving off dispatch actions on managerContext
// Those will be replaced by useHabitsStore functions

export const HabitsList = () => {
  const setSelectedHabit = useHabitsStore(s => s.setSelectedHabit);
  const habits = useHabitsStore(s => s.habits.all);

  // const handleHabitCreated = (h: Habit) => {
  //   dispatch(setHabits([h, ...habits]));
  // };

  // const handleHabitUpdate = (h: Habit) => {
  //   dispatch(setHabits(habits.map((x) => (x.id === h.id ? h : x))));
  // };

  // const handleDeleteClick = (h: Habit) => {
  //   dispatch(setHabits(habits.filter((x) => x.id !== h.id)));
  // };

  return (
    <div className="w-full max-h-90">
      <HabitCreator
        // onDelete={handleDeleteClick}
        // onHabitCreate={handleHabitCreated}
        // onHabitUpdate={handleHabitUpdate}
        startOpen={habits.length < 1}
      />
      <div className="w-full grid md:grid-cols-1 grid-rows-1 max-md:gap-3 gap-5 mt-3 h-full">
        { habits.map(item => (
          <HabitDetails
            onEditClick={ () => setSelectedHabit(item) }
            key={ item.id }
            habit={ item }
          />
        )) }
      </div>
    </div>
  );
};
