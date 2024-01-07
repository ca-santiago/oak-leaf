import { YearRangeData } from "@/core/types";
import {
  deserializeCompletionsRecord,
  joinDateRangeArr,
  yearRangeDataToYearRanges,
  serializeDateRangeData,
  yearRangesToCompletionsRecord,
  mergeDateOnYearRangeData,
  removeDateFromYearRangeData,
} from "../incidences";

describe("Incidences serialization", () => {
  test("deserializeCompletionsRecord", () => {
    const ranges = "2023=02-13:04-25,04-27:08-05|2024=01-01:01-01,01-03:01-05";
    const result = deserializeCompletionsRecord(ranges);
    console.log(result);
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
