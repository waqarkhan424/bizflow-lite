import { requireUser } from "@/lib/require-user";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import BusinessForm from "./components/business-form";

export default async function BusinessSetupPage() {
  const user = await requireUser();

  const business = await prisma.business.findUnique({
    where: { userId: user.id },
  });

  if (business) redirect("/dashboard");

  return <BusinessForm />;
}
