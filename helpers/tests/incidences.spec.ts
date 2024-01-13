import { YearRangeData } from "@/core/types";
import {
  deserializeCompletionsRecord,
  joinDateRangeArr,
  yearRangeDataToYearRanges,
  serializeDateRangeData,
  yearRangesToCompletionsRecord,
  mergeDateOnYearRangeData,
  removeDateFromYearRangeData,
  findExistingRangeForADate,
  filterAndClampYearRangesByDateLimits,
  mergeDateOnYearRangeDataV2,
} from "../incidences";

describe("Incidences serialization", () => {
  test("deserializeCompletionsRecord", () => {
    const ranges = "2023=02-13:04-25,04-27:08-05|2024=01-01:01-01,01-03:01-05";
    const result = deserializeCompletionsRecord(ranges);
    expect(result).toEqual<YearRangeData[]>([
      { year: "2023", ranges: ["02-13:04-25", "04-27:08-05"] },
      { year: "2024", ranges: ["01-01:01-01", "01-03:01-05"] },
    ]);
  });

  test("serializeDateRangeData", () => {
    const dRanges: YearRangeData[] = [
      { year: "2021", ranges: ["01-17:03-24", "07-27:08-05"] },
      { year: "1999", ranges: ["01-11:02-12", "01-03:01-05"] },
    ];
    const result = serializeDateRangeData(dRanges);
    expect(result).toEqual(
      "2021=01-17:03-24,07-27:08-05|1999=01-11:02-12,01-03:01-05"
    );
  });

  test("joinDateRangeArr", () => {
    const result = joinDateRangeArr(["01-17:03-24", "07-27:08-05"]);
    expect(result).toEqual("01-17:03-24,07-27:08-05");
  });

  test("joinYearRangeData", () => {
    const result = yearRangeDataToYearRanges([
      { year: "2021", ranges: ["01-17:03-24", "07-27:08-05"] },
      { year: "1999", ranges: ["01-11:02-12", "01-03:01-05"] },
    ]);
    expect(result).toEqual([
      "2021=01-17:03-24,07-27:08-05",
      "1999=01-11:02-12,01-03:01-05",
    ]);
  });

  test("yearRangesToCompletionsRecord", () => {
    const result = yearRangesToCompletionsRecord([
      "2021=01-17:03-24,07-27:08-05",
      "1999=01-11:02-12,01-03:01-05",
    ]);
    expect(result).toBe(
      "2021=01-17:03-24,07-27:08-05|1999=01-11:02-12,01-03:01-05"
    );
  });
});

describe("mergeDateOnYearRangeDataV2", () => {
  test("insert givenDate in order (older first)", () => {
    const input = "2015-02-10";
    const ranges = ["02-12:02-14", "03-02:03-20"];
    const year = "2015";
    const yRange: YearRangeData = {
      ranges,
      year,
    };
    const expected = ["02-10:02-10", ...ranges];
    const result = mergeDateOnYearRangeDataV2(yRange, input);
    expect(result).toEqual({
      year,
      ranges: expected,
    });
  });

  test("extend range if givenDate is right after a range ends", () => {
    const input = "2015-02-16";
    const ranges = ["02-12:02-15", "03-02:03-20"];
    const year = "2015";
    const yRange: YearRangeData = {
      ranges,
      year,
    };
    const expected = ["02-12:02-16", "03-02:03-20"];
    const result = mergeDateOnYearRangeDataV2(yRange, input);
    expect(result["ranges"]).toEqual(expected);
  });

  test("extend range if givenDate is right before a range ends", () => {
    const input = "2015-02-11";
    const ranges = ["02-12:02-15", "03-02:03-20"];
    const year = "2015";
    const yRange: YearRangeData = {
      ranges,
      year,
    };
    const expected = ["02-11:02-15", "03-02:03-20"];
    const result = mergeDateOnYearRangeDataV2(yRange, input);
    expect(result["ranges"]).toEqual(expected);
  });

  test("extend range if givenDate is right before a range ends", () => {
    const input = "2015-03-01";
    const ranges = ["02-12:02-15", "03-02:03-20"];
    const year = "2015";
    const yRange: YearRangeData = {
      ranges,
      year,
    };
    const expected = ["02-12:02-15", "03-01:03-20"];
    const result = mergeDateOnYearRangeDataV2(yRange, input);
    expect(result["ranges"]).toEqual(expected);
  });

  test("Merge two ranges if givenDate is in between", () => {
    const dateRanges: YearRangeData = {
      year: "2023",
      ranges: ["12-01:12-03", "12-05:12-08"],
    };
    const givenDate = "2023-12-04";
    const expected = ["12-01:12-08"];
    const result = mergeDateOnYearRangeDataV2(dateRanges, givenDate);
    expect(result["ranges"]).toEqual(expected);
  });

  test("Merge two ranges givenDate create and overlap", () => {
    const dateRanges: YearRangeData = {
      year: "2023",
      ranges: ["12-01:12-04", "12-05:12-08"],
    };
    const givenDate = "2023-12-04";
    const expected = ["12-01:12-08"];
    const result = mergeDateOnYearRangeDataV2(dateRanges, givenDate);
    expect(result["ranges"]).toEqual(expected);
  });

  test("just insert the givenDate when ranges is 0", () => {
    const dateRanges: YearRangeData = {
      year: "2023",
      ranges: [],
    };
    const givenDate = "2023-12-04";
    const expected = ["12-04:12-04"];
    const result = mergeDateOnYearRangeDataV2(dateRanges, givenDate);
    expect(result["ranges"]).toEqual(expected);
  });

  test("insert date at end if is the most new", () => {
    const dateRanges: YearRangeData = {
      ranges: ["11-30:12-04"],
      year: "2023",
    };
    const givenDate = "2023-12-08";
    const expected = ["11-30:12-04", "12-08:12-08"];
    const result = mergeDateOnYearRangeDataV2(dateRanges, givenDate);
    expect(result["ranges"]).toEqual(expected);
  });
});

