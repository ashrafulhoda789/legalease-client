'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Building2,
    ShieldAlert,
    Users,
    Lightbulb,
    Home,
    Receipt,
    ArrowRight,
    Sparkles
} from 'lucide-react';

const CATEGORIES = [
    {
        id: 'corporate',
        title: 'Corporate & Business Law',
        slug: 'Corporate',
        description: 'Company formation, contract disputes, mergers, and corporate governance.',
        icon: Building2,
        count: '120+ Lawyers',
        color: 'from-blue-500/20 to-cyan-500/10',
        borderColor: 'hover:border-blue-500/50',
        iconColor: 'text-blue-400'
    },
    {
        id: 'criminal',
        title: 'Criminal Defense',
        slug: 'Criminal',
        description: 'Bail representation, white-collar crimes, litigation, and defense services.',
        icon: ShieldAlert,
        count: '85+ Lawyers',
        color: 'from-rose-500/20 to-red-500/10',
        borderColor: 'hover:border-rose-500/50',
        iconColor: 'text-rose-400'
    },
    {
        id: 'family',
        title: 'Family & Divorce Law',
        slug: 'Family',
        description: 'Child custody, divorce settlements, adoption, and family dispute resolution.',
        icon: Users,
        count: '95+ Lawyers',
        color: 'from-amber-500/20 to-orange-500/10',
        borderColor: 'hover:border-amber-500/50',
        iconColor: 'text-amber-400'
    },
    {
        id: 'ip',
        title: 'Intellectual Property',
        slug: 'IP',
        description: 'Trademarks, patents, copyright protection, and technology law advisory.',
        icon: Lightbulb,
        count: '60+ Lawyers',
        color: 'from-purple-500/20 to-indigo-500/10',
        borderColor: 'hover:border-purple-500/50',
        iconColor: 'text-purple-400'
    },
    {
        id: 'real-estate',
        title: 'Real Estate & Property',
        slug: 'RealEstate',
        description: 'Property verification, land disputes, leasing agreements, and registration.',
        icon: Home,
        count: '75+ Lawyers',
        color: 'from-emerald-500/20 to-teal-500/10',
        borderColor: 'hover:border-emerald-500/50',
        iconColor: 'text-emerald-400'
    },
    {
        id: 'tax',
        title: 'Tax & Financial Advisory',
        slug: 'Tax',
        description: 'Tax planning, audit assistance, corporate tax compliance, and wealth management.',
        icon: Receipt,
        count: '50+ Lawyers',
        color: 'from-yellow-500/20 to-amber-500/10',
        borderColor: 'hover:border-yellow-500/50',
        iconColor: 'text-yellow-400'
    }
];

export default function LegalCategories() {

    // Framer Motion Staggered Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 25 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <section className="py-20 bg-slate-900 relative">
            <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        Legal Practice Areas
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                        Explore Lawyers by Specialization
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base">
                        Select a practice area to find certified legal consultants tailored to your specific requirements.
                    </p>
                </div>

                {/* Categories Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <motion.div key={cat.id} variants={cardVariants}>
                                <Link
                                    href={`/lawyers?category=${encodeURIComponent(cat.slug)}`}
                                    className={`block h-full bg-slate-800/60 border border-slate-700/70 ${cat.borderColor} rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:bg-slate-800/90 group flex flex-col justify-between`}
                                >
                                    <div>
                                        {/* Top Header: Icon & Lawyer Count */}
                                        <div className="flex items-center justify-between mb-5">
                                            <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${cat.color} border border-slate-700 ${cat.iconColor}`}>
                                                <Icon className="w-7 h-7" />
                                            </div>
                                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300">
                                                {cat.count}
                                            </span>
                                        </div>

                                        {/* Title & Description */}
                                        <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
                                            {cat.title}
                                        </h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            {cat.description}
                                        </p>
                                    </div>

                                    {/* Footer Link Action */}
                                    <div className="pt-6 mt-4 border-t border-slate-700/40 flex items-center gap-2 text-sm font-semibold text-amber-500 group-hover:text-amber-400">
                                        <span>Find {cat.slug} Lawyers</span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
}