import { getServerSession, type DefaultSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import type { UserRole } from "@/db/schema/user";

export type AuthenticatedUser = {
  id: string;
  role: UserRole;
  name?: string | null;
  email?: string | null;
};

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  // NextAuth decrypts the session cookie and exposes the user ID and role here.
  const session = await getServerSession(authOptions);
  const user = session?.user as
    | (DefaultSession["user"] & { id?: unknown; role?: unknown })
    | undefined;

  if (
    !user ||
    typeof user.id !== "string" ||
    (user.role !== "student" && user.role !== "teacher")
  ) {
    return null;
  }

  return {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  };
}

export async function requireRole(
  role: UserRole,
): Promise<{ user: AuthenticatedUser } | { response: Response }> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      response: Response.json(
        { message: "Authentication required" },
        { status: 401 },
      ),
    };
  }

  if (user.role !== role) {
    return {
      response: Response.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return { user };
}