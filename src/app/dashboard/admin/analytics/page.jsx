import React from "react";
import { Users, Scale, Briefcase, DollarSign, ArrowRight, UsersIcon } from "lucide-react";
import { getUserList } from "@/lib/api/users";
import { getLawyers } from "@/lib/api/lawyers";
import { getAllPayments } from "@/lib/api/payments";
import Link from "next/link";
import { GrTransaction } from "react-icons/gr";

export default async function AnalyticsPage() {
    const [userData, lawyersData, paymentsData] = await Promise.all([
        getUserList().catch((err) => []),
        getLawyers().catch((err) => []),
        getAllPayments().catch((err) => []),
    ]);

    const users = Array.isArray(userData) ? userData : userData?.users || [];
    const lawyers = Array.isArray(lawyersData) ? lawyersData : lawyersData?.data || [];
    const payments = Array.isArray(paymentsData) ? paymentsData : paymentsData?.data || [];

    const totalUsers = users.length;
    const totalLawyers = lawyers.length;
    const totalHires = payments.filter((p) => p.status === "succeeded" || p.status === "paid" || p.status === "completed").length;

    const rawData = await getAllPayments();
    const transactions = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.data)
            ? rawData.data
            : [];

    const totalRevenue = transactions.reduce((sum, item) => sum + (Number(item.price || item.amount) || 0), 0);

    // Cards Structure
    const stats = [
        {
            id: 1,
            title: "Total Users",
            value: totalUsers.toLocaleString(),
            icon: Users,
            color: "from-blue-600/10 to-indigo-600/5",
            borderColor: "border-slate-800/80 hover:border-blue-500/40",
            iconColor: "text-blue-400 bg-blue-950/40 border-blue-800/40",
            subtitle: "Registered on platform",
        },
        {
            id: 2,
            title: "Total Lawyers",
            value: totalLawyers.toLocaleString(),
            icon: Scale,
            color: "from-purple-600/10 to-pink-600/5",
            borderColor: "border-slate-800/80 hover:border-purple-500/40",
            iconColor: "text-purple-400 bg-purple-950/40 border-purple-800/40",
            subtitle: "Verified legal experts",
        },
        {
            id: 3,
            title: "Total Hires",
            value: totalHires.toLocaleString(),
            icon: Briefcase,
            color: "from-amber-600/10 to-orange-600/5",
            borderColor: "border-slate-800/80 hover:border-amber-500/40",
            iconColor: "text-amber-400 bg-amber-950/40 border-amber-800/40",
            subtitle: "Successful consultations",
        },
        {
            id: 4,
            title: "Total Revenue",
            value: `৳ ${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "from-emerald-600/10 to-teal-600/5",
            borderColor: "border-slate-800/80 hover:border-emerald-500/40",
            iconColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40",
            subtitle: "Lifetime platform earnings",
        },
    ];

    return (
        /* bg-transparent ব্যবহার করা হয়েছে যেন লেআউটের অরিজিনাল ব্যাকগ্রাউন্ড ব্যাকড্রপ হিসেবে থাকে */
        <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-transparent min-h-screen text-slate-200">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Analytics Overview
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Live performance metrics and revenue statistics.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto bg-[#0d1424] border border-slate-800/80 px-3 py-1.5 rounded-full text-xs text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Data Synced
                </div>
            </div>

            {/* Overview Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <div
                            key={item.id}
                            className={`relative overflow-hidden bg-[#0a0f1d]/80 backdrop-blur-md border ${item.borderColor} rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
                        >
                            {/* Radial Accent Glow */}
                            <div
                                className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${item.color} blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500`}
                            />

                            <div className="relative z-10 flex items-center justify-between">
                                {/* Icon Box */}
                                <div className={`p-2.5 rounded-xl border ${item.iconColor}`}>
                                    <IconComponent className="w-5 h-5" />
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="relative z-10 mt-4 space-y-1">
                                <h3 className="text-xs font-medium text-slate-400">
                                    {item.title}
                                </h3>
                                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                    {item.value}
                                </p>
                            </div>

                            {/* Footer Info */}
                            <div className="relative z-10 mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500">
                                {item.subtitle}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Additional Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                {/* Recent Users Widget */}
                <div className="bg-[#0a0f1d]/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                            <UsersIcon className="w-5 h-5 text-amber-500" /> Recent Users
                        </h3>
                        <Link
                            href="/dashboard/admin/manage-users"
                            className="text-xs text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1 font-medium"
                        >
                            View All <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="space-y-2.5">
                        {users.slice(0, 4).map((u, idx) => (
                            <div
                                key={u.id || u._id || idx}
                                className="flex items-center justify-between p-3 bg-[#060a12]/60 border border-slate-800/50 rounded-xl text-xs hover:border-slate-700/60 transition-colors"
                            >
                                <div>
                                    <p className="font-semibold text-white">{u.name || "N/A"}</p>
                                    <p className="text-slate-400 text-[11px]">{u.email}</p>
                                </div>
                                <span className="capitalize text-slate-300 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/50 text-[11px]">
                                    {u.role || "user"}
                                </span>
                            </div>
                        ))}
                        {users.length === 0 && <p className="text-xs text-slate-500 py-2">No users found.</p>}
                    </div>
                </div>

                {/* Recent Payments Widget */}
                <div className="bg-[#0a0f1d]/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                            <GrTransaction className="w-5 h-5 text-amber-500" /> Recent Transactions
                        </h3>
                        <Link
                            href="/dashboard/admin/all-transactions"
                            className="text-xs text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1 font-medium"
                        >
                            View All <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="space-y-2.5">
                        {transactions.slice(0, 4).map((p, idx) => (
                            <div
                                key={p.id || p._id || idx}
                                className="flex items-center justify-between p-3 bg-[#060a12]/60 border border-slate-800/50 rounded-xl text-xs hover:border-slate-700/60 transition-colors"
                            >
                                <div>
                                    <p className="font-semibold text-emerald-400">৳ {p.price || p.amount || 0}</p>
                                    <p className="text-slate-400 text-[11px]">{p.userEmail || p.userName || "Transaction"}</p>
                                </div>
                                <span className={`capitalize px-2.5 py-1 rounded-lg border text-[10px] font-semibold ${p.status === "completed" || p.status === "paid" || p.status === "succeeded" || p.status === "SUCCESS"
                                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                        : "bg-slate-800/60 text-slate-400 border-slate-700/50"
                                    }`}>
                                    {p.status || "Pending"}
                                </span>
                            </div>
                        ))}
                        {transactions.length === 0 && <p className="text-xs text-slate-500 py-2">No payments found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}