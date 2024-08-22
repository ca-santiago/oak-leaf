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
import { DATE_FORMAT } from "@/core/constants";

interface Props {
  habit: Habit;
}

function HabitWeekViewCard(props: Props) {
  const {
    habit
  } = props;

  const { state: { userId } } = useManagerContext();
  const today = useHabitsStore(s => s.today);
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

  const { Icon, size } = IconMapping[habit.iconKey];
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
    const weekDate = today
      .clone()
      .startOf('week')
      .subtract(1, 'day');

    return weekDaysMin.map((weekDayLabel) => {
      weekDate.add(1, 'day');
      const exist = findExistingRangeForADate(weekDate.format(DATE_FORMAT), flatYearRange(thisYearRanges));

      return {
        weekDayLabel: weekDayLabel,
        weekDayNumber: weekDate.date(),
        isCompleted: exist !== -1,
      };
    });
  }, [thisYearRanges, today]);

  
  const renderDay = (weekDay: { weekDayNumber: number, isCompleted: boolean, weekDayLabel: string }) => {
    const {
      isCompleted,
      weekDayLabel,
      weekDayNumber,
    } = weekDay;

    const isToday = weekDayNumber === monthDayNumber;

    const labelClasses = cx({
      'text-sm text-slate-400 relative': true,
      'px-1': isToday,
    });

    const labelDotClasses = cx({
      'h-1 w-2 absolute top-[-7px] left-1/2 -translate-x-1/2 bg-red-500 rounded-full': true,
      'block': isToday,
      'hidden': !isToday,
    });

    const chipClasses = cx({
      'w-full md2:w-12 h-10 md:h-12 bg-slate-100 font-semibold text-sm flex items-center justify-center select-none chip': true,
      'text-white': isCompleted,
      'text-slate-600': !isCompleted,
    });

    const chipStyles: CSSProperties = {
      backgroundColor: isCompleted ? Colors.active : Colors.base,
      opacity: isCompleted ? 0.9 : 1,
    };

    return (
      <div key={ weekDayNumber } className="flex flex-1 flex-col items-center gap-1 select-none rounded-list-child" >
        <p className={ labelClasses }>
          { weekDayLabel }
          <span className={ labelDotClasses } />
        </p>
        <div style={ chipStyles } className={ chipClasses }>
          { weekDayNumber }
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md2:w-full bg-white border border-slate-200 p-3 rounded-xl">
      <div className="flex justify-between gap-2">
        <div className="flex gap-3 items-center text-slate-700">
          <div className="h-5 w-5">
            <Icon size={ size } />
          </div>
          <h2 className="font-semibold text-base h-full">{ habit.habitName }</h2>
        </div>
        <div className="flex justify-between text-slate-500 text-xs font-semibold">
          <ConfirmationModal
            onCancel={ () => setShowConfirmation(false) } 
            onConfirm={ triggerDeleteHabit }
            show={ showConfirmation }
            title="Borrar este hábito para siempre?"
          />
          <div className="gap-2 items-center flex">
            <BsTrash2Fill
              onClick={(e: React.SyntheticEvent) => {
                e.stopPropagation();
                handleDeleteClick();
              }}
              size={ 18 }
              className="text-red-400 hover:text-red-500/90 rounded-full hover:bg-slate-200 p-1 w-fit h-fit"
            />
            <MdEdit
              onClick={(e: React.SyntheticEvent) => {
                e.stopPropagation();
                setSelectedHabit(habit);
              }}
              size={ 18 }
              className="text-slate-500 hover:text-slate-600 rounded-full hover:bg-slate-200 p-1 w-fit h-fit"
            />
          </div>
        </div>
      </div>
      <div className="flex pt-2 w-full md2:w-fit mx-auto gap-0 mt-2">
        { weekDays.map((w) => renderDay(w)) }
      </div>
    </div>
  );
}

export default HabitWeekViewCard;
