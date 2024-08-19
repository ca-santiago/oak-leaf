'use client';

import React from "react";
import moment from "moment";

import HabitDayCard from "./habit-day-card";
import { BsCalendar2, BsClock } from "react-icons/bs";

import './day-schedule.css';
import { useHabitsStore } from "@/context/habits";

function HabitsDaySchedule() {
  const habits = useHabitsStore(s => s.habits);
  const [today, setToday] = useHabitsStore(s => [s.today, s.setToday]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setToday(moment());
    }, 1000 * 60);

    return () => clearTimeout(timeout);
  });

  const {
    otherHabitsNoReminderUncompleted,
    todayHabits,
    todayUncompletedHabits
  } = habits;

  const calendarInfo = (
    <div className="flex justify-between mx-2 items-center">
      <p className="text-slate-600 font-semibold flex gap-3 items-center" >
        <BsCalendar2 size={ 22 } />
        { today.format('MMMM Do YYYY') }
      </p>
      <p className="text-slate-600 font-semibold flex gap-3 items-center" >
        { today.format('hh:mm a') }
        <BsClock size={ 19 } />
      </p>
    </div>
  );

  return (
    <div>
      { calendarInfo }
      <div className="flex flex-col gap-6 bg-white shadow-sm w-full h-fit rounded-xl p-2 mt-4">
        <div>
          <h2 className="font-semibold text-2xl text-center text-slate-700">Objetivos de Hoy</h2>
          <p className="text-slate-500 text-sm ml-1">Completa estos hábitos antes de que termine el día</p>

          { todayHabits.length < 1 &&
            <p className="text-center text-slate-600 my-4">No tienes habitos establecidos para el día de hoy</p>
          }

          { todayHabits.length > 0 && todayUncompletedHabits.length < 1 &&
            <p className="text-center text-slate-600 my-4 font-semibold">Completaste todos tus habitos del día de hoy</p>
          }

          { todayUncompletedHabits.length > 0 &&
            <div className="flex flex-col gap-2 mt-4">
              { todayUncompletedHabits.map((h) =>
                  <HabitDayCard 
                    key={ h.id }
                    habit={ h }
                  />
                )
              }
            </div>
          }

        </div>
        { otherHabitsNoReminderUncompleted.length > 0 &&
          <div>
            <h2 className="font-semibold text-2xl text-center text-slate-700">Otros objetivos para Hoy</h2>
            <p className="text-slate-500 text-sm ml-1">No están programados, pero puedes lograrlos hoy si te queda tiempo.</p>
            <div className="flex flex-col gap-2 mt-4">
              { otherHabitsNoReminderUncompleted.map((h) =>
                  <HabitDayCard
                    key={ h.id }
                    habit={ h }
                  />
                )
              }
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default HabitsDaySchedule;