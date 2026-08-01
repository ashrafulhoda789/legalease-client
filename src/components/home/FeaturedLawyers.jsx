'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, DollarSign, Clock, Briefcase } from 'lucide-react';
import { getLawyers } from '@/lib/api/lawyers'; // আপনার API হেল্পার পাথ অনুযায়ী অ্যাডজাস্ট করে নেবেন

export default function FeaturedLawyers() {
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedLawyers = async () => {
            setLoading(true);
            try {
                // limit=6 এবং featured/top query দিয়ে dynamic call
                const res = await getLawyers('limit=6');

                // Response এ যদি lawyers Array থাকে অথবা সরাসরি Array আসে
                const lawyerData = res?.lawyers || res || [];
                setLawyers(lawyerData.slice(0, 6));
            } catch (error) {
                console.error("Failed to load featured lawyers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedLawyers();
    }, []);

    // console.log(lawyers);

    // Framer Motion Parent Stagger Container Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    // Framer Motion Child Card Variants
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    return (
        <section className="py-20 bg-slate-900 relative">
            <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm tracking-wide uppercase mb-2">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Top Rated Counsel</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                            Featured Legal Experts
                        </h2>
                    </div>
                    <Link
                        href="/lawyers"
                        className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-medium transition-colors group"
                    >
                        Browse All Lawyers
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Loading Skeleton Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div
                                key={n}
                                className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 space-y-4 animate-pulse"
                            >
                                <div className="w-full h-48 bg-slate-700/60 rounded-xl" />
                                <div className="h-6 bg-slate-700/60 rounded w-3/4" />
                                <div className="h-4 bg-slate-700/60 rounded w-1/2" />
                                <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
                                    <div className="h-6 bg-slate-700/60 rounded w-1/3" />
                                    <div className="h-9 bg-slate-700/60 rounded-lg w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Staggered Framer Motion Grid */
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {lawyers.map((lawyer) => {
                            // Dynamic Data Fallbacks
                            const targetId = lawyer?._id || lawyer?.user?._id;
                            const name = lawyer?.name || lawyer?.user?.name || 'Legal Expert';
                            const specialization = lawyer?.specialization || lawyer?.profile?.specialization || 'General Practitioner';
                            const fee = lawyer?.consultationFee || lawyer?.fee || '0';
                            const status = lawyer?.status || (lawyer?.isBusy ? 'Busy' : 'Available');
                            const image = lawyer?.photoUrl || lawyer?.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400';
                            const rating = lawyer?.rating || '5.0';
                            const reviewsCount = lawyer?.reviewsCount || lawyer?.consultationsCount || 10;
                            const lawyerLink = lawyer?.email || lawyer?.user?.email || targetId;

                            return (
                                <motion.div
                                    key={targetId}
                                    variants={cardVariants}
                                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                    className="bg-slate-800/80 border border-slate-700/70 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col group"
                                >
                                    {/* Image & Status Badge Header */}
                                    <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                                        <img
                                            src={image}
                                            alt={name}
                                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                                        {/* Status Badge (Available / Busy) */}
                                        <div className="absolute top-4 right-4">
                                            {status === "Busy" ? (
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/90 text-white backdrop-blur-md border border-rose-400/30 flex items-center gap-1 shadow-md">
                                                    <Clock className="w-3 h-3" /> Busy
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur-md border border-emerald-400/30 flex items-center gap-1 shadow-md">
                                                    ● Available
                                                </span>
                                            )}
                                        </div>

                                        {/* Specialization Badge */}
                                        <div className="absolute bottom-3 left-4">
                                            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/80 text-amber-400 border border-amber-500/30 backdrop-blur-md flex items-center gap-1">
                                                <Briefcase className="w-3 h-3" />
                                                {specialization}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Content Body */}
                                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                                                    {name}
                                                </h3>
                                                <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold shrink-0">
                                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                    <span>{rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-400">
                                                Licensed Attorney • {reviewsCount} Consultations
                                            </p>
                                        </div>

                                        {/* Pricing & CTA Action Footer */}
                                        <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                                            <div>
                                                <span className="text-xs text-slate-400 block">Consultation Fee</span>
                                                <p className="text-lg font-bold text-white flex items-center">
                                                    <DollarSign className="w-4 h-4 text-amber-500 -mr-0.5" />
                                                    {fee}
                                                    <span className="text-xs font-normal text-slate-400 ml-1">/ hr</span>
                                                </p>
                                            </div>

                                            <Link
                                                href={`/lawyers/${lawyerLink}`}
                                                className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-md shadow-amber-600/10"
                                            >
                                                View Details
                                            </Link>
                                        </div>

                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}

            </div>
        </section>
    );
}