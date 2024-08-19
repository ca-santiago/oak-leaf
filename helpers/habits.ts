import { DATE_FORMAT } from "@/core/constants";
import { HabitsCollection, WeekMetadata, WeekMetadataDayCollection } from "@/core/types";
import moment, { Moment } from "moment";

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

export function computeWeekMetadata(startDay?: Moment): WeekMetadata {
  let startingDate = startDay || moment();

  const weekDaysArr = moment.weekdays();
  const weekDaysMinArr = moment.weekdaysMin();

  const weekDays: WeekMetadataDayCollection = weekDaysArr.map((weekDay, index) => {
    return {
      day: weekDay,
      dayName: weekDay,
      dayNumber: index,
      dayShortName: weekDaysMinArr[index],
    };
  });

  return {
    today: startingDate,
    todayFormatted: startingDate.format(DATE_FORMAT),
    weekDays,
  };
}
