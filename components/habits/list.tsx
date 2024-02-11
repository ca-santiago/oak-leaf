"use client";
import React from "react";
import { Habit } from "@/core/types";
import { HabitDetails } from "./card";
import { HabitCreator } from "../createHabit";
import { useManagerContext } from "../../context/manager";
import {
  removeHabit,
  setHabits,
  setSelectedHabit,
} from "@/context/manager/actions";

export const HabitsList = () => {
  const { state, dispatch } = useManagerContext();
  const { habits, token } = state;

  const handleHabitCreated = (h: Habit) => {
    dispatch(setHabits([h, ...habits]));
  };

  const handleHabitUpdate = (h: Habit) => {
    dispatch(setHabits(habits.map((x) => (x.id === h.id ? h : x))));
  };

  const handleDeleteClick = (h: Habit) => {
    dispatch(setHabits(habits.filter((x) => x.id !== h.id)));
  };

  return (
    <div className="w-full">
      <HabitCreator
        onDelete={handleDeleteClick}
        onHabitCreate={handleHabitCreated}
        onHabitUpdate={handleHabitUpdate}
        startOpen={habits.length < 1}
      />
      <div className="w-full grid md:grid-cols-2 grid-rows-1 gap-5 mt-3">
        {habits.map((item) => (
          <HabitDetails
            onEditClick={() => dispatch(setSelectedHabit(item))}
            onDelete={() => dispatch(removeHabit(item.id))}
            key={item.id}
            habit={item}
            token={token}
          />
        ))}
      </div>
    </div>
  );
};
