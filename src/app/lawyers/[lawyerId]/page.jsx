import React from 'react';
import Link from 'next/link';
import {
    Star, DollarSign, ArrowLeft, Award, GraduationCap,
    MapPin, Phone, ShieldCheck, Briefcase
} from 'lucide-react';

import { getLawyersById } from '@/lib/api/lawyers';
import HireButton from '@/components/lawyer/HireButton';
import CommentSection from '@/components/lawyer/CommentSection';

export default async function LawyerDetailsPage({ params }) {
    const { lawyerId } = await params;

    let lawyer = null;
    try {
        lawyer = await getLawyersById(lawyerId);
    } catch (error) {
        console.error('Failed to fetch lawyer:', error);
    }

    // যদি আইনজীবী না পাওয়া যায়
    if (!lawyer || lawyer.message) {
        return (
            <div className="w-full min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white p-6 space-y-4">
                <p className="text-slate-400 text-lg font-medium">Lawyer could not be found or is no longer active.</p>
                <Link
                    href="/lawyers"
                    className="inline-flex items-center gap-2 text-sm text-amber-500 hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Lawyers Directory
                </Link>
            </div>
        );
    }

    // Database Fields Extraction with Fallbacks
    const name = lawyer?.name || 'Unnamed Lawyer';
    const avatar = lawyer?.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400';
    const specialization = lawyer?.specialization?.trim() || 'Licensed Attorney';
    const consultationFee = lawyer?.consultationFee || 0;
    const rating = lawyer?.rating || 5.0;
    const experienceYears = lawyer?.experienceYears || 0;
    const bio = lawyer?.bio || 'No professional bio available.';
    const isBusy = lawyer?.status === 'Busy';

    // New Fields from Image Data
    const barCouncilNo = lawyer?.barCouncilNo;
    const chamberAddress = lawyer?.chamberAddress;
    const contactNumber = lawyer?.contactNumber;
    const education = Array.isArray(lawyer?.education) ? lawyer.education : [];
    const awards = Array.isArray(lawyer?.awards) ? lawyer.awards : [];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

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
                            src={avatar}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Basic Info & Status */}
                    <div className="flex-1 space-y-4 text-center md:text-left w-full">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{name}</h1>
                                <p className="text-amber-500 font-medium text-sm sm:text-base mt-1">{specialization}</p>

                                {/* Bar Council Number Badge */}
                                {barCouncilNo && (
                                    <p className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-1 mt-1">
                                        <ShieldCheck className="w-4 h-4 text-emerald-400 inline" />
                                        Bar Council Reg No: <span className="text-slate-200 font-semibold">{barCouncilNo}</span>
                                    </p>
                                )}
                            </div>

                            {/* Availability Badge */}
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 ${isBusy
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                }`}>
                                <span className={`w-2 h-2 rounded-full ${isBusy ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                                {isBusy ? 'Currently Fully Booked' : 'Available for Consultation'}
                            </span>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-3 gap-2 bg-slate-800/50 p-3 rounded-2xl border border-slate-800 text-center">
                            <div>
                                <p className="text-xs text-slate-400">Consultation Fee</p>
                                <p className="text-sm sm:text-base font-bold text-amber-400 flex items-center justify-center">
                                    <DollarSign className="w-4 h-4" />{consultationFee}/hr
                                </p>
                            </div>
                            <div className="border-x border-slate-700/50">
                                <p className="text-xs text-slate-400">Rating</p>
                                <p className="text-sm sm:text-base font-bold text-white flex items-center justify-center gap-1">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />{rating}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Experience</p>
                                <p className="text-sm sm:text-base font-bold text-white">{experienceYears}+ Yrs</p>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-1">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Professional Summary</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{bio}</p>
                        </div>

                        {/* Contact Info & Chamber Address */}
                        <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-300">
                            {chamberAddress && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                                    <span>Chamber: <strong>{chamberAddress}</strong></span>
                                </div>
                            )}
                            {contactNumber && (
                                <div className="flex items-center gap-1.5">
                                    <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                                    <span>Contact: <strong>{contactNumber}</strong></span>
                                </div>
                            )}
                        </div>

                        {/* Hire Action Button */}
                        <div className="pt-2 flex justify-end">
                            <HireButton lawyer={lawyer} lawyerId={lawyerId} />
                        </div>
                    </div>
                </div>

                {/* Additional Details Grid (Education & Awards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Education Section */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-amber-500" /> Education & Qualifications
                        </h2>
                        {education.length > 0 ? (
                            <div className="space-y-3">
                                {education.map((item, idx) => (
                                    <div key={idx} className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-200">{item.degree}</h4>
                                            <p className="text-xs text-slate-400 mt-0.5">{item.institution}</p>
                                        </div>
                                        <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-medium">
                                            {item.year}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500 italic">No education details provided.</p>
                        )}
                    </div>

                    {/* Awards Section */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Award className="w-5 h-5 text-amber-500" /> Honors & Awards
                        </h2>
                        {awards.length > 0 ? (
                            <div className="space-y-3">
                                {awards.map((award, idx) => (
                                    <div key={idx} className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-200">{award.title}</h4>
                                            <p className="text-xs text-slate-400 mt-0.5">{award.organization}</p>
                                        </div>
                                        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                                            {award.year}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500 italic">No awards listed.</p>
                        )}
                    </div>

                </div>

                {/* Comment & Feedback Section */}
                <CommentSection lawyerId={lawyerId} initialComments={lawyer?.comments || []} />

            </div>
        </div>
    );
}