'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Award, Briefcase, ArrowRight } from 'lucide-react';

// Mock Top Lawyers (Backend-e GET /api/lawyers/top-hired API endpoint e replace hobe)
const MOCK_TOP_LAWYERS = [
    {
        _id: "101",
        name: "Adv. Sarah Rahman",
        specialization: "Corporate & Commercial Law",
        totalHires: 142,
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
        rank: 1
    },
    {
        _id: "102",
        name: "Adv. Tanvir Hossain",
        specialization: "Criminal Defense Expert",
        totalHires: 118,
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
        rank: 2
    },
    {
        _id: "103",
        name: "Adv. Rafiqul Islam",
        specialization: "Intellectual Property & IT",
        totalHires: 96,
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        rank: 3
    }
];

export default function TopLegalExperts() {
    const [topLawyers, setTopLawyers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // API Call Simulation: Top 3 Hired Lawyers
        const fetchTopLawyers = async () => {
            setLoading(true);
            try {
                /* 
                  Backend Connection Point:
                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lawyers/top-hired`);
                  const data = await res.json();
                  setTopLawyers(data);
                */

                setTimeout(() => {
                    setTopLawyers(MOCK_TOP_LAWYERS);
                    setLoading(false);
                }, 600);
            } catch (error) {
                console.error("Failed to load top lawyers:", error);
                setLoading(false);
            }
        };

        fetchTopLawyers();
    }, []);

    return (
        <section className="py-16 bg-slate-800/40 border-y border-slate-800 relative overflow-hidden">

            {/* Background Accent glow */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Title */}
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold uppercase tracking-wider">
                        <Trophy className="w-3.5 h-3.5" />
                        Most Demanded Attorneys
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                        Top Legal Experts
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base">
                        Recognizing our highest-rated legal professionals trusted by clients nationwide.
                    </p>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 flex flex-col items-center animate-pulse space-y-4">
                                <div className="w-24 h-24 rounded-full bg-slate-700" />
                                <div className="h-6 w-3/4 bg-slate-700 rounded" />
                                <div className="h-4 w-1/2 bg-slate-700 rounded" />
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Top 3 Lawyers Cards Grid */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {topLawyers.map((lawyer) => (
                            <div
                                key={lawyer._id}
                                className="relative bg-slate-800/90 border border-slate-700/80 hover:border-amber-500/60 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col items-center justify-between group"
                            >

                                {/* Rank Trophy Badge */}
                                <div className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/30 text-amber-500 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                    <Award className="w-3.5 h-3.5" />
                                    #{lawyer.rank} Top
                                </div>

                                {/* Avatar with Ring Highlight */}
                                <div className="relative mt-2 mb-4">
                                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-amber-500/50 p-1 bg-slate-900 shadow-lg group-hover:scale-105 transition-transform duration-300">
                                        <img
                                            src={lawyer.image}
                                            alt={lawyer.name}
                                            className="w-full h-full object-cover object-top rounded-full"
                                        />
                                    </div>
                                    {/* Total Hires Pill Badge */}
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                                        {lawyer.totalHires}+ Successful Hires
                                    </div>
                                </div>

                                {/* Name & Specialization */}
                                <div className="mt-2 space-y-1 w-full">
                                    <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                                        {lawyer.name}
                                    </h3>
                                    <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                                        <Briefcase className="w-3.5 h-3.5 text-amber-500/80" />
                                        {lawyer.specialization}
                                    </p>
                                </div>

                                {/* Action Link */}
                                <div className="mt-6 w-full pt-4 border-t border-slate-700/50">
                                    <Link
                                        href={`/lawyers/${lawyer._id}`}
                                        className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-amber-600 text-slate-200 hover:text-white font-medium text-sm transition-colors"
                                    >
                                        View Profile
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
}