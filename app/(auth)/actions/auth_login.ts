"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema, type LoginState } from "../schemas/loginSchema";


import { cookies } from "next/headers";
import crypto from "crypto";
import { SESSION_COOKIE_NAME, SESSION_DAYS } from "@/lib/auth";

export async function auth_login(prevState: LoginState,formData: FormData): Promise<LoginState> {
    
  const raw = {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid data",
    };
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { ok: false, message: "Invalid email or password" };
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return { ok: false, message: "Invalid email or password" };
  }

  // create a session token
  const token = crypto.randomBytes(32).toString("hex");

  //  expires in 7 days
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);


  //  store in database
  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });


  //  store in HttpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });



  return { ok: true, message: "Login successful" };
}
