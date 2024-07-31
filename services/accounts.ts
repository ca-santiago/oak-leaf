'use server';

import { Account } from "@/core/types";
// import { API_CONFIG } from "./api";
import prisma from "@/prisma/db";
import { redirect } from "next/navigation";

// export const getAccountInfo = (token: string): Promise<Account> => {
//   return fetch(`${API_CONFIG.accountsUrl}`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((res) => {
//       if (res.status === 200) {
//         return res.json();
//       } else {
//         throw new Error(res.statusText);
//       }
//     })
//     .then(({ data }) => data)
//     .catch((err) => console.log(err));
// };

interface GetAccountDataArgs {
  userId: string;
}

export const getAccountData = async ({
  userId,
}: GetAccountDataArgs): Promise<Account> => {
  const data = await prisma.account.findUnique({
    where: {
      externalId: userId,
    },
  });

  if (!data) {
    console.log('getAccountData', { message: `Missing account data for ${userId}` });
    return redirect('/ops/account');
  }

  return data;
}
