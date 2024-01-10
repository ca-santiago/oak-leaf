import { DATE_FORMAT } from "@/core/constants";
import { YearRangeData } from "@/core/types";
import moment, { Moment } from "moment";

function extractMonthAndDay(str: string): string {
  return str.slice(5, str.length);
}

export function mergeDateOnYearRangeData(
  yearRange: YearRangeData,
  givenDate: string
): YearRangeData {
  const { year, ranges } = yearRange;
  const given = new Date(givenDate);
  const _givenDate = extractMonthAndDay(givenDate);
  let merged = false;
  const _ranges = [...ranges];

  for (let i = 0; i < ranges.length; i++) {
    const [s, e] = ranges[i].split(":");
    const startDate = `${year}-${s}`;
    const endDate = `${year}-${e}`;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (given >= start && given <= end) {
      // Date falls within an existing range, no action needed
      merged = true;
      break;
    } else if (given.getTime() === end.getTime() + 24 * 60 * 60 * 1000) {
      // Date is right after an existing range, extend the range
      _ranges[i] = `${s}:${_givenDate}`;
      merged = true;
      break;
    } else if (given.getTime() === start.getTime() - 24 * 60 * 60 * 1000) {
      // Date is right before an existing range, extend the range
      _ranges[i] = `${_givenDate}:${e}`;
      merged = true;
      break;
    }
  }

  if (!merged) {
    // Date is new, create a new range
    _ranges.push(`${_givenDate}:${_givenDate}`);
  }

  // Merge overlapping intervals if any
  _ranges.sort();
  const mergedRanges = [];
  let currentRange = _ranges[0].split(":");

  for (let i = 1; i < _ranges.length; i++) {
    const [_start, _end] = _ranges[i].split(":");
    const startDate = `${year}-${_start}`;
    const currentEnd = new Date(`${year}-${currentRange[1]}`);
    const nextStart = new Date(startDate);

    if (
      nextStart <= currentEnd ||
      nextStart.getTime() === currentEnd.getTime() + 24 * 60 * 60 * 1000
    ) {
      currentRange[1] = _end;
    } else {
      mergedRanges.push(currentRange.join(":"));
      currentRange = [_start, _end];
    }
  }

  mergedRanges.push(currentRange.join(":"));

  return {
    year,
    ranges: mergedRanges,
  };
}

/**
 * @argument givenDate: A date in the format of YYYY-MM-dd
 */
export function removeDateFromYearRangeData(
  dateRanges: YearRangeData,
  givenDate: string
): YearRangeData {
  const { year, ranges } = dateRanges;
  const updatedRanges = Array.from(ranges);
  const dateToFind = new Date(givenDate);

  for (let i = 0; i < updatedRanges.length; i++) {
    const [_start, _end] = updatedRanges[i].split(":");
    const startDate = `${year}-${_start}`;
    const endDate = `${year}-${_end}`;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Single day range equals to givenDate
    if (
      start.getTime() === end.getTime() &&
      dateToFind.getTime() === start.getTime()
    ) {
      updatedRanges.splice(i, 1);
      i--;
      break;
    }

    if (start.getTime() === dateToFind.getTime()) {
      // Adjust range start
      const adjustedStartDate = new Date(dateToFind);
      adjustedStartDate.setDate(adjustedStartDate.getDate() + 1);
      const _adjustedStartDate = extractMonthAndDay(
        adjustedStartDate.toISOString().split("T")[0]
      );
      updatedRanges[i] = `${_adjustedStartDate}:${_end}`;
      break;
    } else if (end.getTime() === dateToFind.getTime()) {
      // Adjust range end
      const adjustedEndDate = new Date(dateToFind);
      adjustedEndDate.setDate(adjustedEndDate.getDate() - 1);
      const _adjustedEndDate = extractMonthAndDay(
        adjustedEndDate.toISOString().split("T")[0]
      );
      updatedRanges[i] = `${_start}:${_adjustedEndDate}`;
      break;
    }

    if (dateToFind > start && dateToFind < end) {
      const newEndDate = new Date(dateToFind);
      newEndDate.setDate(newEndDate.getDate() - 1);
      const _newEndDate = extractMonthAndDay(
        newEndDate.toISOString().split("T")[0]
      );

      const newStartDate = new Date(dateToFind);
      newStartDate.setDate(newStartDate.getDate() + 1);
      const _newStartDate = extractMonthAndDay(
        newStartDate.toISOString().split("T")[0]
      );

      updatedRanges.splice(
        i,
        1,
        `${_start}:${_newEndDate}`,
        `${_newStartDate}:${_end}`
      );
      i++; // Move to the next range
    }
  }

  return {
    year,
    ranges: updatedRanges,
  };
}

export function splitCompletionsRecord(str: string): string[] {
  return str.split("|");
}

export function splitYearRanges(str: string): string[] {
  return str.split("=");
}

export function splitDateRanges(str: string): string[] {
  return str.split(",");
}

export function splitDateRange(str: string): string[] {
  return str.split(":");
}

export function joinDateRangeArr(str: string[]): string {
  return str.join(",");
}

export function yearRangeDataToYearRanges(YRs: YearRangeData[]): string[] {
  return YRs.map((yr) => `${yr.year}=${joinDateRangeArr(yr.ranges)}`);
}

export function yearRangesToCompletionsRecord(str: string[]): string {
  return str.join("|");
}

export function deserializeCompletionsRecord(str: string): YearRangeData[] {
  if (!str) return []; // CompletionsRecord can be and empty for new habits
  const out: YearRangeData[] = [];
  const yearRanges = splitCompletionsRecord(str);
  yearRanges.forEach((range) => {
    const [year, dateRanges] = splitYearRanges(range);
    const ranges = splitDateRanges(dateRanges);
    out.push({ year, ranges });
  });
  return out;
}

export function serializeDateRangeData(ranges: YearRangeData[]): string {
  const yearRanges = yearRangeDataToYearRanges(ranges);
  return yearRangesToCompletionsRecord(yearRanges);
}

/**
 * Find if given date exists in ranges
 * @returns the dataRange or null if not found
 */
export const findExistingRangeForADate = (
  dateToFind: string,
  yearRange: YearRangeData
): string | null => {
  const { year, ranges } = yearRange;
  const exists = ranges.find((e) => {
    const [_start, _end] = splitDateRange(e);
    const start = new Date(`${year}-${_start}`).getTime();
    const end = new Date(`${year}-${_end}`).getTime();
    const toFind = new Date(dateToFind).getTime();
    return toFind >= start && toFind <= end;
  });
  return exists || null;
};

export const daysInRange = (start: string, end: string): number => {
  return (
    (new Date(end).getTime() - new Date(start).getTime()) /
      (1000 * 60 * 60 * 24) +
    1
  );
};

export const calculateStreak = (yearRange: YearRangeData) => {
  const { year, ranges } = yearRange;
  const lastRange = ranges[ranges.length - 1];

  if (!lastRange) return 0;

  const today = moment().format(DATE_FORMAT);
  const yesterday = moment().subtract(1, 'day').format(DATE_FORMAT);

  const [s, e] = splitDateRange(lastRange);
  const endDate = `${year}-${e}`;
  //const endDate = moment(`${year}-${e}`).tz(moment.tz.guess());

  // const isToday = today.isSame(endDate, 'day');
  // const isYesterday = yesterday.isSame(endDate, 'day');

  const isToday = endDate === today;
  const isYesterday = endDate === yesterday;

  if (isToday || isYesterday) {
    return daysInRange(s,e);
  }

  return 0;
};
