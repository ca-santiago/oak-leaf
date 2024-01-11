import { Activity } from "react-activity-calendar";

export function mapDateRangeToActivityArray(
  startDate: string,
  endDate: string
): Activity[] {
  const datesArray: Activity[] = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    datesArray.push({
      count: 1,
      date: currentDate.toISOString().split("T")[0],
      level: 3,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return datesArray;
}