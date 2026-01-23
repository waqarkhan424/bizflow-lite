import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-current-user";

export async function getCurrentBusiness() {
  const user = await getCurrentUser();
  if (!user) return null;

  return prisma.business.findUnique({
    where: { userId: user.id },
  });
}