describe("mergeDateOnYearRangeData", () => {
  test("Merges two overlapping intervals when givenDate fills the gap", () => {
    const dateRanges: YearRangeData = {
      year: "2023",
      ranges: ["12-01:12-04", "12-06:12-08"],
    };
    const givenDate = "2023-12-05";
    const expected = ["12-01:12-08"];
    const result = mergeDateOnYearRangeData(dateRanges, givenDate);
    expect(result).toEqual({
      year: "2023",
      ranges: expected,
    });
  });

  test("Merges adjacent ranges when given date extends both ranges", () => {
    const dateRanges: YearRangeData = {
      year: "2023",
      ranges: ["12-01:12-04", "12-05:12-08"],
    };
    const givenDate = "2023-12-05";
    const expected = ["12-01:12-08"];
    const result = mergeDateOnYearRangeData(dateRanges, givenDate);
    expect(result).toEqual({
      year: "2023",
      ranges: expected,
    });
  });

  test("Merges adjacent ranges when given date extends the first range", () => {
    const dateRanges: YearRangeData = {
      year: "2023",
      ranges: ["12-01:12-04", "12-05:12-08"],
    };
    const givenDate = "2023-12-04";
    const expected = ["12-01:12-08"];
    const result = mergeDateOnYearRangeData(dateRanges, givenDate);
    expect(result).toEqual({
      year: "2023",
      ranges: expected,
    });
  });

  test("Extends range if date is right after an existing range", () => {
    const dateRanges: YearRangeData = {
      year: "2023",
      ranges: ["12-01:12-04"],
    };
    const givenDate = "2023-12-05";
    const expected = ["12-01:12-05"];
    const result = mergeDateOnYearRangeData(dateRanges, givenDate);
    expect(result).toEqual({
      year: "2023",
      ranges: expected,
    });
  });

  test("Extends range if date is right before an existing range", () => {
    const dateRanges: YearRangeData = {
      year: "2023",
      ranges: ["12-06:12-08"],
    };
    const givenDate = "2023-12-05";
    const expected = ["12-05:12-08"];
    const result = mergeDateOnYearRangeData(dateRanges, givenDate);
    expect(result).toEqual({
      year: "2023",
      ranges: expected,
    });
  });

  test("Adds a new range if date is new", () => {
    const dateRanges: YearRangeData = {
      year: "2023",
      ranges: ["12-01:12-04", "12-06:12-08"],
    };
    const givenDate = "2023-12-15";
    const expected = ["12-01:12-04", "12-06:12-08", "12-15:12-15"];
    const result = mergeDateOnYearRangeData(dateRanges, givenDate);
    expect(result).toEqual({
      year: "2023",
      ranges: expected,
    });
  });
});

