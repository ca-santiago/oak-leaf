import { API_CONFIG } from "@/services/api";
import { Habit_Incidences } from "../types";

export const getHabits = async (token: string) => {
  return fetch(`${API_CONFIG.habitsUrl}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
    next: {
      revalidate: 1,
    },
  }).then((data) => data.json());
};

export const getHabitsV2 = async (
  token: string,
  yearRange: string
): Promise<Habit_Incidences[]> => {
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
