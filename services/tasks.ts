import { Task } from "@/core/types";
import { API_CONFIG } from "./api";

interface CreateTaskArgs {
  data: {
    title: string;
    habitId: string;
    description?: string;
    status?: string;
  };
  token: string;
}

const createNewTask = async (args: CreateTaskArgs) => {
  const { token, data } = args;
  return fetch(`${API_CONFIG.tasksUrl}`, {
    method: "POST",
    body: JSON.stringify(data),
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

const getByHabitId = async (token: string, habitId: string): Promise<Task[]> => {
  return fetch(`${API_CONFIG.tasksUrl}/habit/${habitId}`, {
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

const TaskService = {
  create: createNewTask,
  getByHabitId,
};

export default TaskService;