describe("removeDateFromYearRangeData", () => {
  test("Remove date from single-day range containing the given date", () => {
    const ranges = ["12-01:12-01", "12-03:12-06", "12-08:12-10"];
    const dateRanges: YearRangeData = {
      year: "2015",
      ranges,
    };
    const givenDate = "2015-12-01";
    const expected = ["12-03:12-06", "12-08:12-10"];
    const result = removeDateFromYearRangeData(dateRanges, givenDate);
    expect(result).toEqual({
      year: "2015",
      ranges: expected,
    });
  });

  test("Adjust end date of a range to one day less than the given date", () => {
    const ranges = ["12-01:12-05", "12-07:12-10"];
    const dateRanges: YearRangeData = {
      year: "2015",
      ranges,
    };
    const givenDate = "2015-12-10";
    const expected = ["12-01:12-05", "12-07:12-09"];
    const result = removeDateFromYearRangeData(dateRanges, givenDate);
    expect(result).toEqual({
      year: "2015",
      ranges: expected,
    });
  });

  test("Adjust start date of a range to one day greater than the given date", () => {
    const ranges = ["12-01:12-05", "12-07:12-10"];
    const dateRanges: YearRangeData = {
      year: "2015",
      ranges,
    };
    const givenDate = "2015-12-07";
    const expected = ["12-01:12-05", "12-08:12-10"];
    const result = removeDateFromYearRangeData(dateRanges, givenDate);
    expect(result).toEqual({
      year: "2015",
      ranges: expected,
    });
  });

  test("Split range into two ranges omitting the day of the given date", () => {
    const ranges = ["12-01:12-10", "12-13:12-16"];
    const dateRanges: YearRangeData = {
      year: "2015",
      ranges,
    };
    const givenDate = "2015-12-15";
    const expected = ["12-01:12-10", "12-13:12-14", "12-16:12-16"];
    const result = removeDateFromYearRangeData(dateRanges, givenDate);
    expect(result).toEqual({
      year: "2015",
      ranges: expected,
    });
  });

  test("Given date not found in any range, should return unchanged ranges", () => {
    const ranges = ["12-01:12-10", "12-12:12-15"];
    const dateRanges: YearRangeData = {
      year: "2015",
      ranges,
    };
    const givenDate = "2023-12-11";
    const result = removeDateFromYearRangeData(dateRanges, givenDate);
    expect(result).toEqual({
      year: "2015",
      ranges,
    });
  });

  test("Empty ranges array, should return empty array", () => {
    const dateRanges: YearRangeData = {
      year: "2015",
      ranges: [],
    };
    const givenDate = "2023-12-01";
    const result = removeDateFromYearRangeData(dateRanges, givenDate);
    expect(result).toEqual({
      year: "2015",
      ranges: [],
    });
  });
});

describe("findExistingRangeForADate", () => {
  test("find a suitable range", () => {
    const expected = "2015-02-01:2015-02-05";
    const ranges = ["2015-01-08:2015-01-09", expected];
    const toFind = "2015-02-03";
    const result = findExistingRangeForADate(toFind, ranges);
    expect(result).toBe(1);
  });

  test("no ranges found", () => {
    const ranges = ["2015-01-08:2015-01-09", "2015-02-01:2015-02-05"];
    const toFind = "2015-05-03";
    const result = findExistingRangeForADate(toFind, ranges);
    expect(result).toBe(-1);
  });

  test("dateToFind and rangeStart", () => {
    const expected = "2015-02-01:2015-02-05";
    const ranges = ["2015-01-08:2015-01-09", expected];
    const toFind = "2015-02-01";
    const result = findExistingRangeForADate(toFind, ranges);
    expect(result).toBe(1);
  });

  test("dateToFind and rangeEnd", () => {
    const expected = "2015-02-01:2015-02-05";
    const ranges = ["2015-01-08:2015-01-09", expected];
    const toFind = "2015-02-05";
    const result = findExistingRangeForADate(toFind, ranges);
    expect(result).toBe(1);
  });
});

describe("filterAndClampYearRangesByDateLimits", () => {
  test("should filter correctly for a single year", () => {
    const input: YearRangeData[] = [
      {
        year: "2015",
        ranges: ["11-03:11-04", "12-09:12-09"],
      },
    ];
    const result = filterAndClampYearRangesByDateLimits(
      input,
      "2015-11-01:2015-12-01"
    );
    expect(result).toEqual(["2015-11-03:2015-11-04"]);
  });

  test("one year ranges for multi-year limit", () => {
    const input: YearRangeData[] = [
      {
        year: "2015",
        ranges: ["03-05:03-20", "11-03:11-04", "12-09:12-09"],
      },
    ];
    const result = filterAndClampYearRangesByDateLimits(
      input,
      "2014-11-01:2015-12-01"
    );
    expect(result).toEqual(["2015-03-05:2015-03-20", "2015-11-03:2015-11-04"]);
  });

  test("multi year ranges for single year limit", () => {
    const input: YearRangeData[] = [
      {
        year: "2014",
        ranges: ["01-05:01-22", "10-03:10-11", "12-09:12-19"],
      },
      {
        year: "2015",
        ranges: ["03-05:03-20", "11-03:11-04", "12-09:12-11", "12-22:12-24"],
      },
    ];
    const result = filterAndClampYearRangesByDateLimits(
      input,
      "2014-10-01:2015-12-10"
    );
    expect(result).toEqual([
      "2014-10-03:2014-10-11",
      "2014-12-09:2014-12-19",
      "2015-03-05:2015-03-20",
      "2015-11-03:2015-11-04",
      // range end is clamped
      "2015-12-09:2015-12-10",
    ]);
  });
});
