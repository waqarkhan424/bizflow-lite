import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/get-current-user";
import Landing from "@/components/marketing/landing";

export default async function Home() {
  const user = await getCurrentUser();

  // If logged in, go inside the app.
  // Your app will handle onboarding if business is missing.
  if (user) redirect("/dashboard");

  return <Landing />;
}
