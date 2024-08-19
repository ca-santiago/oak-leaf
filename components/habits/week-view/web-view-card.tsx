import React, { CSSProperties } from "react";
import { Habit } from "@prisma/client";
import { ColorsMapping, IconMapping } from "@/core/mappings";

import moment from "moment";
import cx from 'classnames';

import {
  deserializeCompletionsRecord,
  findExistingRangeForADate,
  findRangesByYearOrCreate,
  flatYearRange
} from "@/helpers/incidences";
import { ConfirmationModal } from "@/components/modal/confirmation";
import { deleteHabit } from "@/services/habits";

import { useHabitsStore } from "@/context/habits";
import { useManagerContext } from "@/context/manager";

import { BsTrash2Fill } from "react-icons/bs";
import { MdEdit } from "react-icons/md";

interface Props {
  habit: Habit;
}

function HabitWeekViewCard(props: Props) {
  const {
    habit
  } = props;

  const { state: { userId } } = useManagerContext();
  const todayFormatted = useHabitsStore(s => s.todayFormatted);
  const setSelectedHabit = useHabitsStore(s => s.setSelectedHabit);

  const [monthDayNumber] = React.useState((new Date()).getDate());
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  
  const habitRanges = React.useMemo(() => 
    deserializeCompletionsRecord(habit.completions),
    [habit]
  );

  const thisYearRanges = React.useMemo(() =>
    findRangesByYearOrCreate(habitRanges, todayFormatted.split('-')[0]),
    [habitRanges, todayFormatted]
  );

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

  const weekDays = React.useMemo(() => {
    const weekDaysMin = moment.weekdaysMin();
    const currDate = new Date();

    return weekDaysMin.map((weekDayLabel) => {
      const weekDayNumber = currDate.getDate();
      const m = ("0" + (currDate.getMonth() + 1)).slice(-2);
      const y = currDate.getFullYear();

      const weekDayFormatted = `${y}-${m}-${weekDayNumber}`;
      const exist = findExistingRangeForADate(weekDayFormatted, flatYearRange(thisYearRanges));

      currDate.setDate(currDate.getDate() + 1);
      return {
        weekDayLabel,
        weekDayNumber,
        isCompleted: exist !== -1,
      };
    });
  }, [thisYearRanges]);

  
  const renderDay = (weekDay: { weekDayNumber: number, isCompleted: boolean, weekDayLabel: string }) => {
    const {
      isCompleted,
      weekDayLabel,
      weekDayNumber,
    } = weekDay;

    const isToday = weekDayNumber === monthDayNumber;

    const labelClasses = cx({
      'text-sm text-slate-400': true,
      'px-1 border-red-400 border-b-2': isToday,
    });

    const chipClasses = cx({
      'w-10 md:w-12 h-10 md:h-12 rounded-xl bg-slate-100 font-semibold text-sm flex items-center justify-center': true,
      'text-white': isCompleted,
      'text-slate-600': !isCompleted,
    });

    const chipStyles: CSSProperties = {
      backgroundColor: isCompleted ? Colors.active : Colors.base,
      opacity: isCompleted ? 0.9 : 1,
    };

    return (
      <div key={ weekDayNumber } className="flex flex-col items-center gap-1" >
        <div style={ chipStyles } className={ chipClasses }>
          { weekDayNumber }
        </div>
        <p className={ labelClasses }>
          { weekDayLabel }
        </p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-fit bg-white border border-slate-200 p-2 px-3 rounded-xl">
      <div className="flex gap-3 items-center text-slate-700">
        <Icon />
        <h2 className="font-semibold text-base">{ habit.habitName }</h2>
      </div>
      <div className="flex pt-2 w-fit mx-auto gap-2 my-2">
        { weekDays.map((w) => renderDay(w)) }
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
              size={ 18 }
              className="text-red-400 rounded-full hover:bg-slate-100 p-1 w-fit h-fit"
            />
            <MdEdit
              onClick={(e: React.SyntheticEvent) => {
                e.stopPropagation();
                setSelectedHabit(habit);
              }}
              size={ 18 }
              className="text-slate-500 rounded-full hover:bg-slate-100 p-1 w-fit h-fit"
            />
          </div>
        </div>
    </div>
  );
}

export default HabitWeekViewCard;
