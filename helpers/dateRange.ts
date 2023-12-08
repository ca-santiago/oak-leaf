export function mergeNewDateRanges(
  dateRanges: string[],
  givenDate: string
): string[] {
  const given = new Date(givenDate);
  let merged = false;

  for (let i = 0; i < dateRanges.length; i++) {
    const [startDate, endDate] = dateRanges[i].split(":");
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (given >= start && given <= end) {
      // Date falls within an existing range, no action needed
      merged = true;
      break;
    } else if (given.getTime() === end.getTime() + 24 * 60 * 60 * 1000) {
      // Date is right after an existing range, extend the range
      dateRanges[i] = `${startDate}:${givenDate}`;
      merged = true;
      break;
    } else if (given.getTime() === start.getTime() - 24 * 60 * 60 * 1000) {
      // Date is right before an existing range, extend the range
      dateRanges[i] = `${givenDate}:${endDate}`;
      merged = true;
      break;
    }
  }

  if (!merged) {
    // Date is new, create a new range
    dateRanges.push(`${givenDate}:${givenDate}`);
  }

  // Merge overlapping intervals if any
  dateRanges.sort();
  const mergedRanges = [];
  let currentRange = dateRanges[0].split(":");

  for (let i = 1; i < dateRanges.length; i++) {
    const [startDate, endDate] = dateRanges[i].split(":");
    const currentEnd = new Date(currentRange[1]);
    const nextStart = new Date(startDate);

    if (
      nextStart <= currentEnd ||
      nextStart.getTime() === currentEnd.getTime() + 24 * 60 * 60 * 1000
    ) {
      currentRange[1] = endDate;
    } else {
      mergedRanges.push(currentRange.join(":"));
      currentRange = [startDate, endDate];
    }
  }

  mergedRanges.push(currentRange.join(":"));
  return mergedRanges;
}

export function removeDateFromRanges(
  dateRanges: string[],
  givenDate: string
): string[] {
  const output = Array.from(dateRanges);
  const dateToFind = new Date(givenDate);

  for (let i = 0; i < output.length; i++) {
    const [startDate, endDate] = output[i].split(":");
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Single day range equals to givenDate
    if (
      start.getTime() === end.getTime() &&
      dateToFind.getTime() === start.getTime()
    ) {
      output.splice(i, 1);
      i--;
      break;
    }

    if (start.getTime() === dateToFind.getTime()) {
      // Adjust range start
      const adjustedStartDate = new Date(dateToFind);
      adjustedStartDate.setDate(adjustedStartDate.getDate() + 1);
      output[i] = `${adjustedStartDate.toISOString().split("T")[0]}:${endDate}`;
      break;
    } else if (end.getTime() === dateToFind.getTime()) {
      // Adjust range end
      const adjustedEndDate = new Date(dateToFind);
      adjustedEndDate.setDate(adjustedEndDate.getDate() - 1);
      output[i] = `${startDate}:${adjustedEndDate.toISOString().split("T")[0]}`;
      break;
    }

    if (dateToFind > start && dateToFind < end) {
      const newEndDate = new Date(dateToFind);
      newEndDate.setDate(newEndDate.getDate() - 1);
      const newStartDate = new Date(dateToFind);
      newStartDate.setDate(newStartDate.getDate() + 1);
      output.splice(
        i,
        1,
        `${startDate}:${newEndDate.toISOString().split("T")[0]}`,
        `${newStartDate.toISOString().split("T")[0]}:${endDate}`
      );
      i++; // Move to the next range
    }
  }

  return output;
}

export function serializeArrayToString(arr: string[]): string {
  return arr.join(",");
}

export function deserializeStringToArray(str: string): string[] {
  return str.split(",");
}
