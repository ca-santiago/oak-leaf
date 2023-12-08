"use client";
import { Completion, Habit } from "@prisma/client";
import React from "react";
import ActivityCalendar, { Activity } from "react-activity-calendar";
import { Tooltip as ReactTooltip } from "react-tooltip";
import moment from "moment-timezone";
import { createCompletion, setCompletion } from "./completions";

interface _Habit extends Habit {
  completions: Completion[];
}

interface HabitsProps {
  data: _Habit[];
  token: string;
}

interface HabitDetailsProps {
  habit: _Habit;
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
