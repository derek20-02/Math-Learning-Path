import { getCurrentUser } from "@/lib/auth/authorization";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  redirect(user.role === "student" ? "/student" : "/teacher");
}
