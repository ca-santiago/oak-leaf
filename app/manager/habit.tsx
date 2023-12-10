"use client";

import React from "react";
import ActivityCalendar, { Activity } from "react-activity-calendar";
import { Tooltip as ReactTooltip } from "react-tooltip";
import moment from "moment-timezone";
import { createCompletion, setCompletion } from "./completions";
import {
  Completion,
  Habit_Completions,
  Habit_Incidences,
  Incidence,
} from "../types";
import {
  deserializeStringToArray,
  mergeNewDateRanges,
  removeDateFromRanges,
  serializeArrayToString,
} from "@/helpers/dateRange";
import { createIncidence, updateIndigence } from "./incidence";
import { FaPlusSquare } from "react-icons/fa";

interface HabitsProps {
  data: Habit_Completions[];
  token: string;
}

interface HabitsIncidencesProps {
  data: Habit_Incidences[];
  token: string;
}

interface HabitDetailsProps {
  habit: Habit_Completions;
  token: string;
}

interface HabitIncidenceDetailsProps {
  habit: Habit_Incidences;
  token: string;
}

function mapCompletionToActivityCalendarData(c: Completion): Activity {
  const completed = c.completed ? 1 : 0;
  return {
    count: completed,
    date: moment(c.completionDate).tz(moment.tz.guess()).format(dateFormat),
    level: completed,
  };
}

function compareDates(a: Activity, b: Activity): number {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  if (dateA < dateB) {
    return -1;
  }
  if (dateA > dateB) {
    return 1;
  }
  return 0;
}

const dateFormat = "YYYY-MM-DD";

const HabitDetail = ({ habit, token }: HabitDetailsProps) => {
  const [targetEndDate, setTargetEndDate] = React.useState(
    moment(moment.now()).tz(moment.tz.guess())
  );
  const [completions, setCompletions] = React.useState<Completion[]>(
    habit.completions || []
  );

  const startingDate = React.useMemo(() => {
    const d = moment(targetEndDate);
    d.subtract(6, "M");
    d.day(0);
    return d;
  }, [targetEndDate]);

  const activityData = React.useMemo(() => {
    const mappedData = completions.map(mapCompletionToActivityCalendarData);

    const startingActivity: Activity = {
      count: 0,
      date: startingDate.format(dateFormat),
      level: 0,
    };
    const endActivity: Activity = {
      count: 0,
      date: targetEndDate.format(dateFormat),
      level: 0,
    };

    if (mappedData.length < 1) {
      return [startingActivity, endActivity];
    }

    if (mappedData[0].date !== startingActivity.date) {
      mappedData.unshift(startingActivity);
    }

    if (mappedData[mappedData.length - 1].date !== endActivity.date) {
      mappedData.push(endActivity);
    }

    return mappedData;
  }, [completions, startingDate, targetEndDate]);

  const handleActivityClick = (activity: Activity) => {
    const matchCompletion = completions.find(
      (c) => moment(c.completionDate).format(dateFormat) === activity.date
    );

    // UPDATE
    if (matchCompletion) {
      return setCompletion(
        token,
        !matchCompletion.completed,
        matchCompletion.id
      ).then(({ data }) => {
        setCompletions((prev) =>
          prev.map((c) => (c.id === data.id ? data : c))
        );
      });
    }

    // CREATE
    const dateWithTz = moment(activity.date)
      .tz(moment.tz.guess())
      .toISOString();
    createCompletion(token, habit.id, dateWithTz).then(({ data }) => {
      setCompletions((prev) => [...prev, data].sort(compareDates));
    });
  };

  return (
    <div className="m-2 p-3 rounded-md border-slate-200 border-2 bg-white w-fit">
      <h4 className="mb-4 font-semibold text-xl text-slate-700">
        {habit.habitName}
      </h4>
      <ReactTooltip id="react-tooltip" />
      <div className="select-none p-2">
        <ActivityCalendar
          style={{ scrollbarWidth: "none" }}
          // hideMonthLabels
          // showWeekdayLabels
          hideColorLegend
          maxLevel={1}
          renderBlock={(block, activity) =>
            React.cloneElement(block, {
              "data-tooltip-id": "react-tooltip",
              "data-tooltip-html": `${activity.date}`,
            })
          }
          eventHandlers={{
            onClick: (e) => handleActivityClick,
          }}
          blockSize={18}
          blockRadius={4}
          blockMargin={4}
          weekStart={0}
          hideTotalCount
          colorScheme="light"
          theme={{
            light: ["#f0f0f0", "#4A4"],
            dark: ["#f0f0f0", "#3cc9ae14"],
          }}
          data={[...activityData]}
        />
      </div>
    </div>
  );
};

export const Habits = ({ data, token }: HabitsProps) => {
  return (
    <div>
      {data.map((item) => (
        <HabitDetail token={token} key={item.id} habit={item} />
      ))}
    </div>
  );
};

