import { DATE_FORMAT } from "@/core/constants";
import { YearRangeData } from "@/core/types";
import {
  deserializeCompletionsRecord,
  findExistingRangeForADate,
} from "@/helpers/incidences";
import moment from "moment-timezone";
import React from "react";

interface CompletionsManager {
  state: YearRangeData[];
  currentRanges: YearRangeData;
  setYear: (y: string) => void;
  isCurrentYear: boolean;
  isTodayCompleted: boolean;
  /** date is in the format of YYY-MM-dd */
  addDate: (date: string) => void;
  /** date is in the format of YYY-MM-dd */
  removeDate: (date: string) => void;
}

interface Args {
  rawCompletions: string;
  initialYear: string;
}

export const useCompletionsManager = ({
  initialYear,
  rawCompletions,
}: Args): CompletionsManager => {
  const TZ = moment.tz.guess();
  const TODAY = moment().tz(TZ).format(DATE_FORMAT);
  const TODAY_MOMENT = moment().tz(TZ);

  const [year, setYear] = React.useState(moment().year().toString());
  const [dateRanges, setDateRanges] = React.useState(
    deserializeCompletionsRecord(rawCompletions)
  );

  const currRanges = React.useMemo((): YearRangeData => {
    const emptyNewYearRange = { ranges: [], year: year };
    return dateRanges.find((r) => r.year === year) || emptyNewYearRange;
  }, [dateRanges, year]);

  const isTodayCompleted = React.useMemo(
    () => !!findExistingRangeForADate(TODAY, currRanges),
    [currRanges, TODAY]
  );

  const currentRanges: YearRangeData = dateRanges.find(
    (d) => d.year === year
  ) || {
    ranges: [],
    year,
  };

  return {
    state: dateRanges,
    currentRanges,
    setYear,
    isCurrentYear: TODAY_MOMENT.year.toString() === year,
    isTodayCompleted,
    addDate: () => {},
    removeDate: () => {},
  };
};
