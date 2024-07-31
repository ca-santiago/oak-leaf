const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const API_CONFIG = {
  baseURL,
  // habitsUrl: `${baseURL}/habits`,
  // accountsUrl: `${baseURL}/accounts`,
  // invitesUrl: `${baseURL}/invites`,
  tasksUrl: `${baseURL}/tasks`,

  // Deprecated way to control habit strikes
  // completionsUrl: `${baseURL}/completions`,
  // incidencesUrl: `${baseURL}/incidences`,
};
