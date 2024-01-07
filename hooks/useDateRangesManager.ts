import { YearRangeData } from "@/core/types";
import React from "react";

interface DateRangeManager {
  state: YearRangeData[];
  currentRanges: YearRangeData;
  setYear: (y: string) => void;
}

interface Args {
  rawRanges: string;
  initialYear: string;
}

export const useDateRangesManager = ({
  initialYear,
  rawRanges,
}: Args): DateRangeManager => {
  const [selectedYear, setSelectedYear] = React.useState<string>("2023");
  const [dateRanges, setDateRanges] = React.useState<YearRangeData[]>([]);
  // Deserialize this thing

  const currentRanges: YearRangeData = dateRanges.find(
    (d) => d.year === selectedYear
  ) || {
    ranges: [],
    year: selectedYear,
  };

  return {
    state: dateRanges,
    currentRanges,
    setYear: setSelectedYear,
  };
};
