import { getCurrentUser } from "@/lib/get-current-user";
import { redirect } from "next/navigation";
import ForgotPasswordForm from "../components/forgot-password-form";

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return <ForgotPasswordForm />;
}
