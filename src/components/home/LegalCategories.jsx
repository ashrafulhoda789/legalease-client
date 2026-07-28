'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Building2,
    ShieldAlert,
    Users,
    ShieldCheck,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { getCategory } from '@/lib/api/categories';


const CATEGORIES = [
    {
        id: 'corporate-tax',
        title: 'Corporate & Tax Law',
        slug: 'Corporate', 
        matchKeys: ['Corporate & Tax', 'Licensed Attorney', 'Corporate'],
        description: 'Company formation, tax planning, contract disputes, and corporate governance.',
        icon: Building2,
        color: 'from-blue-500/20 to-cyan-500/10',
        borderColor: 'hover:border-blue-500/50',
        iconColor: 'text-blue-400'
    },
    {
        id: 'criminal-law',
        title: 'Criminal Law',
        slug: 'Criminal', 
        matchKeys: ['Criminal Law', 'Criminal Defense Expert', 'Criminal'],
        description: 'Bail representation, white-collar crimes, litigation, and criminal defense.',
        icon: ShieldAlert,
        color: 'from-rose-500/20 to-red-500/10',
        borderColor: 'hover:border-rose-500/50',
        iconColor: 'text-rose-400'
    },
    {
        id: 'family-property',
        title: 'Family & Property',
        slug: 'Family', 
        matchKeys: ['Family & Property', 'Family', 'Property'],
        description: 'Child custody, divorce, property verification, land disputes, and registration.',
        icon: Users,
        color: 'from-amber-500/20 to-orange-500/10',
        borderColor: 'hover:border-amber-500/50',
        iconColor: 'text-amber-400'
    },
    {
        id: 'cyber-ip',
        title: 'Cyber & IP Law',
        slug: 'Cyber', 
        matchKeys: ['Cyber & IP Law', 'Cyber', 'IP Law'],
        description: 'Trademarks, patents, cyber crime defense, and technology law advisory.',
        icon: ShieldCheck,
        color: 'from-purple-500/20 to-indigo-500/10',
        borderColor: 'hover:border-purple-500/50',
        iconColor: 'text-purple-400'
    }
];

export default function LegalCategories() {
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryCounts = async () => {
            setLoading(true);
            try {
                const data = await getCategory();
                setCounts(data || {});
            } catch (error) {
                console.error("Error fetching category counts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryCounts();
    }, []);

    const getLawyerCount = (matchKeys = []) => {
        if (!counts || Object.keys(counts).length === 0) return 0;

        let total = 0;
        matchKeys.forEach(key => {
            if (counts[key]) {
                total += counts[key];
            }
        });
        return total;
    };

    // Framer Motion Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 25 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <section className="py-20 bg-slate-900 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
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
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;

                        // ডাইনামিক কাউন্ট হিসাব
                        const lawyerCount = getLawyerCount(cat.matchKeys);

                        return (
                            <motion.div key={cat.id} variants={cardVariants}>
                                <Link
                                    href={`/lawyers?category=${encodeURIComponent(cat.slug)}`}
                                    className={`block h-full bg-slate-800/60 border border-slate-700/70 ${cat.borderColor} rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:bg-slate-800/90 group flex flex-col justify-between`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-5">
                                            <div className={`p-3 rounded-2xl bg-gradient-to-br ${cat.color} border border-slate-700 ${cat.iconColor}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300">
                                                {loading ? '...' : `${lawyerCount} ${lawyerCount === 1 ? 'Lawyer' : 'Lawyers'}`}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
                                            {cat.title}
                                        </h3>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            {cat.description}
                                        </p>
                                    </div>

                                    <div className="pt-5 mt-4 border-t border-slate-700/40 flex items-center gap-2 text-xs font-semibold text-amber-500 group-hover:text-amber-400">
                                        <span>Find Lawyers</span>
                                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1.5" />
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