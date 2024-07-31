"use client";
import HorizontalWeekDaysView from "@/components/calendar/horizontalWeekView";
import { DATE_FORMAT } from "@/core/constants";
import { ColorsMapping, IconMapping } from "@/core/mappings";
import { Habit, Task, YearRangeData } from "@/core/types";
import { mapDateRangeToActivityArray } from "@/helpers/activity";
import {
  deserializeCompletionsRecord,
  filterAndClampYearRangesByDateLimits,
  splitDateRange,
} from "@/helpers/incidences";
import moment from "moment";
import React from "react";
import ActivityCalendar, { Activity } from "react-activity-calendar";

import { GoGraph } from "react-icons/go";

interface TaskCardPorps {
  data: Task;
}
const TaskCard = ({ data }: TaskCardPorps) => {
  return (
    <div className="border-slate-300 bg-slate-200 rounded-sm p-2">
      <h4 className="font-semibold text-slate-500">{data.title}</h4>
      {data.description && (
        <p className="text text-slate-500">{data.description}</p>
      )}
    </div>
  );
};

interface HabitDetailsProps {
  habit: Habit;
  token: string;
  tasks: Task[];
}

const HabitDetails = (props: HabitDetailsProps) => {
  const { habit, tasks } = props;
  const [currDay, setCurrDay] = React.useState(moment().format(DATE_FORMAT));
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => task.date === currDay);
  }, [currDay, tasks]);

  const [rangeLimit] = React.useState(
    `${moment().subtract(7, "months").format(DATE_FORMAT)}:${moment()
      .endOf("week")
      .format(DATE_FORMAT)}`
  );

  const [dateRanges, setDateRanges] = React.useState<YearRangeData[]>(
    deserializeCompletionsRecord(habit.completions)
  );

  const currRanges = React.useMemo((): string[] => {
    return filterAndClampYearRangesByDateLimits(dateRanges, rangeLimit);
  }, [dateRanges, rangeLimit]);

  const activities: Activity[] = React.useMemo(() => {
    const dateArr: Activity[][] = currRanges.map((range) => {
      const [start, end] = splitDateRange(range);
      return mapDateRangeToActivityArray(start, end);
    });

    const flatten = dateArr.flat();

    const [sLimit, eLimit] = splitDateRange(rangeLimit);

    const startingActivity: Activity = {
      count: 0,
      date: sLimit,
      level: 0,
    };

    const endActivity: Activity = {
      count: 0,
      date: eLimit,
      level: 0,
    };

    if (flatten.length < 1) {
      return [startingActivity, endActivity];
    }

    if (flatten[0].date !== startingActivity.date) {
      flatten.unshift(startingActivity);
    }

    if (flatten[flatten.length - 1].date !== endActivity.date) {
      flatten.push(endActivity);
    }

    return flatten;
  }, [currRanges, rangeLimit]);

  const colorSchema =
    ColorsMapping[habit.colorKey] || ColorsMapping.defaultColorSchema;
  const Icon = IconMapping[habit.iconKey] || IconMapping.default;

  return (
    <div className="h-screen bg-slate-100">
      <div className="flex flex-col h-full p-2">
        <div className="grid grid-cols-2 gap-2 h-full mt-4">
          <section className="bg-white rounded border border-slate-200 p-2 h-fit">
            <div className="flex flex-col justify-between items-start select-none">
              <div className="flex flex-row gap-2 items-center text-slate-600  cursor-pointer">
                <Icon.Icon size={Icon.size} />
                <h4 className="font-semibold text-lg notranslate hover:underline">
                  {habit.habitName}
                </h4>
              </div>
              {habit.description && (
                <p className="text-slate-400 mx-1 mt-1 text-sm font-medium notranslate">
                  {habit.description}
                </p>
              )}
            </div>
            <div className="mt-6">
              <h4 className="text-slate-600 font-semibold notranslate mb-3 flex gap-2 items-center"><span><GoGraph size={20} /> </span>Overall year performance</h4>
              <ActivityCalendar
                hideMonthLabels
                hideColorLegend
                maxLevel={3}
                blockSize={13}
                blockRadius={4}
                blockMargin={3}
                weekStart={0}
                fontSize={14}
                hideTotalCount
                colorScheme="light"
                theme={{
                  light: [colorSchema.base, colorSchema.active],
                }}
                data={activities}
              />
            </div>
          </section>
          <section className="bg-white rounded border border-slate-200 p-2 h-full">
            <h4 className="font-semibold text-slate-600">
              The tasks for this habit
            </h4>
            <HorizontalWeekDaysView
              startAt={currDay}
              onSelectedDayChange={(a) => {
                setCurrDay(a);
                console.log({ a });
              }}
            />
            <div className="p-2 mt-4 gap-2 flex flex-col">
              {filteredTasks.length === 0 && <div>No Tasks for this habit</div>}
              {filteredTasks.map((task) => (
                <TaskCard key={ task.id } data={ task } />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HabitDetails;
