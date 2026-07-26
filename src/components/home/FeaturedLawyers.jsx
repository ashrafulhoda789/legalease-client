'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, DollarSign, Clock, Briefcase } from 'lucide-react';

// Mock Data for Lawyers (Pore GET /api/lawyers/featured API call er response diye replace hobe)
const MOCK_FEATURED_LAWYERS = [
    {
        _id: "1",
        name: "Adv. Sarah Rahman",
        specialization: "Corporate Law",
        fee: 120,
        status: "Available",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
        rating: 4.9,
        reviewsCount: 28
    },
    {
        _id: "2",
        name: "Adv. Tanvir Hossain",
        specialization: "Criminal Defense",
        fee: 150,
        status: "Busy",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
        rating: 4.8,
        reviewsCount: 34
    },
    {
        _id: "3",
        name: "Adv. Nusrat Jahan",
        specialization: "Family & Divorce",
        fee: 95,
        status: "Available",
        image: "https://images.unsplash.com/photo-1580894732468-058f747280f2?q=80&w=400&auto=format&fit=crop",
        rating: 5.0,
        reviewsCount: 19
    },
    {
        _id: "4",
        name: "Adv. Rafiqul Islam",
        specialization: "Intellectual Property",
        fee: 180,
        status: "Available",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        rating: 4.7,
        reviewsCount: 42
    },
    {
        _id: "5",
        name: "Adv. Mahbub Alam",
        specialization: "Real Estate & Property",
        fee: 110,
        status: "Busy",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
        rating: 4.9,
        reviewsCount: 15
    },
    {
        _id: "6",
        name: "Adv. Farhana Ahmed",
        specialization: "Tax & Finance",
        fee: 130,
        status: "Available",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop",
        rating: 4.8,
        reviewsCount: 22
    }
];

export default function FeaturedLawyers() {
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // DB or API Simulation: Reload e random shuffle or latest 6 data fetch
        const fetchFeaturedLawyers = async () => {
            setLoading(true);
            try {
                /* 
                  Backend Connection Point:
                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lawyers/featured`);
                  const data = await res.json();
                  setLawyers(data);
                */

                // Temporary Randomization on reload demo:
                setTimeout(() => {
                    const shuffled = [...MOCK_FEATURED_LAWYERS].sort(() => 0.5 - Math.random());
                    setLawyers(shuffled.slice(0, 6));
                    setLoading(false);
                }, 800);

            } catch (error) {
                console.error("Failed to load featured lawyers:", error);
                setLoading(false);
            }
        };

        fetchFeaturedLawyers();
    }, []);

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
                        {lawyers.map((lawyer) => (
                            <motion.div
                                key={lawyer._id}
                                variants={cardVariants}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                className="bg-slate-800/80 border border-slate-700/70 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col group"
                            >
                                {/* Image & Status Badge Header */}
                                <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                                    <img
                                        src={lawyer.image}
                                        alt={lawyer.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                                    {/* Status Badge (Available / Busy) */}
                                    <div className="absolute top-4 right-4">
                                        {lawyer.status === "Busy" ? (
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
                                            {lawyer.specialization}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Content Body */}
                                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                                                {lawyer.name}
                                            </h3>
                                            <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
                                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                <span>{lawyer.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400">
                                            Licensed Attorney • {lawyer.reviewsCount} Consultations
                                        </p>
                                    </div>

                                    {/* Pricing & CTA Action Footer */}
                                    <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                                        <div>
                                            <span className="text-xs text-slate-400 block">Consultation Fee</span>
                                            <p className="text-lg font-bold text-white flex items-center">
                                                <DollarSign className="w-4 h-4 text-amber-500 -mr-0.5" />
                                                {lawyer.fee}
                                                <span className="text-xs font-normal text-slate-400 ml-1">/ hr</span>
                                            </p>
                                        </div>

                                        <Link
                                            href={`/lawyers/${lawyer._id}`}
                                            className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-md shadow-amber-600/10"
                                        >
                                            View Details
                                        </Link>
                                    </div>

                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

            </div>
        </section>
    );
}