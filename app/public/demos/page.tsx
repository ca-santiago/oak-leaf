"use client";
import React from "react";
import HorizontalWeekDaysView from "@/components/calendar/horizontalWeekView";
import moment from "moment";
import { DATE_FORMAT } from "@/core/constants";

// import useDrawer from "@/hooks/useDrawer";
// const { Drawer, open } = useDrawer();
// const Drawer2 = useDrawer();

export default function DemosPage() {
  const [selectedDay, setSelectedDay] = React.useState(
    moment().format(DATE_FORMAT)
  );

  const handleDateSelectionChange = (d: string) => {
    setSelectedDay(moment(d).format(DATE_FORMAT));
  };

  return (
    <div className="h-screen w-full flex bg-slate-100">
      <div className="w-full md:w-4/5 lg:w-3/5 xl:w-2/5 m-5 md:mx-auto border flex flex-col gap-6 rounded-md mt-3 min-h-[30px] p-3 bg-white">
        <div>
          <h3 className="text-slate-600 font-semibold text-lg">Week view</h3>
          <HorizontalWeekDaysView
            startAt={selectedDay}
            daysWithBadges={["2024-02-06", "2024-02-09"]}
            onSelectedDayChange={handleDateSelectionChange}
          />
          <p className="text-center" suppressHydrationWarning={true}>
            {selectedDay}
          </p>
        </div>
        <div className="h-[2px] border-b border-slate-300 w-full"></div>
      </div>
    </div>
  );
}
