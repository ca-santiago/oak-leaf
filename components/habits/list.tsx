"use client";
import React from "react";
import { Habit } from "@/core/types";
import { HabitDetails } from "./card";
import { HabitCreator } from "../createHabit";
import { useManagerContext } from "../../context/manager";
import { setHabits, setSelectedHabit } from "@/context/manager/actions";

export const HabitsList = () => {
  const { state, dispatch } = useManagerContext();
  const { habits, token } = state;

  const handleHabitCreated = (h: Habit) => {
    dispatch(setHabits([h, ...habits]));
  };

  const handleHabitUpdate = (h: Habit) => {
    dispatch(setHabits(habits.map((x) => (x.id === h.id ? h : x))));
  };

  return (
    <div className="w-full md:w-4/6 lg:w-3/4 mx-auto mt-6 pb-10 px-3 md:px-0">
      <HabitCreator
        onHabitCreate={handleHabitCreated}
        onHabitUpdate={handleHabitUpdate}
        startOpen={habits.length < 1}
      />
      <div className="w-full flex flex-col gap-3 mt-3">
        {habits.map((item) => (
          <HabitDetails
            onEditClick={() => dispatch(setSelectedHabit(item))}
            key={item.id}
            habit={item}
            token={token}
          />
        ))}
      </div>
    </div>
  );
};
