"use client";
import React from "react";
import { Habit } from "@/core/types";
import { FaPlusSquare } from "react-icons/fa";
import { HabitDetails } from "./habitDetails";
import { createHabit } from "@/services/habits";
import { Modal } from "@/components/modal";

interface HabitsIncidencesProps {
  data: Habit[];
  token: string;
}

export const HabitsList = ({ data, token }: HabitsIncidencesProps) => {
  const [habits, setHabits] = React.useState(data);
  const [showModal, setShowModal] = React.useState(false);
  const [habitName, setHabitName] = React.useState("");
  const [habitDescription, setHabitDescription] = React.useState("");

  const canCreate = habitName.length > 2;

  const onCreateClick = () => {
    if (!canCreate) return;

    createHabit({
      name: habitName,
      description: habitDescription,
      token,
    })
      .then((data) => {
        setShowModal(false);
        setHabitName("");
        setHabitDescription("");
        const newHabit: Habit = {
          ...data,
          incidences: [],
        };
        setHabits((prev) => [newHabit, ...prev]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="w-full md:w-4/6 lg:w-3/4 mx-auto mt-6">
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div>
          <div className="w-96 bg-white shadow rounded-md flex flex-col gap-3 p-3">
            <h4 className="text-slate-600 font-semibold ml-0.5">
              Let&apos;s start a new habit
            </h4>
            <input
              placeholder="Name *"
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              className="rounded-md outline-none border border-slate-200 bg-slate-50 text-slate-400 p-1 px-2"
            />
            <textarea
              placeholder="Description"
              value={habitDescription}
              onChange={(e) => setHabitDescription(e.target.value)}
              className="rounded-md outline-none border border-slate-200 bg-slate-50 text-slate-400 text-sm p-1 px-2 max-h-72"
            />
            <button
              className={`w-fit text-white rounded-md p-2 px-3 ml-auto ${
                canCreate ? "bg-blue-500" : "bg-blue-200"
              }`}
              onClick={onCreateClick}
              disabled={!canCreate}
            >
              Create
            </button>
          </div>
        </div>
      </Modal>
      <FaPlusSquare
        className="cursor-pointer text-sky-600"
        size={28}
        onClick={() => setShowModal(true)}
      />
      <div className="w-full flex flex-col gap-3 mt-3">
        {habits.map((item) => (
          <HabitDetails key={item.id} habit={item} token={token} />
        ))}
      </div>
    </div>
  );
};
