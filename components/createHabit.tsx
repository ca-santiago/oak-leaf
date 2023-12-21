"use client";
import React from "react";
import { Modal } from "./modal";
import { FaPlusSquare } from "react-icons/fa";
import { createHabit } from "@/services/habits";
import { Account, Habit } from "@/core/types";
import { BiLoaderAlt } from "react-icons/bi";
import { ColorsMapping, IconMapping } from "@/core/mappings";
import { PLANS, defaultPlan } from "@/core/constants";
import Link from "next/link";
import { useManagerContext } from "@/context/manager";

const IconList = Object.entries(IconMapping);
const ColorList = Object.entries(ColorsMapping);

interface HabitCreatorProps {
  startOpen: boolean;
  onHabitCreate: (habit: Habit) => any;
}

interface HabitCreatorState {
  showModal: boolean;
  habitName: string;
  habitDescription: string;
  colorKey: string;
  iconKey: string;
  isBusy: boolean;
}

export const HabitCreator = ({
  startOpen,
  onHabitCreate,
}: HabitCreatorProps) => {
  const {
    state: { account, selectedHabit, habits, token },
  } = useManagerContext();

  const [state, setState] = React.useState<HabitCreatorState>({
    habitName: "",
    habitDescription: "",
    colorKey: "",
    iconKey: "",
    isBusy: false,
    showModal: startOpen || !!selectedHabit,
  });

  const { habitName, habitDescription, colorKey, iconKey, isBusy, showModal } =
    state;

  const plan = PLANS[account.planType] || defaultPlan;

  const restoreState = () => {
    setState({
      isBusy: false,
      showModal: false,
      habitName: "",
      habitDescription: "",
      colorKey: "",
      iconKey: "",
    });
  };

  const onCreateClick = () => {
    if (!canCreate || isBusy) return;

    setState((prev) => ({
      ...prev,
      isBusy: true,
    }));

    createHabit({
      name: habitName,
      description: habitDescription,
      iconKey,
      colorKey,
      token,
    })
      .then((data) => {
        const newHabit: Habit = {
          ...data,
          incidences: [],
        };
        onHabitCreate(newHabit);
        restoreState();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        restoreState();
      });
  };

  const handleIconClick = (key: string) => {
    setState((prev) => ({
      ...prev,
      iconKey: key,
    }));
  };

  const handleOnClose = () => {
    if (isBusy) return;

    restoreState();
  };

  const handleColorClick = (key: string) => {
    setState((prev) => ({
      ...prev,
      colorKey: key,
    }));
  };

  const onHabitsLimit = habits.length >= plan.maxHabits;
  const canCreate =
    habitName.length > 2 && colorKey && iconKey && !onHabitsLimit;

  return (
    <div>
      <FaPlusSquare
        className="cursor-pointer text-sky-600"
        size={28}
        onClick={() => setState((prev) => ({ ...prev, showModal: true }))}
      />
      <Modal open={showModal || !!selectedHabit} onClose={handleOnClose}>
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
                onChange={(e) =>
                  setState((prev) => ({ ...prev, habitName: e.target.value }))
                }
                className="rounded-md outline-none border border-slate-200 bg-slate-50 text-slate-400 p-1 px-2 w-full mt-1"
              />
            </div>
            <div>
              <h4 className="text-xs text-slate-500 mb-0">Description</h4>
              <textarea
                value={habitDescription}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    habitDescription: e.target.value,
                  }))
                }
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

            {onHabitsLimit && (
              <div className="text-slate-500 text-sm mt-2">
                <p>
                  Your current plan does not allow more than {plan.maxHabits}{" "}
                  habits at a time
                </p>
                <p>
                  Upgrade your plan{" "}
                  <Link className="cursor-pointer text-blue-400" href="/plans">
                    here
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
