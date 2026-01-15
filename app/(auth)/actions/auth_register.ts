"use server";


import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema, type RegisterState} from "../schemas/register-schema";



export async function auth_register(prevState: RegisterState,formData: FormData): Promise<RegisterState> {


  const raw = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid data",
    };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, message: "Email already exists" };
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name: name || null,
      email,
      password: hashed,
    },
  });

  return { ok: true, message: "Account created successfully" };
}
