import { ClanRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const roleRank: Record<ClanRole, number> = {
  MEMBER: 1,
  ELDER: 2,
  CHIEF: 3,
  FOUNDER: 4,
};

export async function getClanMembership(userId: string, clanId: string) {
  return prisma.clanMembership.findUnique({
    where: { userId_clanId: { userId, clanId } },
  });
}

export async function requireClanRole(userId: string, clanId: string, minimumRole: ClanRole) {
  const membership = await getClanMembership(userId, clanId);
  if (!membership || membership.status !== "ACTIVE") {
    throw new Error("Forbidden");
  }

  if (roleRank[membership.role] < roleRank[minimumRole]) {
    throw new Error("Forbidden");
  }

  return membership;
}