function mapDateRangeToActivityArray(
  startDate: string,
  endDate: string
): Activity[] {
  const datesArray: Activity[] = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    datesArray.push({
      count: 1,
      date: currentDate.toISOString().split("T")[0],
      level: 1,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return datesArray;
}

// Returns empty string if no matching dataRange was found
const getDateRangesByYear = (year: string, incidences: Incidence[]): string => {
  const exist = incidences.find((i) => i.yearRange);
  return exist ? exist.dateRanges : "";
};

// Returns a copy of the found incidence
const getIncidenceByYear = (
  year: string,
  incidences: Incidence[]
): Incidence | null => {
  const exist = incidences.find((i) => i.yearRange === year);
  return exist ? { ...exist } : null;
};

const HabitIncidence = ({ habit, token }: HabitIncidenceDetailsProps) => {
  const [yearRange, setYearRange] = React.useState<string>(
    moment().year().toString()
  );

  const [incidence, setIncidence] = React.useState<Incidence | null>(
    getIncidenceByYear(yearRange, habit.incidences)
  );

  const [dateRanges, setDateRanges] = React.useState<string[]>(
    deserializeStringToArray(getDateRangesByYear(yearRange, habit.incidences))
  );

  React.useEffect(() => {
    // const newRanges = getInci(yearRange, habit.incidences);
    // setDateRanges(deserializeStringToArray(newRanges));
    const newIncidence = getIncidenceByYear(yearRange, habit.incidences);
    setIncidence(newIncidence);
  }, [yearRange]);

  const activities: Activity[] = React.useMemo(() => {
    const dateArr: Activity[][] = dateRanges.map((i) => {
      const [start, end] = i.split(":");
      return mapDateRangeToActivityArray(start, end);
    });

    const flatten = dateArr.flat();

    const startingActivity: Activity = {
      count: 0,
      date: `${yearRange}-01-01`,
      level: 0,
    };

    const endActivity: Activity = {
      count: 0,
      date: `${yearRange}-12-31`,
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
  }, [dateRanges, yearRange]);

  const handleActivityClick = (ac: Activity) => {
    const formatted = moment(ac.date).tz(moment.tz.guess()).format(dateFormat);
    const newRanges = ac.count
      ? removeDateFromRanges(dateRanges, formatted)
      : mergeNewDateRanges(dateRanges, formatted);

    // Need to revert this if saving fails
    setDateRanges(newRanges);

    if (incidence) {
      // Update
      updateIndigence({
        token,
        dateRanges: serializeArrayToString(newRanges),
        incidenceId: incidence.id,
        yearRange,
      }).then(() => {
        // Just for testing
        // setDateRanges(newRanges);
      });
    } else {
      // Create
      createIncidence({
        dateRanges: serializeArrayToString(newRanges),
        habitId: habit.id,
        token,
        yearRange,
      });
    }
  };

  return (
    <div className="m-3 px-4 pb-5 border-2 bg-white border-slate-300 rounded-lg flex flex-col">
      <h4 className="ml-1 text-slate-700 font-semibold text-lg mt-2">
        {habit.habitName}
      </h4>
      <ReactTooltip id="react-tooltip" />
      <div className="mt-3 text-slate-500 select-none overflow-hidden no-scrollbar flex-row-reverse">
        <ActivityCalendar
          // hideMonthLabels
          // showWeekdayLabels
          hideColorLegend
          maxLevel={1}
          renderBlock={(block, activity) =>
            React.cloneElement(block, {
              "data-tooltip-id": "react-tooltip",
              "data-tooltip-html": moment(activity.date).format("Do MMM YY"),
              className: "outline-none cursor-pointer",
            })
          }
          eventHandlers={{
            onClick: (e) => handleActivityClick,
          }}
          blockSize={16}
          blockRadius={3}
          blockMargin={3}
          weekStart={0}
          fontSize={14}
          hideTotalCount
          colorScheme="light"
          theme={{
            light: ["#f0f0f0", "#4A4"],
            dark: ["#f0f0f0", "#3cc9ae14"],
          }}
          data={activities}
        />
      </div>
    </div>
  );
};

export const HabitsIncidences = ({ data, token }: HabitsIncidencesProps) => {
  const [isAdding, setIsAdding] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <div>
      <div className="m-3">
        <div className=" flex text-blue-500 gap-4 items-center">
          <FaPlusSquare
            className="cursor-pointer"
            size={28}
            onClick={() => setIsAdding(true)}
          />
          {isAdding ? (
            <input
              className="p-1 px-2 rounded-md text-slate-400 outline-none border-2 border-slate-300 bg-white text-base font-semibold"
              placeholder="Title"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          ) : (
            <p className="font-semibold text-lg text-slate-400 select-none">
              Add
            </p>
          )}
        </div>
      </div>
      <div>
        {data.map((item) => (
          <HabitIncidence key={item.id} habit={item} token={token} />
        ))}
      </div>
    </div>
  );
};
