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
import { DATE_FORMAT } from "@/core/constants";
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
  sortYearRange,
  splitDateRange,
} from "@/helpers/incidences";
import { useRouter } from "next/navigation";

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
  const navigate = useRouter();

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

  const streak = React.useMemo(() => calculateStreak(currRanges), [currRanges]);

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
    filteredDateRanges.push(updatedRange);
    saveIncidences(sortYearRange(filteredDateRanges), dateRanges);
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
    filteredDateRanges.push(newRanges);
    saveIncidences(sortYearRange(filteredDateRanges), dateRanges);
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

  const renderStreaks = () => {
    return (
      !!streak && (
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
      )
    );
  };

  const handleConfirmClick = () => {
    setShowConfirmation(false);
    _delete();
  };

  const handleCardClick = () => {
    // navigate.push(`/habits/${habit.id}`);
    const w = screen.width;
    if (w < 1024) onEditClick();
  };

  const CardHeader = () => (
    <div className="flex justify-between items-start select-none">
      <div>
        <div
          onClick={handleCardClick}
          className="flex flex-row gap-2 items-center text-slate-600  cursor-pointer"
        >
          <Icon.Icon size={Icon.size} />
          <h4 className="font-semibold text-lg notranslate hover:underline">
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

  return (
    <div className="w-full max-w-full relative md:max-w-xl overflow-hidden max-md:pb-2 pb-1 flex">
      <ConfirmationModal
        onCancel={() => setShowConfirmation(false)}
        onConfirm={handleConfirmClick}
        title={`Are you sure you want to delete this habit?`}
        show={showConfirmation}
      />
      <div
        className="p-3 z-10 shadow-line bg-white rounded-lg flex flex-col max-w-full justify-between max-lg:mx-auto"
        onClick={(e) => { e.stopPropagation() }}
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
        <div className="flex justify-between pt-3 text-slate-500 text-xs font-semibold">
          <div className="[&>:nth-child(n)]:border-r-2 [&>:nth-child(n)]:pr-2 [&>:nth-last-child(1)]:border-r-0 h-[28px] flex gap-3 items-center">
            {renderStreaks()}
          </div>
          <div className="gap-2 items-center max-lg:hidden flex">
            <BsTrash2Fill
              onClick={(e: React.SyntheticEvent) => {
                e.stopPropagation();
                handleDeleteClick?.();
              }}
              size={16}
              className="text-red-400 rounded-full hover:bg-slate-100 p-1 w-fit h-fit"
            />
            <MdEdit
              onClick={(e: React.SyntheticEvent) => {
                e.stopPropagation();
                onEditClick?.();
              }}
              size={16}
              className="text-slate-500 rounded-full hover:bg-slate-100 p-1 w-fit h-fit"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
