"use client";
import React from "react";
import { Modal } from "./modal/modal";
import { ConfirmationModal } from "./modal/confirmation";

import { FaPlusSquare } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";

import Link from "next/link";
import toast from "react-hot-toast";
import cn from "classnames";

import { Habit } from "@/core/types";
import { createHabit, deleteHabit, updateHabit } from "@/services/habits";
import { ColorsMapping, IconMapping } from "@/core/mappings";
import { PLANS, defaultPlan } from "@/core/constants";
import { useManagerContext } from "@/context/manager";
import { cleanSelectedHabit } from "@/context/manager/actions";
import DayOfWeekSelector from "./habits/day-of-wee-selector";


const IconList = Object.entries(IconMapping);
const ColorList = Object.entries(ColorsMapping);

interface HabitCreatorProps {
  startOpen: boolean;
  onHabitCreate: (habit: Habit) => any;
  onHabitUpdate: (habit: Habit) => any;
  onDelete?: (habit: Habit) => any;
}

interface HabitCreatorState {
  showModal: boolean;
  habitName: string;
  description: string | null;
  colorKey: string;
  iconKey: string;
  isBusy: boolean;
  daysOfWeekToRemind: string;
  hourToRemind: string;
  // periodicity: ReminderConfig;
}

export const HabitCreator = ({
  startOpen,
  onHabitCreate,
  onHabitUpdate,
  onDelete,
}: HabitCreatorProps) => {
  const {
    state: {
      account,
      selectedHabit,
      habits
    },
    dispatch,
  } = useManagerContext();

  const isEditing = !!selectedHabit;

  const [state, setState] = React.useState<HabitCreatorState>({
    habitName: "",
    description: "",
    colorKey: "",
    iconKey: "",
    isBusy: false,
    showModal: startOpen || !!selectedHabit,
    daysOfWeekToRemind: "",
    hourToRemind: "",
  });

  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const restoreState = () => {
    setState({
      isBusy: false,
      showModal: false,
      habitName: "",
      description: "",
      colorKey: "",
      iconKey: "",
      daysOfWeekToRemind: "",
      hourToRemind: "",
    });
    dispatch(cleanSelectedHabit());
  };

  const handleSaveUpdate = () => {
    if (!canCreate || isBusy) return;

    setState((prev) => ({
      ...prev,
      isBusy: true,
    }));

    if (selectedHabit) {
      updateHabit({
        habitId: selectedHabit.id,
        userId: account.id,

        colorKey,
        completions: selectedHabit.completions,
        description: description || undefined,
        iconKey,

        daysOfWeekToRemind,
        hourToRemind,

        name: habitName,
      })
        .then(({ data, success }) => {
          if (success) {
            onHabitUpdate({
              ...data,
              // habitName,
              // id: selectedHabit.id,
              // createdAt: selectedHabit.createdAt,
              // completions: selectedHabit.completions,
              // colorKey,
              // iconKey,
              // description,
            });
            restoreState();
            return;
          }

          setState((prev) => ({
            ...prev,
            showModal: true,
            isBusy: false,
          }));
          toast.error("Could not save, please try again");
        })
        .catch((err: any) => {
          console.error(err);
        });
      return;
    }

    createHabit({
      userId: account.id,
      name: habitName,
      description: description || undefined,
      iconKey,
      colorKey,
      completions: '',
      daysOfWeekToRemind,
      hourToRemind,
    })
      .then((data) => {
        const newHabit: Habit = { ...data };
        onHabitCreate(newHabit);
        restoreState();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Could not create, please try again");
        setState((prev) => ({
          ...prev,
          isBusy: false,
        }));
      });
  };

  const handleConfirmClick = (h: Habit) => {
    if (!canCreate || isBusy) return;

    setShowConfirmation(false);
    setState((prev) => ({
      ...prev,
      isBusy: true,
    }));

    // Perform delete

    deleteHabit({
      habitId: h.id,
      userId: account.id,
    })
      .then(({ deleted }) => {
        if (deleted) {
          restoreState();
          onDelete?.(h);
          return;
        }

        setState((prev) => ({
          ...prev,
          isBusy: false,
        }));
        toast.error("Could not delete the Habit, please try again");
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

    dispatch(cleanSelectedHabit());
    restoreState();
  };

  const handleColorClick = (key: string) => {
    setState((prev) => ({
      ...prev,
      colorKey: key,
    }));
  };

  React.useEffect(() => {
    if (selectedHabit) {
      setState((prev) => ({
        ...prev,
        ...selectedHabit,
        showModal: true,
        daysOfWeekToRemind: selectedHabit.daysOfWeek || "",
        hourToRemind: selectedHabit.hourOfDay || "",
      }));
    }
  }, [selectedHabit]);

  const initialDaysOfWeekSelected = React.useMemo(() => {
    if (!selectedHabit || !selectedHabit.daysOfWeek) return [];
    
    const daysArr = selectedHabit.daysOfWeek.split(',');
    console.log({
      selectedHabit,
      daysArr,
    });
    return daysArr.length > 0 ? daysArr.map(d => parseInt(d)) : [];
  }, [selectedHabit]);

  const {
    habitName,
    description,
    colorKey,
    iconKey,
    isBusy,
    showModal,
    daysOfWeekToRemind,
    hourToRemind,
  } = state;

  const plan = PLANS[account.planType] || defaultPlan;

  const onHabitsLimit = habits.length >= plan.maxHabits;
  const isValidHabit = habitName.length > 2 && colorKey && iconKey;
  const canCreate = isValidHabit && (isEditing ? true : !onHabitsLimit);

  const canCreateAndNotBusy = canCreate && !isBusy;

  const deleteBtnCn = cn("block md:hidden text-white rounded-md p-2 px-3", {
    ["bg-red-500"]: !isBusy,
    ["bg-red-200"]: isBusy,
  });

  const saveBtnCn = cn(
    "text-white rounded-md p-2 px-3 select-none max-sm:w-full max-md:w-1/2 max-md:mx-auto",
    {
      ["bg-blue-500"]: canCreateAndNotBusy,
      ["bg-blue-200"]: !canCreateAndNotBusy,
    }
  );

  return (
    <div className="z-50">
      <FaPlusSquare
        className="cursor-pointer text-sky-600"
        size={28}
        onClick={() => setState((prev) => ({ ...prev, showModal: true }))}
      />
      <Modal open={showModal || !!selectedHabit} onClose={handleOnClose}>
        <div className="w-full mx-auto h-fit flex flex-col gap-3 p-3">
          <h4 className="text-slate-600 font-semibold ml-0.5 text-center text-xl">
            {isEditing ? "Let's configure it" : "Let's start a new habit"}
          </h4>
          <div className="mt-2">
            <h4 className="text-sm text-slate-400 font-normal mb-0 select-none">
              Name
            </h4>
            <input
              type="text"
              name="habitName"
              value={habitName}
              onChange={(e) =>
                setState((prev) => ({ ...prev, habitName: e.target.value }))
              }
              className="rounded-md outline-none border border-slate-200 bg-slate-50 text-slate-400 p-1 px-2 w-full mt-1"
            />
          </div>
          <div>
            <h4 className="text-sm text-slate-400 font-normal mb-0 select-none">
              Description
            </h4>
            <textarea
              name="habitDescription"
              value={description || ''}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="rounded-md outline-none border border-slate-200 bg-slate-50 text-slate-400 text-sm p-1 px-2 min-h-[32px] max-h-72 w-full mt-1"
            />
          </div>

          <div>
            <div className="text-sm text-slate-400 font-normal mb-0 select-none">Remind on days</div>
            <DayOfWeekSelector
              initialSelection={ initialDaysOfWeekSelected }
              onSelectionChange={ (selectedDays) => {
                setState(prev => ({
                  ...prev,
                  daysOfWeekToRemind: selectedDays.join(',')
                }));
              }}
            />
          </div>

          <div>
            <h4 className="text-sm text-slate-400 font-normal mb-0 select-none">
              Icons
            </h4>
            <div className="flex gap-2 flex-wrap mt-2">
              {IconList.map(([key, { Icon, size }]) => {
                if (key === "default") return null;
                const iconKeyCn = cn(
                  "rounded-md outline-none bg-slate-100 hover:bg-slate-100",
                  "text-slate-400 flex items-center justify-center w-8 h-8",
                  {
                    ["border-slate-400 border text-slate-400"]:
                      key === iconKey,
                    ["border-slate-200 bg-slate-100"]: key !== iconKey,
                  }
                );
                return (
                  <button
                    key={key}
                    className={iconKeyCn}
                    onClick={() => handleIconClick(key)}
                  >
                    <Icon size={size} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-sm text-slate-400 font-normal mb-0 select-none">
              Colors
            </h4>
            <div className="flex gap-2 flex-wrap mt-2">
              {ColorList.map(([key, { active }]) => {
                if (key === "default") return null;
                const colorKeyCn = cn(
                  "flex items-center justify-center w-8 h-8",
                  " rounded-md outline-none text-slate-400 bg-slate-50",
                  {
                    ["border-slate-400 border bg-slate-100"]:
                      key === colorKey,
                  }
                );
                return (
                  <button
                    key={key}
                    className={colorKeyCn}
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

          <div className="flex gap-2 justify-end items-center">
            { isBusy &&
              <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black/5 rounded-md">
                <BiLoaderAlt size={32} className="animate-spin text-slate-800" />
              </div>
            }

            {isEditing && (
              <div>
                <ConfirmationModal
                  onCancel={() => setShowConfirmation(false)}
                  onConfirm={() => handleConfirmClick(selectedHabit)}
                  title={`Are you sure you want to delete this habit?`}
                  show={showConfirmation}
                />
                <button
                  className={deleteBtnCn}
                  onClick={() => setShowConfirmation(true)}
                  disabled={isBusy}
                >
                  Delete
                </button>
              </div>
            )}

            <button
              className={saveBtnCn}
              onClick={handleSaveUpdate}
              disabled={!canCreate || isBusy}
            >
              {isEditing ? "Save" : "Create"}
            </button>
          </div>

          {onHabitsLimit && !isEditing && (
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
      </Modal>
    </div>
  );
};
