import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    Star, DollarSign, Calendar, ArrowLeft
} from 'lucide-react';

import { getLawyersById } from '@/lib/api/lawyers';
import HireButton from '@/components/lawyer/HireButton';
import CommentSection from '@/components/lawyer/CommentSection';

export default async function LawyerDetailsPage({ params }) {
    const { lawyerId } = await params;

    const lawyer = await getLawyersById(lawyerId);

    if (!lawyer) {
        return (
            <div className="w-full min-h-screen bg-zinc-950 flex flex-col justify-center items-center text-white p-6">
                <p className="text-zinc-400 text-lg">Lawyer could not be found or is no longer active.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Back Button */}
                <Link
                    href="/lawyers"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-amber-500 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Lawyers
                </Link>

                {/* Main Lawyer Profile Header Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start">

                    {/* Image */}
                    <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-2 border-slate-700 shrink-0 bg-slate-800">
                        <img
                            src={lawyer.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'}
                            alt={lawyer.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Basic Info & Status */}
                    <div className="flex-1 space-y-4 text-center md:text-left w-full">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{lawyer.name}</h1>
                                <p className="text-amber-500 font-medium text-sm sm:text-base mt-1">{lawyer.specialization}</p>
                            </div>
                            {/* Availability Badge */}
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${lawyer.isBusy ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                }`}>
                                <span className={`w-2 h-2 rounded-full ${lawyer.isBusy ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                                {lawyer.isBusy ? 'Currently Fully Booked' : 'Available for Consultation'}
                            </span>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-2 bg-slate-800/50 p-3 rounded-2xl border border-slate-800 text-center">
                            <div>
                                <p className="text-xs text-slate-400">Consultation Fee</p>
                                <p className="text-sm sm:text-base font-bold text-amber-400 flex items-center justify-center">
                                    <DollarSign className="w-4 h-4" />{lawyer.hourlyRate || 0}/hr
                                </p>
                            </div>
                            <div className="border-x border-slate-700/50">
                                <p className="text-xs text-slate-400">Rating</p>
                                <p className="text-sm sm:text-base font-bold text-white flex items-center justify-center gap-1">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />{lawyer.rating || 5.0}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Experience</p>
                                <p className="text-sm sm:text-base font-bold text-white">{lawyer.experienceYears || 0}+ Yrs</p>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-1">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Professional Summary</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{lawyer.bio || 'No summary available.'}</p>
                        </div>

                        {/* Joined Date & Interactive Hire Button */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <Calendar className="w-4 h-4 text-slate-500" /> Member since {lawyer.joinedDate || 'N/A'}
                            </div>

                            {/* Client Component handle button click & Modal */}
                            <HireButton lawyer={lawyer} lawyerId={lawyerId} />
                        </div>
                    </div>
                </div>

                {/* Comment & Feedback Section (Client Component) */}
                <CommentSection lawyerId={lawyerId} initialComments={lawyer.comments || []} />

            </div>
        </div>
    );
}