"use client";
import React from "react";
import { Habit } from "@/core/types";
import { FaPlusSquare } from "react-icons/fa";
import { HabitDetails } from "./habitDetails";

interface HabitsIncidencesProps {
  data: Habit[];
  token: string;
}

const CreateHabitBox = () => {
  const [value, setValue] = React.useState("");
  return (
    <div className="m-3 mt-10">
      <div className=" flex text-blue-500 gap-4 items-center">
        {/* <FaPlusSquare
          className="cursor-pointer"
          size={28}
          onClick={() => setIsAdding(true)}
        /> */}
        <input
          className="p-1 px-2 rounded-md text-slate-400 outline-none border border-slate-300 bg-white text-base"
          placeholder="Title"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
};

export const HabitsList = ({ data, token }: HabitsIncidencesProps) => {
  return (
    <div className="w-full md:w-4/6 lg:w-3/4 mx-auto">
      <CreateHabitBox />
      <div className="w-full">
        {data.map((item) => (
          <HabitDetails key={item.id} habit={item} token={token} />
        ))}
      </div>
    </div>
  );
};
