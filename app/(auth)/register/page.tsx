import { getCurrentUser } from "@/lib/get-current-user";
import RegisterForm from "../components/register-form";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return <RegisterForm />;
}
