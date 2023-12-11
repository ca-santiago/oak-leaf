import { API_CONFIG } from "./api";

interface CreateIncidenceArgs {
  token: string;
  habitId: string;
  yearRange: string;
  dateRanges: string;
}

export const createIncidence = async ({
  token,
  dateRanges,
  habitId,
  yearRange,
}: CreateIncidenceArgs) => {
  return fetch(`${API_CONFIG.incidencesUrl}`, {
    method: "POST",
    body: JSON.stringify({
      habitId,
      yearRange,
      dateRanges,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  }).then((data) => data.json());
};

interface UpdateIndigenceArgs {
  token: string;
  incidenceId: string;
  dateRanges: string;
  yearRange: string;
}

export const updateIndigence = async ({
  token,
  incidenceId,
  dateRanges,
  yearRange,
}: UpdateIndigenceArgs) => {
  return fetch(`${API_CONFIG.incidencesUrl}/${incidenceId}`, {
    method: "PUT",
    body: JSON.stringify({
      yearRange,
      dateRanges,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  }).then((data) => data.json());
};
