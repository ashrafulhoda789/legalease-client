'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    UserCheck,
    Briefcase,
    Users,
    Settings,
    LogOut,
    Scale,
    Shield
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function DashboardSidebar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const pathname = usePathname();
    const { data: session } = authClient.useSession();
    const userRole = session?.user?.role || 'user';

    const navItems = {
        user: [
            { name: 'Dashboard', href: '/dashboard/user', icon: LayoutDashboard },
            { name: 'My Hiring Requests', href: '/dashboard/user/hiring-history', icon: FileText },
            { name: 'Settings', href: '/dashboard/user/settings', icon: Settings },
        ],
        lawyer: [
            { name: 'Dashboard', href: '/dashboard/lawyer', icon: LayoutDashboard },
            { name: 'Hiring History', href: '/dashboard/lawyer/hiring-history', icon: UserCheck },
            { name: 'Manage Legal Profile', href: '/dashboard/lawyer/manage-legal-profile', icon: Briefcase },
            { name: 'Settings', href: '/dashboard/lawyer/settings', icon: Settings },
        ],
        admin: [
            { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
            { name: 'Manage Users', href: '/dashboard/admin/manage-users', icon: Users },
            { name: 'Manage Lawyers', href: '/dashboard/admin/manage-lawyers', icon: Shield },
            { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
        ]
    };

    const currentNav = navItems[userRole] || navItems.user;

    const handleSignOut = async () => {
        await authClient.signOut();
        window.location.href = '/auth/signin';
    };

    return (
        <>
            {isExpanded && (
                <div
                    onClick={() => setIsExpanded(false)}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 transition-opacity lg:hidden"
                />
            )}

            <aside
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
                className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out select-none lg:w-64 lg:bg-slate-900 lg:border-r lg:border-slate-800 lg:p-4 ${isExpanded
                        ? 'w-64 bg-slate-900/95 border-r border-slate-800 p-4 shadow-2xl backdrop-blur-md'
                        : 'w-12 bg-slate-900/80 border-r border-slate-800/60 p-2'
                    }`}
            >
                <div className="space-y-6 overflow-hidden">
                    <Link href="/" className="hidden lg:flex items-center gap-3 px-2 py-1 min-w-[200px]">
                        <div className="w-9 h-9 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center border border-amber-500/20 shrink-0">
                            <Scale className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-white text-base tracking-wide whitespace-nowrap">
                                LegalEase
                            </h2>
                            <span className="text-[10px] text-amber-500 uppercase tracking-widest font-semibold block -mt-1 whitespace-nowrap">
                                {userRole} Portal
                            </span>
                        </div>
                    </Link>

                    <nav className="space-y-1.5 pt-2 lg:pt-0">
                        {currentNav.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsExpanded(false)}
                                    className={`flex items-center gap-3.5 px-2 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${isActive
                                            ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/10'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                                        }`}
                                >
                                    <Icon
                                        className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'
                                            }`}
                                    />
                                    <span
                                        className={`transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 lg:opacity-100'
                                            }`}
                                    >
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="pt-4 border-t border-slate-800 overflow-hidden">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors whitespace-nowrap"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        <span
                            className={`transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 lg:opacity-100'
                                }`}
                        >
                            Sign Out
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}