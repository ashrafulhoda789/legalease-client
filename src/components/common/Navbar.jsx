'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Scale, Search, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';

function NavbarContent() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const pathname = usePathname();
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const isActive = (path) => pathname === path;

    const getDashboardPath = () => {
        const role = user?.role;
        if (role === 'lawyer') return '/dashboard/lawyer';
        if (role === 'admin') return '/dashboard/admin/analytics';
        return '/dashboard/user';
    };

    const dashboardPath = getDashboardPath();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/lawyers?search=${encodeURIComponent(searchTerm.trim())}`);
            setIsMenuOpen(false); // Mobile menu close on search
        } else {
            router.push('/lawyers');
        }
    };

    // Logout Functionality
    const handleLogout = async () => {
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        setIsProfileOpen(false);
                        setIsMenuOpen(false);
                        router.push('/auth/signin');
                        router.refresh();
                    },
                },
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo & Brand */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-amber-600 p-2 rounded-lg text-white">
                                <Scale className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xl tracking-wider text-white">
                                Legal<span className="text-amber-500">Ease</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/"
                            className={`transition-colors font-medium ${isActive('/') ? 'text-amber-500 font-semibold' : 'text-slate-300 hover:text-white'}`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/lawyers"
                            className={`transition-colors font-medium ${isActive('/lawyers') ? 'text-amber-500 font-semibold' : 'text-slate-300 hover:text-white'}`}
                        >
                            Browse Lawyers
                        </Link>

                        {/* Role-Based Dynamic Dashboard Link */}
                        {user && (
                            <Link
                                href={dashboardPath}
                                className={`transition-colors font-medium ${pathname.startsWith('/dashboard')
                                    ? 'text-amber-500 font-semibold'
                                    : 'text-slate-300 hover:text-white'}`}
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>

                    <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
                        <button type="submit" className="absolute left-3 text-slate-400 hover:text-amber-500">
                            <Search className="w-4 h-4" />
                        </button>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search lawyer & enter ..."
                            className="bg-slate-800 border border-slate-700 text-slate-100 text-sm rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:border-amber-500 placeholder:text-slate-400 w-64 lg:w-80"
                        />
                    </form>

                    {/* Right Action Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {isPending ? (
                            <div className="w-20 h-8 bg-slate-800 animate-pulse rounded-lg"></div>
                        ) : user ? (
                            <div className="relative">
                                {/* Profile Dropdown Trigger */}
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 bg-slate-800 border border-slate-700 hover:border-amber-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                >
                                    {user?.image ? (
                                        <Image
                                            src={user?.image}
                                            alt={user?.name || 'User Avatar'}
                                            width={25}
                                            height={25}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <User className="w-4 h-4 text-amber-500" />
                                    )}
                                    <span>{user.name || 'Account'}</span>
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                                        <div className="px-4 py-2 border-b border-slate-700">
                                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                            <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                                                {user.role || 'user'}
                                            </span>
                                        </div>

                                        <Link
                                            href={dashboardPath}
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/auth/signin"
                                    className="text-slate-300 hover:text-white text-sm font-medium px-3 py-1.5"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg shadow-md transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-slate-300 hover:text-white p-2 rounded-lg"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-3">
                    {/* Mobile Global Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="relative mb-3">
                        <button type="submit" className="absolute left-3 top-2.5 text-slate-400 hover:text-amber-500">
                            <Search className="w-4 h-4" />
                        </button>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search lawyer name or specialization..."
                            className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-amber-500"
                        />
                    </form>

                    <Link
                        href="/"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block py-2 ${isActive('/') ? 'text-amber-500 font-bold' : 'text-slate-200'}`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/lawyers"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block py-2 ${isActive('/lawyers') ? 'text-amber-500 font-bold' : 'text-slate-200'}`}
                    >
                        Browse Lawyers
                    </Link>

                    {user && (
                        <Link
                            href={dashboardPath}
                            onClick={() => setIsMenuOpen(false)}
                            className={`block py-2 ${pathname.startsWith('/dashboard') ? 'text-amber-500 font-bold' : 'text-slate-200'}`}
                        >
                            Dashboard
                        </Link>
                    )}

                    <div className="pt-2 border-t border-slate-800">
                        {user ? (
                            <div className="space-y-2">
                                <div className="px-2 py-1 text-xs text-slate-400">
                                    Logged in as: <span className="text-amber-500">{user.email}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white py-2 rounded-lg text-sm transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/auth/signin"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-1/2 text-center text-slate-300 border border-slate-700 py-1.5 rounded-lg text-sm"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-1/2 text-center bg-amber-600 text-white py-1.5 rounded-lg text-sm font-medium"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default function Navbar() {
    return (
        <Suspense fallback={
            <nav className="bg-slate-900 border-b border-slate-800 h-16 sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8">
                <div className="bg-amber-600/20 w-32 h-6 animate-pulse rounded"></div>
                <div className="bg-slate-800 w-48 h-8 animate-pulse rounded-lg"></div>
            </nav>
        }>
            <NavbarContent />
        </Suspense>
    );
}