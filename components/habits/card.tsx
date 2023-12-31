import React, { SyntheticEvent } from "react";
import { mapDateRangeToActivityArray } from "@/helpers/activity";
import { YearRangeData, Habit } from "../../core/types";
import moment from "moment-timezone";
import ActivityCalendar, { Activity } from "react-activity-calendar";
import { DATE_FORMAT, IS_PROD } from "@/core/constants";

import { MdEdit } from "react-icons/md";
import { FaSquareCheck } from "react-icons/fa6";
import { BsTrash2Fill } from "react-icons/bs";
import { BiLoaderAlt } from "react-icons/bi";
import { ColorsMapping, IconMapping } from "@/core/mappings";
import { HabitService, deleteHabit } from "@/services/habits";
import { ConfirmationModal } from "../modal/confirmation";
import toast from "react-hot-toast";
import {
  deserializeCompletionsRecord,
  findExistingRangeForADate,
  mergeDateOnYearRangeData,
  removeDateFromYearRangeData,
  serializeDateRangeData,
  splitDateRange,
} from "@/helpers/incidences";

interface HabitDetailsProps {
  habit: Habit;
  token: string;
  onEditClick: () => any;
  onDelete: () => any;
}

const TZ = moment.tz.guess();
const TODAY = moment().tz(TZ).format(DATE_FORMAT);
const TODAY_MOMENT = moment().tz(TZ);

