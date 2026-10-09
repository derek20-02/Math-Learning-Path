import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Redirección si intenta entrar a rutas de profesor siendo estudiante
        if (path.startsWith('/teacher') && token?.role !== 'teacher') {
            return NextResponse.redirect(new URL('/student', req.url));
        }

        // Redirección si intenta entrar a rutas de estudiante siendo profesor
        if (path.startsWith('/student') && token?.role !== 'student') {
            return NextResponse.redirect(new URL('/teacher', req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: '/login',
        },
    }
);

// Configuración de rutas protegidas por middleware
export const config = {
    matcher: ['/teacher/:path*', '/student/:path*'],
};