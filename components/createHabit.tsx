"use client";
import React from "react";
import { Modal } from "./modal/modal";
import { FaPlusSquare } from "react-icons/fa";
import { createHabit, deleteHabit, updateHabit } from "@/services/habits";
import { Account, Habit } from "@/core/types";
import { BiLoaderAlt } from "react-icons/bi";
import { ColorsMapping, IconMapping } from "@/core/mappings";
import { PLANS, defaultPlan } from "@/core/constants";
import Link from "next/link";
import { useManagerContext } from "@/context/manager";
import { cleanSelectedHabit } from "@/context/manager/actions";
import { ConfirmationModal } from "./modal/confirmation";
import toast from "react-hot-toast";

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
  description: string;
  colorKey: string;
  iconKey: string;
  isBusy: boolean;
}

export const HabitCreator = ({
  startOpen,
  onHabitCreate,
  onHabitUpdate,
  onDelete,
}: HabitCreatorProps) => {
  const {
    state: { account, selectedHabit, habits, token },
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
  });
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const { habitName, description, colorKey, iconKey, isBusy, showModal } =
    state;

  const plan = PLANS[account.planType] || defaultPlan;

  const restoreState = () => {
    setState({
      isBusy: false,
      showModal: false,
      habitName: "",
      description: "",
      colorKey: "",
      iconKey: "",
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
        name: habitName,
        description,
        colorKey,
        iconKey,
        token,
      })
        .then(() => {
          onHabitUpdate({
            habitName,
            id: selectedHabit.id,
            createdAt: selectedHabit.createdAt,
            incidences: selectedHabit.incidences,
            colorKey,
            iconKey,
            description,
          });
          restoreState();
        })
        .catch((err) => {
          console.error(err);
          setState((prev) => ({
            ...prev,
            showModal: true,
            isBusy: false,
          }));
          toast.error("Could not save, please try again");
        });
      return;
    }

    createHabit({
      name: habitName,
      description,
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
      token,
    })
      .then(() => {
        restoreState();
        onDelete?.(h);
      })
      .catch((err) => {
        console.error(err);
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

  const onHabitsLimit = habits.length >= plan.maxHabits;
  const isValidHabit = habitName.length > 2 && colorKey && iconKey;
  const canCreate = isValidHabit && (isEditing ? true : !onHabitsLimit);

  React.useEffect(() => {
    if (selectedHabit) {
      setState((prev) => ({
        ...prev,
        showModal: true,
        ...selectedHabit,
      }));
    }
  }, [selectedHabit]);

  return (
    <div className="z-50">
      <FaPlusSquare
        className="cursor-pointer text-sky-600"
        size={28}
        onClick={() => setState((prev) => ({ ...prev, showModal: true }))}
      />
      <Modal open={showModal || !!selectedHabit} onClose={handleOnClose}>
        <div className="px-2 md:px-0">
          <div className="w-full md:w-96 bg-white shadow rounded-md flex flex-col gap-3 p-3">
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
                value={description}
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
              <h4 className="text-sm text-slate-400 font-normal mb-0 select-none">
                Icons
              </h4>
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
              <h4 className="text-sm text-slate-400 font-normal mb-0 select-none">
                Colors
              </h4>
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

            <div className="flex gap-2 justify-end items-center">
              {
                <Modal open={isBusy} onClose={() => {}}>
                  <BiLoaderAlt size={28} className="animate-spin text-white" />
                </Modal>
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
                    className={`block md:hidden text-white rounded-md p-2 px-3
                      ${canCreate && !isBusy ? "bg-red-500" : "bg-red-200"}
                    `}
                    onClick={() => setShowConfirmation(true)}
                    disabled={!canCreate || isBusy}
                  >
                    Delete
                  </button>
                </div>
              )}

              <button
                className={`text-white rounded-md p-2 px-3 select-none
                  ${canCreate && !isBusy ? "bg-blue-500" : "bg-blue-200"}
                `}
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
        </div>
      </Modal>
    </div>
  );
};
