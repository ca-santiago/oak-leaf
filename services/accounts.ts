import { Account } from "@/core/types";
import { API_CONFIG } from "./api";

export const getAccountInfo = (token: string): Promise<Account> => {
  return fetch(`${API_CONFIG.accountsUrl}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then(({ data }) => data)
    .catch((err) => console.log(err));
};
