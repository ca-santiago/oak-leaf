const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:3003";

export const API_CONFIG = {
  baseURL,
  habitsUrl: `${baseURL}/habits`,
  completionsUrl: `${baseURL}/completions`,
  incidencesUrl: `${baseURL}/incidences`,
};
