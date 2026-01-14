"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema, type LoginState } from "../schemas/loginSchema";

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

  // For now: only success message (later we will create session/cookie)
  return { ok: true, message: "Login successful" };
}
