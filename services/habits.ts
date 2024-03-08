import { API_CONFIG } from "./api";
import { Habit } from "../core/types";

export const getHabits = async (token: string): Promise<Habit[]> => {
  return fetch(`${API_CONFIG.habitsUrl}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then(async (res) => {
    if (res.status === 200) {
      return (await res.json()).data;
    }
    if (res.status === 401) {
      return [];
    }
  });
};

const getHabit = async (token: string, habitId: string) => {
  return fetch(`${API_CONFIG.habitsUrl}/${habitId}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then(async (res) => {
    if (res.status === 200) {
      return (await res.json()).data;
    }
    if (res.status === 401) {
      return [];
    }
  });
};

interface CreateHabitArgs {
  token: string;
  name: string;
  description: string;
  colorKey: string;
  iconKey: string;
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
      colorKey: args.colorKey,
      iconKey: args.iconKey,
      description: args.description || undefined,
    }),
  })
    .then((data) => {
      if (data.status === 200) {
        return data.json();
      } else {
        throw new Error(data.status.toString());
      }
    })
    .then(({ data }) => data);
};

interface DeleteHabitArgs {
  token: string;
  habitId: string;
}

export const deleteHabit = async (args: DeleteHabitArgs) => {
  return fetch(`${API_CONFIG.habitsUrl}/${args.habitId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + args.token,
    },
  })
    .then((data) => {
      if (data.status === 200) {
        return data.json();
      } else {
        throw new Error(data.status.toString());
      }
    })
    .then(({ data }) => data);
};

interface UpdateHabitArgs {
  token: string;
  habitId: string;
  completions?: string;
  name?: string;
  description?: string;
  colorKey?: string;
  iconKey?: string;
}

export const updateHabit = async (args: UpdateHabitArgs) => {
  return fetch(`${API_CONFIG.habitsUrl}/${args.habitId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + args.token,
    },
    body: JSON.stringify({
      habitName: args.name || undefined,
      colorKey: args.colorKey || undefined,
      iconKey: args.iconKey || undefined,
      description: args.description || undefined,
      completions: args.completions || undefined,
    }),
  })
    .then((data) => {
      if (data.status === 200) {
        return data.json();
      } else {
        throw new Error(data.status.toString());
      }
    })
    .then(({ data }) => data);
};

export const HabitService = {
  save: updateHabit,
  update: updateHabit,
  create: createHabit,
  delete: deleteHabit,
  getById: getHabit,
};
