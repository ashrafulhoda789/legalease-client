'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { Scale, Eye, EyeOff, User, Mail, Lock, UserCheck, Briefcase } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import Swal from 'sweetalert2';

export default function SignUpPage() {
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Role Selection State
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState('user');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    // Step 1: Form Validation
    const handleInitialSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setShowRoleModal(true);
    };

    const handleFinalRegister = async () => {
        setLoading(true);
        setError('');

        try {
            await authClient.signUp.email({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                requestedRole: selectedRole,
            }, {
                onRequest: () => {
                    setLoading(true);
                },
                onSuccess: async () => {
                    setLoading(false);
                    setShowRoleModal(false);

                    if (selectedRole === 'lawyer') {
                        Swal.fire({
                            title: 'Registration Successful!',
                            text: 'Fill your all info in your Dashboard to register as a lawyer',
                            icon: 'info',
                            confirmButtonText: 'Go to Manage Profile',
                            confirmButtonColor: '#f59e0b',
                            background: '#0f172a',
                            color: '#f8fafc',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                router.push('/dashboard/lawyer/manage-legal-profile');
                            }
                        });
                    } else {
                        
                        router.push('/');
                        router.refresh();
                    }
                },
                onError: (ctx) => {
                    setLoading(false);
                    setError(ctx.error.message || "Registration failed.");
                    setShowRoleModal(false);
                }
            });

        } catch (err) {
            setError("An unexpected error occurred. Please check network/console.");
            setShowRoleModal(false);
            setLoading(false);
        }
    };

    // BetterAuth Google OAuth Signup
    const handleGoogleAuth = async () => {
        setLoading(true);
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/"
            });
        } catch (err) {
            setError("Google Sign-Up failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 py-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-slate-700/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">

                {/* Header Logo & Title */}
                <div className="text-center space-y-2 mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-amber-500 font-bold text-2xl">
                        <Scale className="w-8 h-8" />
                        <span>LegalEase</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Create an Account</h1>
                    <p className="text-sm text-slate-400">Join our network of verified legal clients and lawyers</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium text-center">
                        {error}
                    </div>
                )}

                {/* Signup Form */}
                <form onSubmit={handleInitialSubmit} className="space-y-4">

                    {/* Full Name */}
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                        <div className="relative">
                            <User className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                                className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-amber-500 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

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
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
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

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm Password</label>
                        <div className="relative">
                            <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-amber-500 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Trigger Role Modal */}
                    <button
                        type="submit"
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-amber-600/20 transition-colors pt-3"
                    >
                        Continue
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-6 text-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
                    <span className="relative bg-slate-900 px-3 text-xs text-slate-500 uppercase">Or Continue With</span>
                </div>

                {/* Google Auth Button */}
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
                    Already have an account?{' '}
                    <Link href="/auth/signin" className="text-amber-500 hover:underline font-semibold">
                        Sign In
                    </Link>
                </p>

            </div>

            {/* Role Choice Selection Modal */}
            {showRoleModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
                        <div className="text-center space-y-2">
                            <h2 className="text-xl font-bold text-white">Select Your Account Type</h2>
                            <p className="text-xs text-slate-400">Choose how you plan to use LegalEase</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setSelectedRole('user')}
                                className={`p-5 rounded-2xl border flex flex-col items-center gap-3 text-center transition-all ${selectedRole === 'user'
                                    ? 'border-amber-500 bg-amber-500/10 text-white'
                                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                                    }`}
                            >
                                <div className={`p-3 rounded-xl ${selectedRole === 'user' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                                    <UserCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Client</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Looking for legal help</p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedRole('lawyer')}
                                className={`p-5 rounded-2xl border flex flex-col items-center gap-3 text-center transition-all ${selectedRole === 'lawyer'
                                    ? 'border-amber-500 bg-amber-500/10 text-white'
                                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                                    }`}
                            >
                                <div className={`p-3 rounded-xl ${selectedRole === 'lawyer' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Lawyer</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Providing legal service</p>
                                </div>
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowRoleModal(false)}
                                className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium py-3 rounded-xl transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleFinalRegister}
                                disabled={loading}
                                className="w-1/2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-amber-600/20"
                            >
                                {loading ? 'Creating...' : 'Complete Sign Up'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}