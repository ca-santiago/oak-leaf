import React, { SyntheticEvent } from "react";
import { ConfirmationModal } from "../modal/confirmation";

import ActivityCalendar, { Activity } from "react-activity-calendar";
import moment from "moment-timezone";
import toast from "react-hot-toast";
import cn from "classnames";

import { MdEdit } from "react-icons/md";
import { FaSquareCheck } from "react-icons/fa6";
import { BsTrash2Fill } from "react-icons/bs";
import { BiLoaderAlt } from "react-icons/bi";
import { HiMiniFire } from "react-icons/hi2";

import { YearRangeData, Habit } from "@/core/types";
import { DATE_FORMAT, IS_PROD } from "@/core/constants";
import { mapDateRangeToActivityArray } from "@/helpers/activity";
import { ColorsMapping, IconMapping } from "@/core/mappings";
import { HabitService, deleteHabit } from "@/services/habits";
import {
  calculateStreak,
  deserializeCompletionsRecord,
  filterAndClampYearRangesByDateLimits,
  findExistingRangeForADate,
  findRangesByYearOrCreate,
  mergeDateOnYearRangeDataV2,
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
  const [year] = React.useState(moment().year().toString());
  const [rangeLimit] = React.useState(
    `${moment().subtract(7, "months").format(DATE_FORMAT)}:${moment()
      .endOf("week")
      .format(DATE_FORMAT)}`
  );
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const [dateRanges, setDateRanges] = React.useState<YearRangeData[]>(
    deserializeCompletionsRecord(habit.completions)
  );

  const currRanges = React.useMemo((): string[] => {
    return filterAndClampYearRangesByDateLimits(dateRanges, rangeLimit);
  }, [dateRanges, rangeLimit]);

  const isTodayCompleted = React.useMemo(
    () => findExistingRangeForADate(TODAY, currRanges) >= 0,
    [currRanges, TODAY]
  );

  const streak = calculateStreak(currRanges);

  const scrollToToday = () => {
    const el = document
      .getElementById(`${habit.id}`)
      ?.querySelector("svg.react-activity-calendar__calendar");

    if (el?.parentElement) {
      el.parentElement.scrollLeft = el.scrollWidth;
    }
  };

  React.useEffect(() => {
    // if (moment(TODAY).month() < 7) return;
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

  const handleActivityClick = (ac: Activity) => {
    if (loading || saving) return;

    const formatted = moment(ac.date).tz(TZ).format(DATE_FORMAT);
    // Get the year from the date
    const [y] = formatted.split("-");
    const rangeToUpdate = findRangesByYearOrCreate(dateRanges, y);
    const updatedRange = ac.count
      ? removeDateFromYearRangeData(rangeToUpdate, formatted)
      : mergeDateOnYearRangeDataV2(rangeToUpdate, formatted);

    const filteredDateRanges = dateRanges.filter((r) => r.year !== y);
    saveIncidences([...filteredDateRanges, updatedRange], dateRanges);
  };

  const toggleDay = () => {
    if (TODAY_MOMENT.year().toString() !== year) return;

    // Get the year from the date
    const [y] = TODAY.split("-");
    const rangeToUpdate = findRangesByYearOrCreate(dateRanges, y);
    const newRanges = isTodayCompleted
      ? removeDateFromYearRangeData(rangeToUpdate, TODAY)
      : mergeDateOnYearRangeDataV2(rangeToUpdate, TODAY);

    const filteredDateRanges = dateRanges.filter((r) => r.year !== year);
    saveIncidences([...filteredDateRanges, newRanges], dateRanges);
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

  const todayCompletedCheckColor = cn({
    [`${colorSchema.active}`]: isTodayCompleted,
    [`${colorSchema.base}`]: !isTodayCompleted,
  });

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
          color={todayCompletedCheckColor}
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
            maxLevel={3}
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
        </div>
        {/* STATS */}
        <div className="flex items-center pt-3 gap-2 text-slate-500 text-xs font-semibold [&>:nth-child(n)]:border-r-2 [&>:nth-child(n)]:pr-2 [&>:nth-last-child(1)]:border-r-0">
          <>
            {!!streak && (
              <div className="flex items-center gap-1">
                <HiMiniFire className="text-red-400" />
                <p>
                  {streak}{" "}
                  {streak > 0
                    ? streak > 1
                      ? "days  on a streak"
                      : "day on a streak"
                    : "no days"}
                </p>
              </div>
            )}
          </>
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
