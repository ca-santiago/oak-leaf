"use client";
import React from "react";
import { Account, Habit } from "@/core/types";
import { HabitDetails } from "./habitDetails";
import { HabitCreator } from "./createHabit";

interface HabitsIncidencesProps {
  data: Habit[];
  account: Account;
  token: string;
}

export const HabitsList = ({ data, account, token }: HabitsIncidencesProps) => {
  const [habits, setHabits] = React.useState(data);

  const handleHabitCreated = (h: Habit) => {
    setHabits([h, ...habits]);
  };

  return (
    <div className="w-full md:w-4/6 lg:w-3/4 mx-auto mt-6 pb-10 px-3 md:px-0">
      <HabitCreator
        habits={habits}
        account={account}
        token={token}
        onHabitCreate={handleHabitCreated}
        startOpen={data.length < 1}
      />
      <div className="w-full flex flex-col gap-3 mt-3">
        {habits.map((item) => (
          <HabitDetails key={item.id} habit={item} token={token} />
        ))}
      </div>
    </div>
  );
};
