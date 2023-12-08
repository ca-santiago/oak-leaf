import {
  mergeNewDateRanges,
  removeDateFromRanges,
} from "../dateRange";

describe("mergeNewDateRanges", () => {
  test("Merges two overlapping intervals when givenDate fills the gap", () => {
    const dateRanges = ["2023-12-01:2023-12-04", "2023-12-06:2023-12-08"];
    const givenDate = "2023-12-05";
    const expected = ["2023-12-01:2023-12-08"];
    const result = mergeNewDateRanges(dateRanges, givenDate);
    expect(result).toEqual(expected);
  });

  test("Merges adjacent ranges when given date extends both ranges", () => {
    const dateRanges = ["2023-12-01:2023-12-04", "2023-12-05:2023-12-08"];
    const givenDate = "2023-12-05";
    const expected = ["2023-12-01:2023-12-08"];
    const result = mergeNewDateRanges(dateRanges, givenDate);
    expect(result).toEqual(expected);
  });

  test("Merges adjacent ranges when given date extends the first range", () => {
    const dateRanges = ["2023-12-01:2023-12-04", "2023-12-05:2023-12-08"];
    const givenDate = "2023-12-04";
    const expected = ["2023-12-01:2023-12-08"];
    const result = mergeNewDateRanges(dateRanges, givenDate);
    expect(result).toEqual(expected);
  });

  test("Extends range if date is right after an existing range", () => {
    const dateRanges = ["2023-12-01:2023-12-04"];
    const givenDate = "2023-12-05";
    const expected = ["2023-12-01:2023-12-05"];
    const result = mergeNewDateRanges(dateRanges, givenDate);
    expect(result).toEqual(expected);
  });

  test("Extends range if date is right before an existing range", () => {
    const dateRanges = ["2023-12-06:2023-12-08"];
    const givenDate = "2023-12-05";
    const expected = ["2023-12-05:2023-12-08"];
    const result = mergeNewDateRanges(dateRanges, givenDate);
    expect(result).toEqual(expected);
  });

  test("Adds a new range if date is new", () => {
    const dateRanges = ["2023-12-01:2023-12-04", "2023-12-06:2023-12-08"];
    const givenDate = "2023-12-15";
    const expected = [
      "2023-12-01:2023-12-04",
      "2023-12-06:2023-12-08",
      "2023-12-15:2023-12-15",
    ];
    const result = mergeNewDateRanges(dateRanges, givenDate);
    expect(result).toEqual(expected);
  });
});

import { performance } from "perf_hooks";

describe("mergeNewDateRanges - Performance Testing", () => {
  test.concurrent(
    "Performance test for merging large number of ranges",
    async () => {
      const numberOfRanges = 182; // Adjust this number to test performance with different range sizes
      const dateRanges = [];

      let currentDate = new Date("2023-01-01");
      const minGap = 1;
      const maxGap = 3;

      for (let i = 0; i < numberOfRanges; i++) {
        const startDate = new Date(currentDate);
        const gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
        startDate.setDate(startDate.getDate() + gap * i);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 3); // Each range is 4 days long
        dateRanges.push(
          `${startDate.toISOString().split("T")[0]}:${
            endDate.toISOString().split("T")[0]
          }`
        );
        currentDate = endDate;
      }

      const givenDate = "2023-06-01"; // A date to check and possibly extend a range

      const startTime = performance.now();
      const result = mergeNewDateRanges(dateRanges, givenDate);
      const endTime = performance.now();

      const executionTime = endTime - startTime;
      console.log(
        `Execution time for ${numberOfRanges} ranges: ${executionTime} milliseconds`
      );

      // To automatically pass the test, adjust the threshold as needed
      const threshold = 1; // Adjust the threshold for acceptable performance time
      expect(executionTime).toBeLessThan(threshold);
    }
  );
});

describe("removeGivenDateFromRanges - Unit Tests", () => {
  test("Remove date from single-day range containing the given date", () => {
    const dateRanges = [
      "2023-12-01:2023-12-01",
      "2023-12-03:2023-12-06",
      "2023-12-08:2023-12-10",
    ];
    const givenDate = "2023-12-01";
    const expected = ["2023-12-03:2023-12-06", "2023-12-08:2023-12-10"];
    const result = removeDateFromRanges(dateRanges, givenDate);
    expect(result).toEqual(expected);
  });

  test("Adjust end date of a range to one day less than the given date", () => {
    const dateRanges = ["2023-12-01:2023-12-05", "2023-12-07:2023-12-10"];
    const givenDate = "2023-12-10";
    const expected = ["2023-12-01:2023-12-05", "2023-12-07:2023-12-09"];
    const result = removeDateFromRanges(dateRanges, givenDate);
    expect(result).toEqual(expected);
  });

  test("Adjust start date of a range to one day greater than the given date", () => {
    const dateRanges = ["2023-12-01:2023-12-05", "2023-12-07:2023-12-10"];
    const givenDate = "2023-12-07";
    const expected = ["2023-12-01:2023-12-05", "2023-12-08:2023-12-10"];
    const result = removeDateFromRanges(dateRanges, givenDate);
    expect(result).toEqual(expected);
  });

  test("Split range into two ranges omitting the day of the given date", () => {
    const dateRanges = ["2023-12-01:2023-12-10", "2023-12-13:2023-12-16"];
    const givenDate = "2023-12-15";
    const expected = [
      "2023-12-01:2023-12-10",
      "2023-12-13:2023-12-14",
      "2023-12-16:2023-12-16",
    ];
    const result = removeDateFromRanges(dateRanges, givenDate);
    expect(result).toEqual(expected);
  });

  test("Given date not found in any range, should return unchanged ranges", () => {
    const dateRanges = ["2023-12-01:2023-12-10", "2023-12-12:2023-12-15"];
    const givenDate = "2023-12-11";
    const result = removeDateFromRanges(dateRanges, givenDate);
    expect(result).toEqual(dateRanges);
  });

  test("Empty ranges array, should return empty array", () => {
    const dateRanges: string[] = [];
    const givenDate = "2023-12-01";
    const result = removeDateFromRanges(dateRanges, givenDate);
    expect(result).toEqual([]);
  });
});

describe("removeGivenDateFromRanges - Performance Testing", () => {
  test.concurrent(
    "Performance test for removing date from large number of ranges",
    async () => {
      const numberOfRanges = 182; // Adjust this number to test performance with different range sizes
      const dateRanges = [];

      // Creating a large array of date ranges
      for (let i = 0; i < numberOfRanges; i++) {
        const startDate = new Date(`2023-01-01`);
        startDate.setDate(startDate.getDate() + i);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 3); // Each range is 4 days long
        dateRanges.push(
          `${startDate.toISOString().split("T")[0]}:${
            endDate.toISOString().split("T")[0]
          }`
        );
      }

      const givenDate = "2023-06-01"; // A date to remove from the ranges

      const startTime = performance.now();
      removeDateFromRanges(dateRanges, givenDate);
      const endTime = performance.now();

      const executionTime = endTime - startTime;
      console.log(
        `Execution time for removing date from ${numberOfRanges} ranges: ${executionTime} milliseconds`
      );

      // To automatically pass the test, adjust the threshold as needed
      const threshold = 1; // Adjust the threshold for acceptable performance time
      expect(executionTime).toBeLessThan(threshold);
    }
  );
});
