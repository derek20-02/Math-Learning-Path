'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isRegistered = searchParams.get('registered') === 'true';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError('Credenciales inválidas');
            } else {
                router.push('/');
                router.refresh();
            }
        } catch (err) {
            setError('Ocurrió un error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
            <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Iniciar Sesión</h1>
                <p className="mt-2 text-sm text-gray-600">Bienvenido de nuevo a Math Learning Path</p>
            </div>

            {isRegistered && (
                <div className="rounded bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                    ¡Registro exitoso! Por favor inicia sesión.
                </div>
            )}

            {error && (
                <div className="rounded bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                    {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                </button>
            </form>

            <p className="text-center text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link href="/signup" className="font-semibold text-indigo-600 hover:underline">
                    Regístrate aquí
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="flex flex-1 items-center justify-center bg-gray-50 p-4">
            <Suspense fallback={<div className="text-gray-500">Cargando formulario...</div>}>
                <LoginFormContent />
            </Suspense>
        </div>
    );
}