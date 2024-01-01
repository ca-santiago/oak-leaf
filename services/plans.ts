import { API_CONFIG } from "./api";
import { AccountInvite } from "../core/types";

type Return = null | AccountInvite;

export const getInviteData = async (id: string): Promise<Return> => {
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
