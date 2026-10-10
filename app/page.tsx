import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (role === "teacher") {
        return redirect('teacher');
    }

    if (role === "student") {
        return redirect('student');
    }
}

