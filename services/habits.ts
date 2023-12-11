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
  })
    .then((data) => data.json())
    .then(({ data }) => data);
};

interface CreateHabitArgs {
  token: string;
  name: string;
  description: string;
}

export const createHabit = async (args: CreateHabitArgs) => {
  return fetch(`${API_CONFIG.habitsUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + args.token,
    },
    body: JSON.stringify({
      habitName: args.name,
      description: args.description || undefined,
    }),
  })
    .then((data) => data.json())
    .then(({ data }) => data);
};
