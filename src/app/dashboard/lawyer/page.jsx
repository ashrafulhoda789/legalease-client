'use client';

import React from 'react';
import Link from 'next/link';
import {
    Users,
    Briefcase,
    Clock,
    TrendingUp,
    Calendar,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    UserCheck,
    Star
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function LawyerDashboardPage() {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    // ডামি ডেটা (প্রয়োজন অনুযায়ী ব্যাকএন্ড/API থেকে লোড করবেন)
    const stats = [
        {
            title: 'Total Hire Requests',
            value: '24',
            change: '+12% this month',
            icon: Briefcase,
            color: 'text-amber-500',
            bgColor: 'bg-amber-500/10',
            borderColor: 'border-amber-500/20'
        },
        {
            title: 'Active Consultations',
            value: '5',
            change: '2 pending review',
            icon: Clock,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20'
        },
        {
            title: 'Completed Cases',
            value: '18',
            change: '94% satisfaction rate',
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20'
        },
        {
            title: 'Profile Rating',
            value: '4.9',
            change: 'Based on 32 reviews',
            icon: Star,
            color: 'text-amber-400',
            bgColor: 'bg-amber-400/10',
            borderColor: 'border-amber-400/20'
        }
    ];

    const recentRequests = [
        {
            id: '1',
            clientName: 'Tanvir Ahmed',
            caseType: 'Corporate Law / Contract Review',
            date: 'Today, 2:30 PM',
            status: 'Pending',
            statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        },
        {
            id: '2',
            clientName: 'Sarah Khan',
            caseType: 'Property & Real Estate Dispute',
            date: 'Yesterday, 5:00 PM',
            status: 'Accepted',
            statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        },
        {
            id: '3',
            clientName: 'Rahim Chowdhury',
            caseType: 'Family Law Consultation',
            date: '24 Jul 2026',
            status: 'Completed',
            statusColor: 'bg-slate-700/50 text-slate-300 border-slate-600'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Welcome back, <span className="text-amber-500">Adv. {user?.name || 'Lawyer'}</span>
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base mt-1">
                        Here is what&apos;s happening with your hire requests and consultations today.
                    </p>
                </div>
                <Link
                    href="/dashboard/lawyer/manage-profile"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-amber-600/20 text-sm shrink-0"
                >
                    Update Profile
                </Link>
            </div>

            {/* Metrics / Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={index}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-xs sm:text-sm font-medium">{item.title}</span>
                                <div className={`p-2.5 rounded-xl ${item.bgColor} ${item.color} border ${item.borderColor}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-2xl sm:text-3xl font-extrabold text-white">{item.value}</p>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-emerald-400 inline" />
                                    {item.change}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Area (Recent Hiring Requests & Quick Actions) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Recent Hire Requests */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-white">Recent Hire Requests</h2>
                            <p className="text-slate-400 text-xs">Clients looking for legal advice and hiring</p>
                        </div>
                        <Link
                            href="/dashboard/lawyer/hiring-history"
                            className="text-amber-500 hover:text-amber-400 text-xs sm:text-sm font-medium flex items-center gap-1 transition-colors"
                        >
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentRequests.map((req) => (
                            <div
                                key={req.id}
                                className="bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="bg-slate-700 p-2.5 rounded-xl text-amber-500 mt-0.5">
                                        <UserCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold text-sm sm:text-base">{req.clientName}</h3>
                                        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{req.caseType}</p>
                                        <span className="text-[11px] text-slate-500 mt-1 block">{req.date}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-slate-700/50 pt-3 sm:pt-0">
                                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${req.statusColor}`}>
                                        {req.status}
                                    </span>
                                    <Link
                                        href="/dashboard/lawyer/hiring-history"
                                        className="text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 text-xs px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Quick Status & Actions */}
                <div className="space-y-6">

                    {/* Profile Status Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-lg font-bold text-white mb-4">Profile Readiness</h2>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-medium mb-1">
                                    <span className="text-slate-400">Completion</span>
                                    <span className="text-amber-500 font-bold">85%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '85%' }}></div>
                                </div>
                            </div>

                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-200/80 leading-relaxed">
                                    Add your chamber location and hourly rate to boost visibility by 30%.
                                </p>
                            </div>

                            <Link
                                href="/dashboard/lawyer/manage-profile"
                                className="block text-center w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-medium py-2.5 rounded-xl transition-colors"
                            >
                                Manage Profile Settings
                            </Link>
                        </div>
                    </div>

                    {/* Quick Nav Links */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-lg font-bold text-white mb-4">Quick Links</h2>
                        <div className="space-y-2">
                            <Link
                                href="/dashboard/lawyer/hiring-history"
                                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-colors text-sm font-medium"
                            >
                                <span>Hiring Requests & History</span>
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/dashboard/lawyer/manage-profile"
                                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-colors text-sm font-medium"
                            >
                                <span>Edit Public Bio & Practice Areas</span>
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/lawyers"
                                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-colors text-sm font-medium"
                            >
                                <span>Preview Public Profile</span>
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}