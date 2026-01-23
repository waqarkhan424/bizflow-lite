import { redirect } from "next/navigation";
import { requireUser } from "@/lib/require-user";
import { prisma } from "@/lib/prisma";

export async function requireBusiness() {
  const user = await requireUser();

  const business = await prisma.business.findUnique({
    where: { userId: user.id },
  });

  if (!business) {
    redirect("/onboarding/business");
  }

  return { user, business };
}