export const HabitDetails = ({
  habit,
  token,
  onEditClick,
  onDelete,
}: HabitDetailsProps) => {
  const [year, setYear] = React.useState(moment().year().toString());
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [dateRanges, setDateRanges] = React.useState(
    deserializeCompletionsRecord(habit.completions)
  );

  const currRanges = React.useMemo((): YearRangeData => {
    const emptyNewYearRange = { ranges: [], year: year };
    return dateRanges.find((r) => r.year === year) || emptyNewYearRange;
  }, [dateRanges, year]);

  const isTodayCompleted = React.useMemo(
    () => findExistingRangeForADate(TODAY, currRanges),
    [currRanges, TODAY]
  );

  const scrollToToday = () => {
    const el = document
      .getElementById(`${habit.id}`)
      ?.querySelector("svg.react-activity-calendar__calendar");

    if (el?.parentElement) {
      el.parentElement.scrollLeft = el.scrollWidth;
    }
  };

  React.useEffect(() => {
    if (moment(TODAY).month() < 7) return;
    scrollToToday();
  }, []);

  const saveIncidences = (
    newIncidences: YearRangeData[],
    oldIncidences: YearRangeData[]
  ) => {
    setSaving(true);
    setDateRanges(newIncidences);

    HabitService.save({
      habitId: habit.id,
      token,
      completions: serializeDateRangeData(newIncidences),
    })
      .catch(() => {
        toast.error(`Error saving`);
        setDateRanges(oldIncidences);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const activities: Activity[] = React.useMemo(() => {
    const dateArr: Activity[][] = currRanges.ranges.map((range) => {
      const [start, end] = splitDateRange(range).map((d) => `${year}-${d}`);
      return mapDateRangeToActivityArray(start, end);
    });

    const flatten = dateArr.flat();

    const startingActivity: Activity = {
      count: 0,
      date: `${year}-01-01`,
      level: 0,
    };

    const endActivity: Activity = {
      count: 0,
      date: `${year}-12-31`,
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
  }, [currRanges, year]);

  const handleActivityClick = (ac: Activity) => {
    if (loading || saving) return;

    const formatted = moment(ac.date).tz(TZ).format(DATE_FORMAT);
    const newRanges = ac.count
      ? removeDateFromYearRangeData(currRanges, formatted)
      : mergeDateOnYearRangeData(currRanges, formatted);

    const filteredDateRanges = dateRanges.filter((r) => r.year !== year);
    saveIncidences([...filteredDateRanges, newRanges], dateRanges);
  };

  const toggleDay = () => {
    if (TODAY_MOMENT.year().toString() !== year) return;
    const newRanges = isTodayCompleted
      ? removeDateFromYearRangeData(currRanges, TODAY)
      : mergeDateOnYearRangeData(currRanges, TODAY);

    const filteredDateRanges = dateRanges.filter((r) => r.year !== year);
    saveIncidences([...filteredDateRanges, newRanges], []);
  };

  const _delete = () => {
    setLoading(true);
    setSaving(true);

    deleteHabit({
      habitId: habit.id,
      token,
    })
      .then(() => onDelete())
      .catch((err) => {
        console.error(err);
        toast.error("Could not delete habit, please try again");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleDeleteClick = () => {
    if (loading || saving) return;

    setShowConfirmation(true);
  };

  const colorSchema =
    ColorsMapping[habit.colorKey] || ColorsMapping.defaultColorSchema;
  const Icon = IconMapping[habit.iconKey] || IconMapping.default;

  const CardHeader = () => (
    <div className="flex justify-between items-start select-none">
      <div>
        <div className="flex flex-row gap-2 items-center text-slate-600">
          <Icon.Icon size={Icon.size} />
          <h4 className="font-semibold text-lg notranslate">
            {habit.habitName}
          </h4>
        </div>
        {habit.description && (
          <p className="text-slate-400 text-xs font-medium notranslate">
            {habit.description}
          </p>
        )}
      </div>
      {saving ? (
        <BiLoaderAlt
          size={28}
          className="animate-spin"
          color={colorSchema.base}
        />
      ) : (
        <FaSquareCheck
          size={28}
          className="text-slate-400 cursor-pointer hover:text-slate-500"
          color={
            isTodayCompleted ? `${colorSchema.active}` : `${colorSchema.base}`
          }
          onClick={(e: SyntheticEvent) => {
            e.stopPropagation();
            toggleDay();
          }}
        />
      )}
    </div>
  );

  const handleConfirmClick = () => {
    setShowConfirmation(false);
    _delete();
  };

  const handleCardClick = () => {
    const w = screen.width;
    if (w > 769) return;
    onEditClick();
  };

  return (
    <div className="w-full relative max-w-xl">
      <ConfirmationModal
        onCancel={() => setShowConfirmation(false)}
        onConfirm={handleConfirmClick}
        title={`Are you sure you want to delete this habit?`}
        show={showConfirmation}
      />
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleCardClick();
        }}
        className="p-3 z-10 shadow-line bg-white rounded-lg flex flex-col max-w-full relative"
      >
        <CardHeader />
        <div
          id={habit.id}
          className="mt-3 text-slate-500 select-none no-scrollbar w-fit max-w-full overflow-hidden"
        >
          <ActivityCalendar
            hideMonthLabels
            loading={loading}
            hideColorLegend
            maxLevel={2}
            renderBlock={(block) =>
              React.cloneElement(block, {
                className: "cursor-pointer overflow-hidden",
              })
            }
            eventHandlers={{
              onClick: (e) => (ac) => {
                e.stopPropagation();
                handleActivityClick(ac);
              },
            }}
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
          {!IS_PROD && (
            <div className="py-2 flex gap-2">
              <button
                className="rounded bg-blue-500 text-white p-0.5 px-2 text-xs cursor-pointer"
                onClick={() => setYear("2023")}
              >
                2023
              </button>
              <button
                className="rounded bg-blue-500 text-white p-0.5 px-2 text-xs cursor-pointer"
                onClick={() => setYear("2024")}
              >
                2024
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="hidden md:block absolute bottom-3 right-0 translate-x-2 hover:translate-x-10 duration-150 ease-in-out select-none">
        <div className="w-10 hover:h-fit bg-slate-500 duration-150 ease-in-out hover:bg-slate-600 flex items-center justify-center rounded-r-md cursor-pointer py-2">
          <div className="flex flex-col gap-2">
            <BsTrash2Fill
              onClick={(e: SyntheticEvent) => {
                e.stopPropagation();
                handleDeleteClick();
              }}
              size={20}
              className="text-red-400 rounded-full hover:bg-slate-500 p-1 w-fit h-fit"
            />
            <MdEdit
              onClick={(e: SyntheticEvent) => {
                e.stopPropagation();
                onEditClick();
              }}
              size={18}
              className="text-slate-50 rounded-full hover:bg-slate-500 p-1 w-fit h-fit"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
