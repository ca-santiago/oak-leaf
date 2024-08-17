import { HabitsCollection } from "@/core/types";
import { Moment } from "moment";

export const computeHabitsInfo = (habits: HabitsCollection, today: Moment) => {
  const allCompleted: HabitsCollection = [];
  const otherHabitsNoReminder: HabitsCollection = [];
  const otherHabitsNoReminderUncompleted: HabitsCollection = [];
  const todayHabits: HabitsCollection = [];
  const todayUncompletedHabits: HabitsCollection = [];

  habits.forEach(h => {
    const isCompleted = h.completions.includes(today.format('MM-DD'));

    if (isCompleted) allCompleted.push(h);

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
    all: habits,
    allCompleted,
    otherHabitsNoReminder,
    otherHabitsNoReminderUncompleted,
    todayHabits,
    todayUncompletedHabits,
  };
};