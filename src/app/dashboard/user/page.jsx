'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    User,
    UserCheck,
    Clock,
    CheckCircle2,
    XCircle,
    Edit3,
    MessageSquare,
    ArrowRight,
    Shield,
    Briefcase
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { getHiringHistory } from '@/lib/api/hiring-history';


export default function UserDashboardPage() {
    const { data: session, isPending } = authClient.useSession();
    const currentUser = session?.user;

    const [stats, setStats] = useState({
        totalHires: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
    });
    const [recentHires, setRecentHires] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser?.email) {

            getHiringHistory(currentUser.email)
                .then((data) => {
                    const historyList = Array.isArray(data) ? data : [];
                    setRecentHires(historyList.slice(0, 3)); 

                    const pendingCount = historyList.filter(item => item.status?.toLowerCase() === 'pending').length;
                    const acceptedCount = historyList.filter(item => item.status?.toLowerCase() === 'accepted').length;
                    const rejectedCount = historyList.filter(item => item.status?.toLowerCase() === 'rejected').length;

                    setStats({
                        totalHires: historyList.length,
                        pending: pendingCount,
                        accepted: acceptedCount,
                        rejected: rejectedCount,
                    });
                })
                .catch((err) => console.error('Dashboard Stats Load Error:', err))
                .finally(() => setLoading(false));
        }
    }, [currentUser]);

    if (isPending || loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* 1. Profile Banner Section */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                        {/* Profile Image */}
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-slate-800 flex items-center justify-center shadow-lg">
                            {currentUser?.image ? (
                                <Image
                                    src={currentUser.image}
                                    alt={currentUser?.name || 'User Avatar'}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <User className="w-10 h-10 text-slate-400" />
                            )}
                        </div>

                        {/* Name & Info */}
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
                                <Shield className="w-3 h-3" /> Client Account
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                                Welcome back, {currentUser?.name || 'User'}!
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                {currentUser?.email}
                            </p>
                        </div>
                    </div>

                    {/* Navigation Button for Update Profile */}
                    <Link
                        href="/dashboard/user/update-profile"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-amber-600/20"
                    >
                        <Edit3 className="w-4 h-4" /> Update Profile
                    </Link>
                </div>
            </div>

            {/* 2. Quick Overview Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Total Hiring Requests</p>
                        <h3 className="text-2xl font-bold text-white mt-0.5">{stats.totalHires}</h3>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
                    <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Pending Requests</p>
                        <h3 className="text-2xl font-bold text-amber-400 mt-0.5">{stats.pending}</h3>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Accepted</p>
                        <h3 className="text-2xl font-bold text-emerald-400 mt-0.5">{stats.accepted}</h3>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
                    <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Rejected</p>
                        <h3 className="text-2xl font-bold text-rose-400 mt-0.5">{stats.rejected}</h3>
                    </div>
                </div>
            </div>

            {/* 3. Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hiring History Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-amber-500" /> Hiring History
                            </h3>
                            <Link
                                href="/dashboard/user/hiring-history"
                                className="text-xs text-amber-500 hover:underline flex items-center gap-1 font-medium"
                            >
                                View All <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Check the live status of lawyers you have hired or sent consultation requests to.
                        </p>
                    </div>

                    {/* Preview Table */}
                    {recentHires.length > 0 ? (
                        <div className="space-y-2 mt-2">
                            {recentHires.map((item) => (
                                <div key={item._id} className="bg-slate-800/50 p-3 rounded-xl border border-slate-800/80 flex justify-between items-center text-xs">
                                    <div>
                                        <p className="font-semibold text-white">{item.lawyerName}</p>
                                        <p className="text-slate-400 text-[11px]">{item.specialization || 'Lawyer'}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${item.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            item.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                        {item.status || 'Pending'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 italic">No recent hiring requests found.</p>
                    )}
                </div>

                {/* Comment Management Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-amber-500" /> Comment Management
                            </h3>
                            <Link
                                href="/dashboard/user/comments"
                                className="text-xs text-amber-500 hover:underline flex items-center gap-1 font-medium"
                            >
                                Manage <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            View, edit, or delete all the reviews and comments you left on lawyer profiles across the platform.
                        </p>
                    </div>

                    <Link
                        href="/dashboard/user/comments"
                        className="w-full text-center py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs text-slate-200 font-semibold transition-colors mt-4"
                    >
                        Go to My Comments
                    </Link>
                </div>
            </div>
        </div>
    );
}