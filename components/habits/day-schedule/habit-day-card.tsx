import { ColorsMapping } from "@/core/mappings";
import { Habit } from "@prisma/client";
import { FaSquareCheck } from "react-icons/fa6";

import cx from 'classnames';
import { updateHabit } from "@/services/habits";
import { useManagerContext } from "../../../context/manager";
import moment from "moment-timezone";
import { DATE_FORMAT } from "@/core/constants";
import React from "react";
import { deserializeCompletionsRecord, findRangesByYearOrCreate, mergeDateOnYearRangeDataV2, serializeDateRangeData, sortYearRange } from "@/helpers/incidences";
import { YearRangeCollection, YearRange } from "@/core/types";
import { BiLoaderAlt } from "react-icons/bi";

const TODAY = moment().format(DATE_FORMAT);

interface Props {
  habit: Habit;
}

function HabitDayCard (props: Props) {
  const {
    habit,
  } = props;

  const {
    state: {
      account,
    },
  } = useManagerContext();

  const [state, setState] = React.useState({
    saving: false,
  });

  const yearRangesCollection: YearRangeCollection = React.useMemo(() => {
    return deserializeCompletionsRecord(habit.completions);
  }, [habit]);

  const handleComplete = () => {
    setState({
      saving: true,
    });
    const [y] = TODAY.split("-");
    const rangeToUpdate = findRangesByYearOrCreate(yearRangesCollection, y);

    const updatedRange = mergeDateOnYearRangeDataV2(rangeToUpdate, TODAY);

    const filteredDateRanges = yearRangesCollection.filter((r) => r.year !== y);
    filteredDateRanges.push(updatedRange);

    updateHabit({
      userId: account.id,
      habitId: habit.id,
      completions: serializeDateRangeData(filteredDateRanges),
      colorKey: habit.colorKey,
      description: habit.description || undefined,
      iconKey: habit.iconKey,
      name: habit.habitName,
    })
      .catch(() => {
        setState({
          saving: false,
        });
      });
  };

  const colorSchema = ColorsMapping[habit.colorKey];

  const classes = cx({
    'HabitDayCard': true,
    'w-full border rounded-md flex flex-row justify-between pl-2 pr-1 p-1': true,
    'cursor-pointer': true,
  });

  const styles: React.CSSProperties = {
    backgroundColor: colorSchema.base,
    border: '1px solid ' + colorSchema.base,
  };

  return (
    <div key={ habit.id }>
      <div className={ classes } style={ styles }>
        <div>
          <p className="font-semibold text-lg text-inherit text-slate-600">{ habit.habitName }</p>
          { habit.description && <p className="text-sm text-slate-800 mt-1">{ habit.description }</p> }
        </div>
        <div className="h-full">
        { state.saving ?
          <BiLoaderAlt
            size={ 52 }
            className="animate-spin opacity-60"
            color={ colorSchema.active }
          />
          :
          <FaSquareCheck
            onClick={ handleComplete }
            className="HabitDayCard-action opacity-60"
            size={ 52 }
            color={ colorSchema.active }
          />
        }
        </div>
      </div>
    </div>
  );
};

export default HabitDayCard;