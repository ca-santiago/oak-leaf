import {
  deserializeStringToArray,
  mergeNewDateRanges,
  removeDateFromRanges,
  serializeArrayToString,
} from "@/helpers/dateRange";
import { createIncidence, updateIndigence } from "@/services/incidences";
import { Habit, Incidence } from "../../core/types";
import moment from "moment-timezone";
import ActivityCalendar, { Activity } from "react-activity-calendar";
import { DATE_FORMAT } from "@/core/constants";
import { Tooltip } from "react-tooltip";
import React from "react";

interface HabitDetailsProps {
  habit: Habit;
  token: string;
}

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

export const HabitDetails = ({ habit, token }: HabitDetailsProps) => {
  const [yearRange, setYearRange] = React.useState<string>(
    moment().year().toString()
  );

  const [incidence, setIncidence] = React.useState<Incidence | null>(
    getIncidenceByYear(yearRange, habit.incidences)
  );

  const [dateRanges, setDateRanges] = React.useState<string[]>(
    deserializeStringToArray(getDateRangesByYear(yearRange, habit.incidences))
  );

  const lastRef = React.useRef();

  React.useEffect(() => {
    // const newRanges = getInci(yearRange, habit.incidences);
    // setDateRanges(deserializeStringToArray(newRanges));
    const newIncidence = getIncidenceByYear(yearRange, habit.incidences);
    setIncidence(newIncidence);
    window.scrollTo();
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
    const formatted = moment(ac.date).tz(moment.tz.guess()).format(DATE_FORMAT);
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
    <div className="m-3 p-3 border-2 bg-white border-slate-300 rounded-lg flex flex-col max-w-full w-fit">
      <h4 className="ml-1.5 text-slate-600 font-semibold text-lg mt-1">
        {habit.habitName}
      </h4>
      <Tooltip id="react-tooltip" />
      <div className="mt-3 text-slate-500 select-none no-scrollbar w-fit max-w-full">
        <ActivityCalendar
          // hideMonthLabels
          // showWeekdayLabels
          hideColorLegend
          maxLevel={1}
          renderBlock={(block, activity) =>
            React.cloneElement(block, {
              "data-tooltip-id": "react-tooltip",
              "data-tooltip-html": moment(activity.date).format("Do MMM YY"),
              className: "outline-none cursor-pointer overflow-hidden",
            })
          }
          eventHandlers={{
            onClick: (e) => handleActivityClick,
          }}
          blockSize={13}
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
