import React from "react";
import { ColorsMapping, IconMapping } from "@/core/mappings";
import { Habit } from "@prisma/client";
import moment from "moment";

import cx from 'classnames';
import { deserializeCompletionsRecord, findExistingRangeForADate, findRangesByYearOrCreate, flatYearRange, splitDateRange } from "@/helpers/incidences";
import { useHabitsStore } from "@/context/habits";
import { BsTrash2Fill } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { ConfirmationModal } from "@/components/modal/confirmation";
import { deleteHabit } from "@/services/habits";
import { useManagerContext } from "@/context/manager";

interface Props {
  habit: Habit;
}

function HabitWeekViewCard(props: Props) {
  const {
    habit
  } = props;

  const { state: { userId } } = useManagerContext();
  const today = useHabitsStore(s => s.todayFormatted);
  const setSelectedHabit = useHabitsStore(s => s.setSelectedHabit);

  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const [habitRanges] = React.useState(deserializeCompletionsRecord(habit.completions));
  const thisYearRanges = findRangesByYearOrCreate(habitRanges, today.split('-')[0]);
  const [monthDayNumber] = React.useState((new Date()).getDate());

  const Icon = IconMapping[habit.iconKey].Icon;
  const Colors = ColorsMapping[habit.colorKey];

  const handleDeleteClick = React.useCallback(() => {
    setShowConfirmation(true);
  }, []);

  const triggerDeleteHabit = () => {
    deleteHabit({
      habitId: habit.id,
      userId,
    });
  };

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
        { days.map((w) =>
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
       <div className="flex justify-between pt-3 text-slate-500 text-xs font-semibold">
          <ConfirmationModal
            onCancel={ () => setShowConfirmation(false) } 
            onConfirm={ triggerDeleteHabit }
            show={ showConfirmation }
            title="Borrar este hábito para siempre?"
          />
          <div className="gap-2 items-center max-lg:hidden flex">
            <BsTrash2Fill
              onClick={(e: React.SyntheticEvent) => {
                e.stopPropagation();
                handleDeleteClick();
              }}
              size={16}
              className="text-red-400 rounded-full hover:bg-slate-100 p-1 w-fit h-fit"
            />
            <MdEdit
              onClick={(e: React.SyntheticEvent) => {
                e.stopPropagation();
                setSelectedHabit(habit);
              }}
              size={16}
              className="text-slate-500 rounded-full hover:bg-slate-100 p-1 w-fit h-fit"
            />
          </div>
        </div>
    </div>
  );
}

export default HabitWeekViewCard;
