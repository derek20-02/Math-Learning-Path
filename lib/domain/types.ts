export type UserRole = 'student' | 'teacher';

export interface UserDomain {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image?: string;
}