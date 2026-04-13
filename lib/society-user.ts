import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function requireSocietyUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Unauthorized");
  }

  const displayName =
    `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
    clerkUser.username ||
    clerkUser.primaryEmailAddress?.emailAddress ||
    "Member";

  const image = clerkUser.imageUrl ?? null;

  return prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      name: displayName,
      image,
    },
    create: {
      clerkId: clerkUser.id,
      name: displayName,
      image,
    },
  });
}
