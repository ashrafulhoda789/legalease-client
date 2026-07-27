"use client";

import Link from "next/link";
import React from "react";

export default function ForbiddenPage() {
    return (
        <div className="min-h-screen bg-[#0b1222] text-slate-200 flex items-center justify-center p-6 select-none">
            <div className="max-w-md w-full text-center space-y-6">

                {/* Visual Icon / Illustration */}
                <div className="relative mx-auto w-24 h-24 flex items-center justify-center rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 shadow-2xl shadow-red-500/10">
                    <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                        />
                    </svg>
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-500 text-white rounded-full">
                        403
                    </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Access Denied
                    </h1>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                        Sorry! You don&apos;t have permission to view this page. If you believe this is an error, please contact support.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-3 pt-2">
                    <Link
                        href="/"
                        className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all shadow-lg active:scale-95"
                    >
                        Back to Home
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-6 py-2.5 text-xs font-semibold text-slate-900 bg-slate-200 hover:bg-white rounded-xl transition-all shadow-lg active:scale-95"
                    >
                        Go to Dashboard
                    </Link>
                </div>

            </div>
        </div>
    );
}