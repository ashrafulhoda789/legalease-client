'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Briefcase,
    Clock,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    UserCheck,
    Star,
    Loader2
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { getHiringRequest } from '@/lib/api/hiring-request';
import { getLawyerProfile } from '@/lib/api/lawyers';
import { getCommentsForSpecificLawyer } from '@/lib/api/comments';


export default function LawyerDashboardPage() {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [loading, setLoading] = useState(true);
    const [hiringRequests, setHiringRequests] = useState([]);
    const [comments, setComments] = useState([]);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.email) return;

            setLoading(true);
            try {
                // ১. Hiring Requests এবং Profile Data লোড করা
                const [hiringRes, profileRes] = await Promise.all([
                    getHiringRequest(user.email),
                    getLawyerProfile(user.email)
                ]);

                // Hiring Requests সেট করা
                const requestsData = hiringRes?.data || hiringRes || [];
                setHiringRequests(Array.isArray(requestsData) ? requestsData : []);

                // Profile Data সেট করা
                const lawyerProfileData = profileRes?.data || profileRes;
                setProfile(lawyerProfileData);

                // ২. Lawyer ID পাওয়া গেলে Comments/Reviews লোড করা
                const lawyerId = lawyerProfileData?._id || lawyerProfileData?.id;
                if (lawyerId) {
                    const commentsRes = await getCommentsForSpecificLawyer(lawyerId);
                    const commentsData = commentsRes?.data || commentsRes || [];
                    setComments(Array.isArray(commentsData) ? commentsData : []);
                }
            } catch (error) {
                console.error("Dashboard Data Fetching Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user?.email]);


    // ১. Hire Requests 
    const totalRequests = hiringRequests.length;
    const activeConsultations = hiringRequests.filter(
        (r) => r.status?.toLowerCase() === 'accepted' || r.status?.toLowerCase() === 'pending'
    ).length;
    const completedCases = hiringRequests.filter(
        (r) => r.status?.toLowerCase() === 'completed'
    ).length;

    // ২. Average Rating 
    const totalReviews = comments.length;
    const averageRating = totalReviews > 0
        ? (comments.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / totalReviews).toFixed(1)
        : '7/10';

    // ৩. Profile Completion
    const calculateProfileCompletion = () => {
        let score = 20; 
        if (profile) {
            if (profile.title || profile.specialization) score += 20;
            if (profile.chamberAddress || profile.location) score += 20;
            if (profile.consultationFee || profile.hourlyRate) score += 20;
            if (profile.bio || profile.about) score += 20;
        }
        return score;
    };
    const profileCompletion = calculateProfileCompletion();


    const stats = [
        {
            title: 'Total Hire Requests',
            value: totalRequests.toString(),
            change: 'All time received',
            icon: Briefcase,
            color: 'text-amber-500',
            bgColor: 'bg-amber-500/10',
            borderColor: 'border-amber-500/20'
        },
        {
            title: 'Active Consultations',
            value: activeConsultations.toString(),
            change: `${hiringRequests.filter(r => r.status?.toLowerCase() === 'pending').length} pending review`,
            icon: Clock,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20'
        },
        {
            title: 'Completed Cases',
            value: completedCases.toString(),
            change: 'Successfully closed',
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20'
        },
        {
            title: 'Profile Rating',
            value: averageRating,
            change: totalReviews > 0 ? `Based on ${totalReviews} reviews` : 'No reviews yet',
            icon: Star,
            color: 'text-amber-400',
            bgColor: 'bg-amber-400/10',
            borderColor: 'border-amber-400/20'
        }
    ];

    const recentRequests = hiringRequests.slice(0, 3); // সেরা ৩টি রিসেন্ট রিকুয়েস্ট

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                <p className="text-slate-400 text-sm">Loading dashboard data...</p>
            </div>
        );
    }

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
                    href="/dashboard/lawyer/manage-legal-profile"
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

            {/* Main Content Area */}
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
                        {recentRequests.length === 0 ? (
                            <p className="text-slate-500 text-sm py-6 text-center">No hiring requests found.</p>
                        ) : (
                            recentRequests.map((req) => {
                                const status = req.status?.toLowerCase();
                                let statusStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30';

                                if (status === 'accepted') {
                                    statusStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                                } else if (status === 'completed') {
                                    statusStyle = 'bg-slate-700/50 text-slate-300 border-slate-600';
                                } else if (status === 'rejected') {
                                    statusStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
                                }

                                return (
                                    <div
                                        key={req._id || req.id}
                                        className="bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="bg-slate-700 p-2.5 rounded-xl text-amber-500 mt-0.5">
                                                <UserCheck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold text-sm sm:text-base">
                                                    {req.userName || req.clientName || 'Anonymous Client'}
                                                </h3>
                                                <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                                                    {req.lawyerSpecialization || req.caseType || 'Legal Consultation'}
                                                </p>
                                                <span className="text-[11px] text-slate-500 mt-1 block">
                                                    {req.hiringDate || req.createdAt ? new Date(req.hiringDate || req.createdAt).toLocaleDateString() : 'Recent'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-slate-700/50 pt-3 sm:pt-0">
                                            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${statusStyle}`}>
                                                {req.status || 'Pending'}
                                            </span>
                                            <Link
                                                href="/dashboard/lawyer/hiring-history"
                                                className="text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 text-xs px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                Details
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        )}
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
                                    <span className="text-amber-500 font-bold">{profileCompletion}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${profileCompletion}%` }}
                                    ></div>
                                </div>
                            </div>

                            {profileCompletion < 100 && (
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-200/80 leading-relaxed">
                                        Add your chamber location and consultation fee to reach 100% profile completeness.
                                    </p>
                                </div>
                            )}

                            <Link
                                href="/dashboard/lawyer/manage-legal-profile"
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
                                href="/dashboard/lawyer/manage-legal-profile"
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