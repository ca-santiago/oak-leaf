import { prisma } from "@/lib/prisma";

export const getProfileData = async (userId: string) => {
  const res = await prisma.profile.findFirst({
    where: {
      userId,
    },
  });
  return res;
};
