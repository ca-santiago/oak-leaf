import { API_CONFIG } from "@/services/api";

export const setCompletion = async (
  token: string,
  status: boolean,
  completionId: string
) => {
  return fetch(`${API_CONFIG.completionsUrl}`, {
    method: "PATCH",
    body: JSON.stringify({
      completionId,
      status,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((data) => data.json())
    .catch((err) => console.log(err.messsage));
};

export const createCompletion = async (
  token: string,
  habitId: string,
  date: string
) => {
  return fetch(`${API_CONFIG.completionsUrl}`, {
    method: "POST",
    body: JSON.stringify({
      habitId,
      date,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((data) => data.json())
    .catch((err) => console.log(err));
};
