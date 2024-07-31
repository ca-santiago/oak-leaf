'use server';

import prisma from "@/prisma/db";
import { AccountInvite } from "../core/types";
import { v4 } from 'uuid';

// export const getInviteById = async (id: string): Promise<Return> => {
//   return fetch(`${API_CONFIG.invitesUrl}/${id}`, {
//     method: "GET",
//   }).then(async (res) => {
//     if (res.status === 200) {
//       return (await res.json()).data;
//     }
//     if (res.status === 404) {
//       return null;
//     }
//   });
// };

// export const getUserInviteCode = async (token: string): Promise<Return> => {
//   return fetch(`${API_CONFIG.invitesUrl}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + token,
//     },
//   }).then(async (res) => {
//     if (res.status === 200) {
//       return (await res.json()).data;
//     }
//     if (res.status === 404) {
//       return null;
//     }
//   });
// };

export const getUserInviteCode = async (userId: string): Promise<AccountInvite | null> => {
  const userInvites = await prisma.accountInvite.findMany({
    where: {
      accountId: userId,
      usedByUserId: null,
    }
  });

  if (userInvites.length === 0) {
    // Create one and use it, first time this user is loading its invites
    // TODO: Maybe should be handled on account creation
    const newInvite = await prisma.accountInvite.create({
      data: {
        accountId: userId,
        inviteCode: v4(),
      }
    });
    return newInvite;
  }

  const unusedInvite = userInvites.find(invite => invite.usedByUserId === null);
  
  return unusedInvite || null;
}

export const getInviteById = async (id: string): Promise<AccountInvite | null> => {
  const invite = await prisma.accountInvite.findUnique({
    where: {
      id,
    },
  });

  return invite || null;
}

