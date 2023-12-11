const baseURL =
  process.env.ENV === "prod" ? process.env.API_URL : "http://localhost:3003";

export const API_CONFIG = {
  baseURL,
  habitsUrl: `${baseURL}/habits`,
  completionsUrl: `${baseURL}/completions`,
  incidencesUrl: `${baseURL}/incidences`,
};
