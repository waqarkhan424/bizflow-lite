import { getCurrentUser } from "@/lib/get-current-user";
import LoginForm from "../components/login-form";
import { redirect } from "next/navigation";


export default async function LoginPage({searchParams}: {searchParams: Promise<{ registered?: string }>}) {


  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  const { registered } = await searchParams;


  return <LoginForm  registered={registered === "1"} />;
}
