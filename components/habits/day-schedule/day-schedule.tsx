'use client';

import React from "react";
import moment from "moment";

import { Habit } from "@prisma/client";
import HabitDayCard from "./habit-day-card";
import { useManagerContext } from "@/context/manager";
import { BsCalendar2, BsClock } from "react-icons/bs";

import './day-schedule.css';

interface Props {

}

function HabitsDaySchedule(props: Props) {
  const {
    state: {
      habits
    },
  } = useManagerContext();

  const [today, setToday] = React.useState(moment());
 
  const {
    // allCompleted,
    otherHabitsNoReminder,
    otherHabitsNoReminderUncompleted,
    todayHabits,
    todayUncompletedHabits,
  } = React.useMemo(() => {
    const allCompleted: Habit[] = [];
    const otherHabitsNoReminder: Habit[] = [];
    const otherHabitsNoReminderUncompleted: Habit[] = [];
    const todayHabits: Habit[] = [];
    const todayUncompletedHabits: Habit[] = [];

    habits.forEach(h => {
      const isCompleted = h.completions.includes(today.format('MM-DD'));

      if(isCompleted) allCompleted.push(h);

      if (!h.daysOfWeek) {
        otherHabitsNoReminder.push(h);

        if (!isCompleted) {
          otherHabitsNoReminderUncompleted.push(h);
        }
      }

      if (h.daysOfWeek) {
        const todayHasReminder = h.daysOfWeek.includes(`${today.day()}`)

        if (todayHasReminder) {
          todayHabits.push(h);

          if (!isCompleted) todayUncompletedHabits.push(h);
        }
      }
    });

    return {
      allCompleted,
      otherHabitsNoReminder,
      otherHabitsNoReminderUncompleted,
      todayHabits,
      todayUncompletedHabits,
    }
  }, [habits, today]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setToday(moment());
    }, 1000 * 60);

    return () => clearTimeout(timeout);
  });

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
          <h2 className="font-semibold text-2xl text-center text-slate-700">Day schedule</h2>

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
            <h2 className="font-semibold text-2xl text-center text-slate-700">Other habits</h2>
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