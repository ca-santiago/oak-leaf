'use server';

import { API_CONFIG } from "./api";
import { FlaggedResult, Habit } from "../core/types";
import prisma from "@/prisma/db";
import { revalidatePath } from "next/cache";

// export const getHabits = async (token: string): Promise<Habit[]> => {
//   return fetch(`${API_CONFIG.habitsUrl}`, {
//     method: "GET",
//     headers: {
//       Authorization: "Bearer " + token,
//     },
//   }).then(async (res) => {
//     if (res.status === 200) {
//       return (await res.json()).data;
//     }
//     if (res.status === 401) {
//       return [];
//     }
//   });
// };

// const getHabit = async (token: string, habitId: string) => {
//   return fetch(`${API_CONFIG.habitsUrl}/${habitId}`, {
//     method: "GET",
//     headers: {
//       Authorization: "Bearer " + token,
//     },
//   }).then(async (res) => {
//     if (res.status === 200) {
//       return (await res.json()).data;
//     }
//     const meta = {
//       operation: 'getHabits',
//       args: {
//         habitId,
//       },
//     };
//     console.log({ meta, response: res });

//     return [];
//   });
// };

// interface CreateHabitArgs {
//   token: string;
//   name: string;
//   description: string | null;
//   colorKey: string;
//   iconKey: string;
// }

// export const createHabit = async (args: CreateHabitArgs) => {
//   return fetch(`${API_CONFIG.habitsUrl}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + args.token,
//     },
//     body: JSON.stringify({
//       habitName: args.name,
//       colorKey: args.colorKey,
//       iconKey: args.iconKey,
//       description: args.description || undefined,
//     }),
//   })
//     .then((data) => {
//       if (data.status === 200) {
//         return data.json();
//       } else {
//         throw new Error(data.status.toString());
//       }
//     })
//     .then(({ data }) => data);
// };

// interface DeleteHabitArgs {
//   token: string;
//   habitId: string;
// }

// export const deleteHabit = async (args: DeleteHabitArgs) => {
//   return fetch(`${API_CONFIG.habitsUrl}/${args.habitId}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + args.token,
//     },
//   })
//     .then((data) => {
//       if (data.status === 200) {
//         return data.json();
//       } else {
//         throw new Error(data.status.toString());
//       }
//     })
//     .then(({ data }) => data);
// };

// interface UpdateHabitArgs {
//   colorKey: string | null;
//   completions: string;
//   description: string | null;
//   habitId: string;
//   iconKey: string | null;
//   name: string | null;
//   token: string;
// }

// export const updateHabit = async (args: UpdateHabitArgs) => {
//   return fetch(`${API_CONFIG.habitsUrl}/${args.habitId}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + args.token,
//     },
//     body: JSON.stringify({
//       habitName: args.name || undefined,
//       colorKey: args.colorKey || undefined,
//       iconKey: args.iconKey || undefined,
//       description: args.description || undefined,
//       completions: args.completions || undefined,
//     }),
//   })
//     .then((data) => {
//       if (data.status === 200) {
//         return data.json();
//       } else {
//         throw new Error(data.status.toString());
//       }
//     })
//     .then(({ data }) => data);
// };

// export const HabitService = {
//   save: updateHabit,
//   update: updateHabit,
//   // create: createHabit,
//   delete: deleteHabit,
//   getById: getHabit,
// };

interface GetAllHabitsArgs {
  userId: string;
}

export const getAllHabits = async ({
  userId
}: GetAllHabitsArgs): Promise<Array<Habit>> => {
  try {
    const habits = await prisma.habit.findMany({
      where: {
        userId: userId,
      },
    });

    return habits;
  } catch (err) {
    console.error('getAllHabits', err, { userId });
    return [];
  }
}

interface CreateHabitArgs {
  colorKey: string;
  completions?: string;
  description?: string;
  iconKey: string;
  name: string;
  userId: string;
  daysOfWeekToRemind?: string;
  hourToRemind?: string;
}

export const createHabit = async (args: CreateHabitArgs): Promise<Habit> => {
  const {
    colorKey,
    completions = '',
    description,
    iconKey,
    name,
    daysOfWeekToRemind,
    hourToRemind,
    userId,
  } = args;

  const periodicity = daysOfWeekToRemind && hourToRemind ? `${ daysOfWeekToRemind }-${ hourToRemind }` : undefined;

  try {
    const instance = await prisma.habit.create({
      data: {
        userId,
        colorKey,
        iconKey,
        habitName: name,
        description,
        completions,
        daysOfWeek: daysOfWeekToRemind,
        hourOfDay: hourToRemind,
        periodicity: periodicity,
      }
    });
    return instance;
  } catch (err) {
    console.error('createHabit', err);
    throw err;
  }
}

interface UpdateHabitArgs {
  habitId: string;
  userId: string;
  // Values to update
  colorKey?: string;
  completions: string;
  description?: string;
  iconKey?: string;
  name?: string;
  daysOfWeekToRemind?: string;
  hourToRemind?: string;
}

export const updateHabit = async (args: UpdateHabitArgs): Promise<FlaggedResult<Habit>> => {
  const {
    colorKey,
    completions,
    description,
    habitId,
    iconKey,
    name,
    daysOfWeekToRemind,
    hourToRemind,
    userId,
  } = args;

  const periodicity = daysOfWeekToRemind && hourToRemind ? `${ daysOfWeekToRemind }-${ hourToRemind }` : undefined;

  try {
    const updated = await prisma.habit.update({
      data: {
        colorKey,
        iconKey,
        completions,
        description,
        habitName: name,
        daysOfWeek: daysOfWeekToRemind,
        hourOfDay: hourToRemind,
        periodicity,
      },
      where: {
        id: habitId,
        userId,
      }
    });
    revalidatePath('/');
    return {
      success: true,
      data: updated as Habit,
    };
  } catch (err) {
    console.error('updateHabit', err);

    return {
      success: false,
      data: null,
    };
  }
}

interface DeleteHabitArgs {
  userId: string;
  habitId: string;
};

export const deleteHabit = async ({
  habitId,
  userId,
}: DeleteHabitArgs) => {
  try {
    await prisma.habit.delete({
      where: {
        id: habitId,
        userId,
      },
    });
    return {
      deleted: true,
    }
  } catch (err) {
    console.error('deleteHabit', err)
    return {
      deleted: false,
    };
  }
}

export const getHabitById = async (userId: string, habitId: string): Promise<Habit | null> => {
  const habit = prisma.habit.findUnique({
    where: {
      userId: userId,
      id: habitId,
    },
  });
  
  return habit || null;
}

// const HabitsService = {
//   getAll: getAllHabits,
//   create: createHabit,
//   save: updateHabit,
//   delete: deleteHabit,
// }

// export default HabitsService;
