'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { authClient } from "@/lib/auth-client";

// ১. মূল Form Content কম্পোনেন্ট
function SignInForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    // BetterAuth Email Sign-In Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await authClient.signIn.email({
                email: formData.email,
                password: formData.password,
            });

            if (res?.error) {
                setError(res.error.message || "Invalid email or password.");
                setLoading(false);
                return;
            }

            // Successful Login Redirection
            router.push('/');
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    };

    // BetterAuth Google Sign-In
    const handleGoogleAuth = async () => {
        setLoading(true);
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/"
            });
        } catch (err) {
            setError("Google Login failed.");
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">

            {/* Header */}
            <div className="text-center space-y-2 mb-8">
                <Link href="/" className="inline-flex items-center gap-2 text-amber-500 font-bold text-2xl">
                    <Scale className="w-8 h-8" />
                    <span>LegalEase</span>
                </Link>
                <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                <p className="text-sm text-slate-400">Sign in to access your legal consultations</p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium text-center">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email */}
                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                    <div className="relative">
                        <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-amber-500 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-medium text-slate-300">Password</label>
                        <a href="#" className="text-xs text-amber-500 hover:underline">Forgot password?</a>
                    </div>
                    <div className="relative">
                        <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-amber-500 rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-amber-600/20 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                    {loading ? 'Signing In...' : (
                        <>
                            <LogIn className="w-4 h-4" /> Sign In
                        </>
                    )}
                </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
                <span className="relative bg-slate-900 px-3 text-xs text-slate-500 uppercase">Or Continue With</span>
            </div>

            {/* Google OAuth Button */}
            <button
                onClick={handleGoogleAuth}
                disabled={loading}
                type="button"
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium py-3 rounded-xl flex items-center justify-center gap-3 transition-colors text-sm"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.4-.7-.4-1.5-.4-2.3z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                Google
            </button>

            {/* Footer */}
            <p className="text-center text-xs text-slate-400 mt-6">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="text-amber-500 hover:underline font-semibold">
                    Sign Up
                </Link>
            </p>

        </div>
    );
}

// ২. মূল পেজ এক্সপোর্ট (Suspense Boundary যুক্ত)
export default function SignInPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 py-12 relative overflow-hidden">
            {/* Background Accent glow */}
            <div className="absolute top-1/3 -right-20 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

            <Suspense fallback={<div className="text-white text-center">Loading Sign In...</div>}>
                <SignInForm />
            </Suspense>
        </div>
    );
}