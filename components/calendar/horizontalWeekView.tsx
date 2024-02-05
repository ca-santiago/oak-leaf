import React, { SyntheticEvent } from "react";
import moment from "moment-timezone";

import { RiArrowDropLeftLine, RiArrowDropRightLine } from "react-icons/ri";
import { DATE_FORMAT } from "@/core/constants";
import classNames from "classnames";

interface WeekDayChipProps {
  dayText: string;
  isActive?: boolean;
  isToday?: boolean;
  showBadge?: boolean;
  onClick?: () => any;
}

const WeekDayChip = ({
  dayText,
  isActive,
  isToday,
  onClick,
  showBadge,
}: WeekDayChipProps) => {
  const handleOnClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  const chipWrapperCn = classNames(
    "rounded-lg border border-slate-300 p-1 px-2 flex flex-col items-center relative",
    "justify-center text-slate-500 cursor-pointer max-w-[50px] min-h-[75px]",
    { ["border-green-500"]: isActive }
  );

  const badgeCn = classNames(
    "h-[6px] w-[6px] rounded-full absolute top-1 right-1 bg-red-400",
    { ["hidden"]: !showBadge }
  );

  const todayCn = classNames(
    "h-[3px] w-[12px] rounded-full absolute bottom-[6px] bg-orange-400",
    { ["hidden"]: !isToday }
  );

  return (
    <div className={chipWrapperCn} onClick={handleOnClick}>
      <div className={badgeCn} />
      <div className="text-center">{dayText}</div>
      <div className={todayCn} />
    </div>
  );
};

export interface HorizontalWeekDaysViewProps {
  startAt: string;
  onSelectedDayChange?: (date: string) => any;
  daysWithBadges?: string[];
}

const HorizontalWeekDaysView = ({
  onSelectedDayChange,
  startAt,
  daysWithBadges,
}: HorizontalWeekDaysViewProps) => {
  const [today] = React.useState(moment(startAt).tz(moment.tz.guess()));
  const [selectedDay, setSelectedDay] = React.useState(today);
  const [weekOffset, setWeekOffset] = React.useState(0);

  const offsetDate = React.useMemo(() => {
    const out = today.clone().add(weekOffset, "weeks");
    const offsetDay = out.day(selectedDay.day()).format(DATE_FORMAT);
    onSelectedDayChange?.(offsetDay);
    setSelectedDay(out);
    return out;
  }, [today, weekOffset]);

  const momentWeekDays = React.useMemo(() => {
    const dayNumbers = [0, 1, 2, 3, 4, 5, 6];
    return dayNumbers.map((d) => offsetDate.clone().day(d));
  }, [offsetDate]);

  return (
    <div className="flex flex-col w-full mt-2 select-none">
      <h4 className="font-semibold text-slate-600 text-center">
        {offsetDate.format("MMMM / YYYY")}
      </h4>
      <div className="flex gap-4 mt-2 mx-auto items-center">
        <RiArrowDropLeftLine
          size={40}
          className="text-slate-500 cursor-pointer hover:text-slate-600"
          onClick={() => setWeekOffset((prev) => prev - 1)}
        />
        <div className="flex gap-3">
          {momentWeekDays.map((d) => {
            const wd = d.format("dd DD");
            const standFormat = d.format(DATE_FORMAT);
            const showBadge = !!daysWithBadges?.includes(standFormat);
            return (
              <WeekDayChip
                key={wd}
                dayText={wd}
                isActive={selectedDay.format("dd DD") === wd}
                isToday={d.isSame(today)}
                showBadge={showBadge}
                onClick={() => {
                  setSelectedDay(d);
                  onSelectedDayChange?.(d.toISOString());
                }}
              />
            );
          })}
        </div>
        <RiArrowDropRightLine
          size={40}
          className="text-slate-500 cursor-pointer hover:text-slate-600"
          onClick={() => setWeekOffset((prev) => prev + 1)}
        />
      </div>
    </div>
  );
};

export default HorizontalWeekDaysView;
