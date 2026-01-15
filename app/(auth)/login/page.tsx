import { getCurrentUser } from "@/lib/get-current-user";
import LoginForm from "../components/login-form";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
