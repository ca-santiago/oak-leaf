import React from "react";
import { ColorsMapping, IconMapping } from "@/core/mappings";
import { Habit } from "@prisma/client";
import moment from "moment";

import cx from 'classnames';
import { deserializeCompletionsRecord, findExistingRangeForADate, findRangesByYearOrCreate, flatYearRange, splitDateRange } from "@/helpers/incidences";
import { useHabitsStore } from "@/context/habits";

interface Props {
  habit: Habit;
}

function HabitWeekViewCard(props: Props) {
  const {
    habit
  } = props;
  const today = useHabitsStore(s => s.todayFormatted);

  const [habitRanges] = React.useState(deserializeCompletionsRecord(habit.completions));
  const thisYearRanges = findRangesByYearOrCreate(habitRanges, today.split('-')[0]);
  const [monthDayNumber] = React.useState((new Date()).getDate());

  const Icon = IconMapping[habit.iconKey].Icon;
  const Colors = ColorsMapping[habit.colorKey];

  const days = React.useMemo(() => {
    const weekDaysMin = moment.weekdaysMin();
    const currDate = new Date();

    return weekDaysMin.map((weekDay, index) => {
      const day = currDate.getDate();
      const m = ("0" + (currDate.getMonth() + 1)).slice(-2);
      const y = currDate.getFullYear();

      const weekDayFormatted = `${y}-${m}-${day}`;
      const exist = findExistingRangeForADate(weekDayFormatted, flatYearRange(thisYearRanges));

      currDate.setDate(currDate.getDate() + 1);
      return {
        weekDay,
        dayN: day,
        weekDayShortName: weekDaysMin[index],
        completed: exist !== -1,
      };
    });
  }, []);

  const completedDays = [0, 1, 6];

  const getDayClasses = (dayNumber: number) => cx({
    'text-sm text-slate-600': true,
    'px-1 border-red-600 border rounded-md': dayNumber === monthDayNumber,
    'text-slate-600': dayNumber !== monthDayNumber,
  });

  return (
    <div className="w-full md:w-fit bg-white border border-slate-200 p-2 px-3 rounded-xl">
      <div className="flex gap-2 items-center text-slate-600">
        <Icon />
        <h2>{ habit.habitName }</h2>
      </div>
      <div className="flex w-fit mx-auto gap-2 my-2">
        { days.map((w, index) =>
          <div key={ w.dayN } className="flex flex-col items-center gap-2" >
            <div
              style={{
                color: w.completed ? 'white' : undefined,
                backgroundColor: w.completed ? Colors.active : Colors.base,
                borderColor: moment().day().toString() === w.weekDay ? 'red'  : "transparent",
                opacity: w.completed ? 0.7 : 1,
              }}
              className="w-11 md:w-12 h-11 md:h-12 rounded-xl bg-slate-100 border border-slate-200 font-semibold text-sm text-slate-800 flex items-center justify-center"
            >
              { w.dayN }
            </div>
            <p className={ getDayClasses(w.dayN) }>
             { w.weekDayShortName }
            </p>
          </div>
        ) }
      </div>
    </div>
  );
}

export default HabitWeekViewCard;
