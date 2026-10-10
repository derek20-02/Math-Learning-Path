import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { dbConnect } from '../../db/connect';
import { UserModel } from '../../db/schema/user';
import bcrypt from 'bcryptjs';

const providers: NextAuthOptions['providers'] = [
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) return null;

            try {
                await dbConnect();

                const user = await UserModel.findOne({ email: credentials.email.toLowerCase() });
                if (!user || !user.password) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) return null;

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            } catch (error) {
                console.error('Error durante la autenticación:', error);
                return null;
            }
        },
    }),
];

// Solo agregamos Google Provider si las variables realmente están configuradas en .env.local
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    );
}

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role || 'student';
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login', // Apunta a la ruta real de tu formulario de login
    },
    session: { strategy: 'jwt' },
};