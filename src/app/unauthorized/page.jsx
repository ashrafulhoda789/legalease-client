"use client";

import Link from "next/link";
import React from "react";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-[#0b1222] text-slate-200 flex items-center justify-center p-6 select-none">
            <div className="max-w-md w-full text-center space-y-6">

                <div className="relative mx-auto w-24 h-24 flex items-center justify-center rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-2xl shadow-amber-500/10">
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
                            d="M12 15v2m0 0v2m0-2h2m-2 0H10m11 3V11a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2zM7 9V7a5 5 0 0110 0v2"
                        />
                    </svg>
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black rounded-full">
                        401
                    </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Authentication Required
                    </h1>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                        You need to be logged in to access this page. Please sign in to your account and try again.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-3 pt-2">
                    <Link
                        href="/auth/signin"
                        className="px-6 py-2.5 text-xs font-semibold text-black bg-amber-500 hover:bg-amber-400 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                    >
                        Log In Now
                    </Link>
                    <Link
                        href="/"
                        className="px-6 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all active:scale-95"
                    >
                        Back to Home
                    </Link>
                </div>

            </div>
        </div>
    );
}