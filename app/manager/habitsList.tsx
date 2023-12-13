"use client";
import React from "react";
import { Habit } from "@/core/types";
import { FaPlusSquare } from "react-icons/fa";
import { HabitDetails } from "./habitDetails";
import { createHabit } from "@/services/habits";
import { Modal } from "@/components/modal";
import { ColorsMapping, IconMapping } from "@/core/mappings";
import { BiLoaderAlt } from "react-icons/bi";

const IconList = Object.entries(IconMapping);
const ColorList = Object.entries(ColorsMapping);

interface HabitsIncidencesProps {
  data: Habit[];
  token: string;
}

export const HabitsList = ({ data, token }: HabitsIncidencesProps) => {
  const [habits, setHabits] = React.useState(data);
  const [showModal, setShowModal] = React.useState(data.length < 1);
  const [habitName, setHabitName] = React.useState("");
  const [habitDescription, setHabitDescription] = React.useState("");
  const [iconKey, setIconKey] = React.useState("");
  const [colorKey, setColor] = React.useState("");
  const [isBusy, setIsBusy] = React.useState(false);

  const canCreate = habitName.length > 2 && colorKey && iconKey;

  const onCreateClick = () => {
    if (!canCreate || isBusy) return;

    setIsBusy(true);

    createHabit({
      name: habitName,
      description: habitDescription,
      iconKey,
      colorKey,
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
      })
      .finally(() => {
        setIsBusy(false);
      });
  };

  const handleIconClick = (key: string) => {
    setIconKey(key);
  };

  const handleOnClose = () => {
    if (isBusy) return;

    setShowModal(false);
    setHabitName("");
    setHabitDescription("");
    setIconKey("");
    setColor("");
  };

  const handleColorClick = (key: string) => {
    setColor(key);
  };

  return (
    <div className="w-full md:w-4/6 lg:w-3/4 mx-auto mt-6 pb-10">
      <Modal open={showModal} onClose={handleOnClose}>
        <div>
          <div className="w-96 bg-white shadow rounded-md flex flex-col gap-3 p-3">
            <h4 className="text-slate-600 font-semibold ml-0.5 text-center text-xl">
              Let&apos;s start a new habit
            </h4>
            <div className="mt-2">
              <h4 className="text-xs text-slate-500">Name</h4>
              <input
                type="text"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="rounded-md outline-none border border-slate-200 bg-slate-50 text-slate-400 p-1 px-2 w-full mt-1"
              />
            </div>
            <div>
              <h4 className="text-xs text-slate-500 mb-0">Description</h4>
              <textarea
                value={habitDescription}
                onChange={(e) => setHabitDescription(e.target.value)}
                className="rounded-md outline-none border border-slate-200 bg-slate-50 text-slate-400 text-sm p-1 px-2 min-h-[32px] max-h-72 w-full mt-1"
              />
            </div>

            <div>
              <h4 className="text-xs text-slate-500">Icons</h4>
              <div className="flex gap-2 flex-wrap mt-2">
                {IconList.map(([key, { Icon, size }]) => {
                  if (key === "default") return null;
                  return (
                    <button
                      key={key}
                      className={`
                      rounded-md outline-none bg-slate-100
                      hover:bg-slate-100 text-slate-400
                      flex items-center justify-center w-8 h-8
                      ${
                        key === iconKey
                          ? "border-slate-400 border text-slate-400 "
                          : "border-slate-200 bg-slate-100 "
                      }
                    `}
                      onClick={() => handleIconClick(key)}
                    >
                      <Icon size={size} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-xs text-slate-500">Colors</h4>
              <div className="flex gap-2 flex-wrap mt-2">
                {ColorList.map(([key, { active }]) => {
                  if (key === "default") return null;
                  return (
                    <button
                      key={key}
                      className={`
                      rounded-md outline-none
                      text-slate-400 bg-slate-50
                      flex items-center justify-center w-8 h-8
                      ${
                        key === colorKey
                          ? "border-slate-400 border bg-slate-100"
                          : ""
                      }
                    `}
                      onClick={() => handleColorClick(key)}
                    >
                      <div
                        style={{ backgroundColor: active }}
                        className="w-5 h-5 rounded"
                      ></div>
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              className={`
                w-fit text-white rounded-md p-2 px-3 ml-auto mt-5
                ${canCreate ? "bg-blue-500" : "bg-blue-200"}
              `}
              onClick={onCreateClick}
              disabled={!canCreate || isBusy}
            >
              {isBusy ? (
                <BiLoaderAlt size={20} className="animate-spin bg-blue-500" />
              ) : (
                "Create"
              )}
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
