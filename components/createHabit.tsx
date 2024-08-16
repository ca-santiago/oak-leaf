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

const _INITIAL_STATE: HabitCreatorState = {
  habitName: "",
  description: "",
  colorKey: "",
  iconKey: "",
  isBusy: false,
  showModal: false,
  daysOfWeekToRemind: "",
  hourToRemind: "00:00",
};

const getInitialState = (override: Partial<HabitCreatorState>): HabitCreatorState => {
  return ({
    ..._INITIAL_STATE,
    ...override,
  });
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

  const [state, setState] = React.useState<HabitCreatorState>(
    getInitialState({
      showModal: startOpen || !!selectedHabit, 
    })
  );

  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const restoreState = () => {
    setState(_INITIAL_STATE);
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

  const handleReminderHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e) return;

    setState(prev => ({
      ...prev,
      hourToRemind: e.target.value,
    }));
  }

  React.useEffect(() => {
    if (selectedHabit) {
      setState((prev) => ({
        ...prev,
        ...selectedHabit,
        showModal: true,
        hourToRemind: selectedHabit.hourOfDay || _INITIAL_STATE.hourToRemind,
      }));
    }
  }, [selectedHabit]);

  const initialDaysOfWeekSelected = React.useMemo(() => {
    if (!selectedHabit || !selectedHabit.daysOfWeek) return [];

    const daysArr = selectedHabit.daysOfWeek.split(',');
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
          <h4 className="text-slate-600 font-semibold ml-0.5 text-center text-2xl">
            {isEditing ? "Let's configure it" : "Let's start a new habit"}
          </h4>
          <div className="mt-2">
            <h4 className="text-sm font-semibold text-slate-700 mb-0 select-none">
              Name <span className="text-red-600">*</span>
            </h4>
            <input
              className="rounded-md outline-none border border-slate-200 bg-slate-50 text-slate-600 p-1 px-2 w-full mt-1"
              type="text"
              name="habitName"
              value={habitName}
              onChange={(e) =>
                setState((prev) => ({ ...prev, habitName: e.target.value }))
              }
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-0 select-none">
              Description
            </h4>
            <textarea
              className="rounded-md outline-none border border-slate-200 bg-slate-50 text-slate-600 text-sm p-1 px-2 min-h-[32px] max-h-72 w-full mt-1"
              name="habitDescription"
              value={description || ''}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <div className="text-sm text-slate-700 font-semibold mb-0 select-none">Remind on days</div>
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

          <div className="flex gap-2 items-center">
            <label htmlFor="hour" className="text-sm text-slate-400 font-normal mb-0 select-none">At hour</label>
            <div className="relative">
              <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3 pointer-events-none">
                <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd"/>
                </svg>
              </div>
              <input
                className="bg-slate-50 border leading-none border-gray-300 text-slate-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 [&::-webkit-calendar-picker-indicator]:opacity-0"
                type="time"
                id="hour"
                value={ state.hourToRemind }
                onChange={ handleReminderHourChange }
                required
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm text-slate-700 font-semibold mb-0 select-none">
              Icons <span className="text-red-500">*</span>
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
            <h4 className="text-sm text-slate-700 font-semibold mb-0 select-none">
              Colors <span className="text-red-500">*</span>
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
