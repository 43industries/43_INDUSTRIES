import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function societyUnauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function loadSocietyUser(): Promise<User | null> {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null;
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

/** Use in Server Components / server actions; never call from Route Handlers. */
export async function requireSocietyUser(): Promise<User> {
  const user = await loadSocietyUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
