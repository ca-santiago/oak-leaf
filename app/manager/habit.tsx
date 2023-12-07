"use client";
import { Completion, Habit } from "@prisma/client";
import React from "react";
import ActivityCalendar, { Activity } from "react-activity-calendar";

interface _Habit extends Habit {
  completions: Completion[];
}

interface HabitsProps {
  data: _Habit[];
}

interface HabitDetailsProps {
  habit: _Habit;
}

function mapCompletionToActivityCalendarData(c: Completion): Activity {
  return {
    count: 1,
    date: c.completionDate as unknown as string,
    level: 1,
  };
}

const HabitDetail = ({ habit }: HabitDetailsProps) => {
  const activityData = React.useMemo(() => {
    return habit.completions.map(mapCompletionToActivityCalendarData);
  }, [habit]);

  return (
    <div className="m-2 p-3 rounded-sm border border-slate-300 bg-white">
      <h4 className="mb-2 font-semibold text-slate-700">{habit.habitName}</h4>
      <div>
        <ActivityCalendar
          style={{ scrollbarWidth: "none" }}
          hideMonthLabels
          hideColorLegend
          hideTotalCount
          colorScheme="light"
          theme={{
            light: ['#f0f0f0', '#181'],
            dark: ['#f0f0f0', '#3cc9ae14']
          }}
          weekStart={6}
          data={[
            { count: 0, date: "2023-01-01", level: 0 },
            ...activityData,
            {
              count: 0,
              date: "2023-12-31",
              level: 0,
            },
          ]}
        />
      </div>
    </div>
  );
};

export const Habits = ({ data }: HabitsProps) => {
  return (
    <div>
      {data.map((item) => (
        <HabitDetail key={item.id} habit={item} />
      ))}
    </div>
  );
};
