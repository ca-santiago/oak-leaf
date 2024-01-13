import { DATE_FORMAT } from "@/core/constants";
import { YearRangeData } from "@/core/types";
import moment from "moment";

function extractMonthAndDay(str: string): string {
  return str.slice(5, str.length);
}

export function mergeDateOnYearRangeDataV2(
  yearRange: YearRangeData,
  givenDate: string
): YearRangeData {
  const { year, ranges } = yearRange;
  const dateToMerge = new Date(givenDate);
  const stringDate = extractMonthAndDay(givenDate);

  // Nothing to loop, so just insert
  if (ranges.length === 0)
    return {
      year,
      ranges: [`${stringDate}:${stringDate}`],
    };

  const [gDateYear] = givenDate.split("-");
  if (year !== gDateYear) throw new Error(`Invalid year: ${givenDate}`);

  let merged = false;
  const rangesWithNewDate: string[] = [];

  ranges.forEach((r) => {
    const [s, e] = splitDateRange(r);
    const start = `${year}-${s}`;
    const end = `${year}-${e}`;
    const startDate = new Date(start);
    const endDate = new Date(end);

    const beforeStartDate = new Date(startDate);
    beforeStartDate.setDate(startDate.getDate() - 1);

    if (merged) return rangesWithNewDate.push(r);

    if (dateToMerge < beforeStartDate) {
      rangesWithNewDate.push(`${stringDate}:${stringDate}`);
      rangesWithNewDate.push(r);
      merged = true;
      return;
    }

    if (dateToMerge.getTime() === endDate.getTime() + 24 * 60 * 60 * 1000) {
      // Date is right after an existing range, extend the range
      rangesWithNewDate.push(`${s}:${stringDate}`);
      merged = true;
    } else if (
      dateToMerge.getTime() ===
      startDate.getTime() - 24 * 60 * 60 * 1000
    ) {
      // Date is right before an existing range, extend the range
      rangesWithNewDate.push(`${stringDate}:${e}`);
      merged = true;
    } else {
      rangesWithNewDate.push(r);
    }
  });

  // Push at the end if no found before, after or older than current ranges
  if (!merged) rangesWithNewDate.push(`${stringDate}:${stringDate}`);

  const outRanges: string[] = [rangesWithNewDate[0]];

  for (let i = 1; i < rangesWithNewDate.length; i++) {
    const outRangesLen = outRanges.length - 1;
    const [outStart, outEnd] = outRanges[outRangesLen].split(":");
    const [currStart, currEnd] = rangesWithNewDate[i].split(":");

    const _outEnd = new Date(`${year}-${outEnd}`);
    const _currStart = new Date(`${year}-${currStart}`);
    _currStart.setDate(_currStart.getDate() - 1);
    // endDate at pos outRanges.len - 1 === startDate at curr post
    if (_outEnd >= _currStart) {
      outRanges[outRangesLen] = `${outStart}:${currEnd}`;
    } else {
      outRanges.push(rangesWithNewDate[i]);
    }
  }

  return {
    ranges: outRanges,
    year,
  };
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

export const findRangesByYearOrCreate = (
  rangesArray: YearRangeData[],
  year: string
) => {
  const emptyNewYearRange = { ranges: [], year };
  return rangesArray.find((r) => r.year === year) || emptyNewYearRange;
};

export const filterAndClampYearRangesByDateLimits = (
  yRanges: YearRangeData[],
  dateRangeAsLimit: string
): string[] => {
  const filteredRanges: string[] = [];

  yRanges.forEach(({ ranges, year }) => {
    ranges.forEach((r) => {
      const [s, e] = splitDateRange(r);

      let [start, end] = [`${year}-${s}`, `${year}-${e}`];
      const [startLimit, endLimit] = splitDateRange(dateRangeAsLimit);

      const _start = new Date(start);
      const _end = new Date(end);
      const _startLimit = new Date(startLimit);
      const _endLimit = new Date(endLimit);

      const startWithinLimits = _start >= _startLimit && _start <= _endLimit;
      const endWithinLimits = _end >= _startLimit && _end <= _endLimit;

      if (!startWithinLimits) {
        start = startLimit;
      }

      if (!endWithinLimits) {
        end = endLimit;
      }

      if (startWithinLimits || endWithinLimits) {
        filteredRanges.push(`${start}:${end}`);
      }
    });
  });

  return filteredRanges;
};

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
  const filtered = YRs.filter((y) => y.ranges.length);
  return filtered.map((yr) => `${yr.year}=${joinDateRangeArr(yr.ranges)}`);
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
  // Do not save empty ranges
  const filteredRanges = ranges.filter((range) => range.ranges.length > 0);
  const yearRanges = yearRangeDataToYearRanges(filteredRanges);
  return yearRangesToCompletionsRecord(yearRanges);
}

/**
 * Find if given date exists in ranges
 * @param dateToFind YYYY-MM-dd format string date
 * @returns the index
 */
export const findExistingRangeForADate = (
  dateToFind: string,
  dateRanges: string[]
): number => {
  const exists = dateRanges.findIndex((e) => {
    const [_start, _end] = splitDateRange(e);
    const start = new Date(`${_start}`).getTime();
    const end = new Date(`${_end}`).getTime();
    const toFind = new Date(dateToFind).getTime();
    return toFind >= start && toFind <= end;
  });
  return exists;
};

export const daysInRange = (start: string, end: string): number => {
  return (
    (new Date(end).getTime() - new Date(start).getTime()) /
      (1000 * 60 * 60 * 24) +
    1
  );
};

export const calculateStreak = (ranges: string[]) => {
  const today = moment().format(DATE_FORMAT);
  const yesterday = moment().subtract(1, "day").format(DATE_FORMAT);
  const indexForRangeWithToday = findExistingRangeForADate(today, ranges);
  const indexForRangeWithYesterday = findExistingRangeForADate(
    yesterday,
    ranges
  );
  const rangeToUse =
    ranges[indexForRangeWithToday] || ranges[indexForRangeWithYesterday];

  if (!rangeToUse) return 0;

  let [streakStart, streakEnd] = splitDateRange(rangeToUse);
  const [sYear, month, day] = streakStart.split("-");

  // If range start at year start look for adjacent prev year range
  if (`${month}-${day}` === "01-01") {
    const prevYear = Number(sYear) - 1;
    const rangeIndexPrevYear = findExistingRangeForADate(
      `${prevYear}-12-31`,
      ranges
    );
    // If a range on the prev year ends on years end date, then also count it as part of the streak
    const rangeOfPrevYearEndingLastYearDay = ranges[rangeIndexPrevYear];
    if (rangeOfPrevYearEndingLastYearDay) {
      const [_s, _e] = splitDateRange(rangeOfPrevYearEndingLastYearDay);
      streakStart = _s;
    }
  }

  const isToday = streakEnd === today;
  const isYesterday = streakEnd === yesterday;

  if (isToday || isYesterday) {
    return daysInRange(streakStart, streakEnd);
  }

  return 0;
};
