import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';

export async function getCurrentUser() {
    const session = await getServerSession(authOptions);
    return session?.user;
}

export async function requireRole(allowedRoles: Array<'student' | 'teacher'>) {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('Unauthorized');
    }

    const userRole = (user as any).role;
    if (!allowedRoles.includes(userRole)) {
        throw new Error('Forbidden: Access denied');
    }

    return user;
}