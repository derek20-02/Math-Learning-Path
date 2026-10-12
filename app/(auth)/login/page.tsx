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
                setError('Credenciales inválidas. Asegúrate de haberte registrado primero.');
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
        <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg border border-gray-100">
            {/* Encabezado */}
            <div className="text-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Iniciar Sesión</h1>
                <p className="mt-2 text-sm text-gray-600">Bienvenido de nuevo a Math Learning Path</p>
            </div>

            {/* Banner de Invitación al Registro */}
            {!isRegistered && (
                <div className="rounded-lg bg-indigo-50 p-4 border border-indigo-100 text-center">
                    <p className="text-sm font-medium text-indigo-900">
                        ¿Primera vez por aquí?
                    </p>
                    <p className="mt-1 text-xs text-indigo-700">
                        Es necesario registrarte para comenzar a usar la plataforma.
                    </p>
                    <Link
                        href="/signup"
                        className="mt-3 inline-block w-full rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
                    >
                        Crear una cuenta nueva
                    </Link>
                </div>
            )}

            {/* Notificación de registro exitoso */}
            {isRegistered && (
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200 text-center font-medium">
                    ¡Registro exitoso! Por favor ingresa tus datos abajo.
                </div>
            )}

            {/* Error de credenciales */}
            {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200 text-center">
                    {error}
                </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                    <input
                        type="email"
                        required
                        placeholder="tu@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-black"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-black"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none disabled:opacity-50 transition-all"
                >
                    {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                </button>
            </form>

            
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Suspense fallback={<div className="text-gray-500">Cargando formulario...</div>}>
                <LoginFormContent />
            </Suspense>
        </div>
    );
}