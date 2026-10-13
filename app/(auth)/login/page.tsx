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
                setError('Invalid credentials. Make sure you have registered first.');
            } else {
                router.push('/');
                router.refresh();
            }
        } catch (err) {
            setError('An error occurred while signing in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg border border-gray-100">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Sign In</h1>
                <p className="mt-2 text-sm text-gray-600">Welcome back to Math Learning Path</p>
            </div>

            {/* Registration Invite Banner */}
            {!isRegistered && (
                <div className="rounded-lg bg-indigo-50 p-4 border border-indigo-100 text-center">
                    <p className="text-sm font-medium text-indigo-900">
                        First time here?
                    </p>
                    <p className="mt-1 text-xs text-indigo-700">
                        You need to register to start using the platform.
                    </p>
                    <Link
                        href="/signup"
                        className="mt-3 inline-block w-full rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
                    >
                        Create a new account
                    </Link>
                </div>
            )}

            {/* Successful registration notification */}
            {isRegistered && (
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200 text-center font-medium">
                    Registration successful! Please enter your details below.
                </div>
            )}

            {/* Credentials error */}
            {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200 text-center">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email address</label>
                    <input
                        type="email"
                        required
                        placeholder="you@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-black"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
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
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Suspense fallback={<div className="text-gray-500">Loading form...</div>}>
                <LoginFormContent />
            </Suspense>
        </div>
    );
}