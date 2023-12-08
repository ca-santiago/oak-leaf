import { API_CONFIG } from "@/services/api";

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
