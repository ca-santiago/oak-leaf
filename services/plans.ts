import { API_CONFIG } from "./api";
import { AccountInvite } from "../core/types";

type Return = null | AccountInvite;

export const getInviteById = async (id: string): Promise<Return> => {
  return fetch(`${API_CONFIG.invitesUrl}/${id}`, {
    method: "GET",
  }).then(async (res) => {
    if (res.status === 200) {
      return (await res.json()).data;
    }
    if (res.status === 404) {
      return null;
    }
  });
};

export const getUserInviteCode = async (token: string): Promise<Return> => {
  return fetch(`${API_CONFIG.invitesUrl}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  }).then(async (res) => {
    if (res.status === 200) {
      return (await res.json()).data;
    }
    if (res.status === 404) {
      return null;
    }
  });
};
