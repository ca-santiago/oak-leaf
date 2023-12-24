import { Account } from "@/core/types";
import { API_CONFIG } from "./api";

export const getAccountInfo = (token: string): Promise<Account> => {
  return fetch(`${API_CONFIG.accountsUrl}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error(res.statusText);
      }
    })
    .then(({ data }) => data)
    .catch((err) => console.log(err));
};
