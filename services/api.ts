const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const API_CONFIG = {
  baseURL,
  habitsUrl: `${baseURL}/habits`,
  completionsUrl: `${baseURL}/completions`,
  incidencesUrl: `${baseURL}/incidences`,
  accountsUrl: `${baseURL}/accounts`,
  invitesUrl: `${baseURL}/invites`,
};
