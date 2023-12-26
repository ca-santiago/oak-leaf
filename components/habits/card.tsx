import {
  deserializeStringToArray,
  findDateInRanges,
  getDateRangesByYear,
  getIncidenceByYear,
  mapDateRangeToActivityArray,
  mergeNewDateRanges,
  removeDateFromRanges,
  serializeArrayToString,
} from "@/helpers/dateRange";
import { createIncidence, updateIndigence } from "@/services/incidences";
import { Habit, Incidence } from "../../core/types";
import moment from "moment-timezone";
import ActivityCalendar, { Activity } from "react-activity-calendar";
import { DATE_FORMAT } from "@/core/constants";
import React from "react";

import { MdEdit } from "react-icons/md";
import { FaSquareCheck } from "react-icons/fa6";
import { BsTrash2Fill } from "react-icons/bs";
import { BiLoaderAlt } from "react-icons/bi";
import { ColorsMapping, IconMapping } from "@/core/mappings";
import { deleteHabit } from "@/services/habits";
import { ConfirmationModal } from "../modal/confirmation";

interface HabitDetailsProps {
  habit: Habit;
  token: string;
  onEditClick: () => any;
  onDelete: () => any;
}

export const HabitDetails = ({
  habit,
  token,
  onEditClick,
  onDelete,
}: HabitDetailsProps) => {
  const [yearRange, setYearRange] = React.useState<string>(
    moment().year().toString()
  );
  const today = moment().tz(moment.tz.guess()).format(DATE_FORMAT);

  const [incidence, setIncidence] = React.useState<Incidence | null>(
    getIncidenceByYear(yearRange, habit.incidences)
  );

  const [dateRanges, setDateRanges] = React.useState<string[]>(
    deserializeStringToArray(getDateRangesByYear(yearRange, habit.incidences))
  );

  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const [todayCompleted, setTodayCompleted] = React.useState(
    findDateInRanges(
      moment.tz(moment.tz.guess()).format(DATE_FORMAT),
      dateRanges
    )
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
    if (moment(today).month() < 7) return;
    scrollToToday();
  }, []);

  React.useEffect(() => {
    const foundIncidence = getIncidenceByYear(yearRange, habit.incidences);
    if (foundIncidence) setIncidence(foundIncidence);
    else {
      // Fetch incidence
    }
  }, [yearRange, habit.incidences]);

  const saveRanges = (
    incidence: Incidence | null,
    newRanges: string[],
    oldRanges: string[]
  ) => {
    setSaving(true);
    if (incidence) {
      updateIndigence({
        token,
        dateRanges: serializeArrayToString(newRanges),
        incidenceId: incidence.id,
        yearRange,
      })
        .then(() => {
          setDateRanges(newRanges);
          setTodayCompleted(findDateInRanges(today, newRanges));
        })
        .catch((err) => {
          // Revert if saving fails
          setDateRanges(oldRanges);
        })
        .finally(() => {
          setSaving(false);
        });
    } else {
      createIncidence({
        dateRanges: serializeArrayToString(newRanges),
        habitId: habit.id,
        token,
        yearRange,
      })
        .then(({ data }) => {
          setSaving(false);
          setIncidence(data);
        })
        .catch((err) => {
          setDateRanges(dateRanges);
        })
        .finally(() => {
          setSaving(false);
        });
    }
  };

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
    if (loading || saving) return;

    const formatted = moment(ac.date).tz(moment.tz.guess()).format(DATE_FORMAT);
    const newRanges = ac.count
      ? removeDateFromRanges(dateRanges, formatted)
      : mergeNewDateRanges(dateRanges, formatted);

    // Need to revert this if saving fails
    setDateRanges(newRanges);
    saveRanges(incidence, newRanges, dateRanges);
  };

  const toggleDay = () => {
    const newRanges = todayCompleted
      ? removeDateFromRanges(dateRanges, today)
      : mergeNewDateRanges(dateRanges, today);
    setTodayCompleted(!todayCompleted);
    setDateRanges(newRanges);

    saveRanges(incidence, newRanges, dateRanges);
  };

  const _delete = () => {
    setLoading(true);
    setSaving(true);

    deleteHabit({
      habitId: habit.id,
      token,
    })
      .then(() => onDelete())
      .catch((err) => console.log(err))
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
    <div className="flex justify-between items-start">
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
            todayCompleted ? `${colorSchema.active}` : `${colorSchema.base}`
          }
          onClick={toggleDay}
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
              onClick: () => handleActivityClick,
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
      </div>
      <div className="hidden md:block absolute bottom-3 right-0 translate-x-2 hover:translate-x-10 duration-150 ease-in-out select-none">
        <div className="w-10 hover:h-fit bg-slate-500 duration-150 ease-in-out hover:bg-slate-600 flex items-center justify-center rounded-r-md cursor-pointer py-2">
          <div className="flex flex-col gap-2">
            <BsTrash2Fill
              onClick={handleDeleteClick}
              size={20}
              className="text-red-400 rounded-full hover:bg-slate-500 p-1 w-fit h-fit"
            />
            <MdEdit
              onClick={onEditClick}
              size={18}
              className="text-slate-50 rounded-full hover:bg-slate-500 p-1 w-fit h-fit"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
