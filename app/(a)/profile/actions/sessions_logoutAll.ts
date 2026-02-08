"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function sessions_logoutAll() {
    
  const user = await requireUser();

  // delete ALL sessions for this user (all devices)
  await prisma.session.deleteMany({ where: { userId: user.id } });

  // clear current cookie
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  // go to login
  redirect("/login");
}
