import { API_CONFIG } from "./api";
import { Habit } from "../core/types";

export const getHabits = async (
  token: string,
  yearRange: string
): Promise<Habit[]> => {
  return fetch(`${API_CONFIG.habitsUrl}/${yearRange}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
    next: {
      revalidate: 1,
    },
  })
    .then((data) => data.json())
    .then(({ data }) => data);
};
