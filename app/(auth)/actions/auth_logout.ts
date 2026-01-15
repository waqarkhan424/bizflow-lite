"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function auth_logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  // delete session in DB (if exists)
  if (token) {
    await prisma.session.deleteMany({
      where: { token },
    });
  }

  // clear cookie
  cookieStore.delete(SESSION_COOKIE_NAME);

  // go to login
  redirect("/login");
}
