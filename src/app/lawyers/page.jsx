'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Filter, Star, Briefcase, DollarSign, MessageSquare, ShieldAlert, ArrowRight } from 'lucide-react';
import { authClient } from '@/lib/auth-client'; // আপনার authClient path চেক করে নেবেন

// Sample Mock Data (Backend API Integrate করার সময় এটি API response দিয়ে রিপ্লেস হবে)
const MOCK_LAWYERS = [
    {
        id: '1',
        name: 'Adv. Rahat Chowdhury',
        specialization: 'Corporate & Tax Law',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
        hourlyRate: 120,
        isBusy: false,
        rating: 4.9,
        totalCases: 142
    },
    {
        id: '2',
        name: 'Barrister Nusrat Jahan',
        specialization: 'Criminal & Civil Defense',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
        hourlyRate: 150,
        isBusy: true,
        rating: 4.8,
        totalCases: 98
    },
    {
        id: '3',
        name: 'Adv. Tariqul Islam',
        specialization: 'Family & Property Law',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        hourlyRate: 90,
        isBusy: false,
        rating: 4.7,
        totalCases: 85
    },
    {
        id: '4',
        name: 'Barrister Zayan Ahmed',
        specialization: 'Intellectual Property & Cyber Law',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        hourlyRate: 180,
        isBusy: false,
        rating: 5.0,
        totalCases: 210
    },
    {
        id: '5',
        name: 'Adv. Sharmin Sultana',
        specialization: 'Labour & Employment Law',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
        hourlyRate: 110,
        isBusy: true,
        rating: 4.6,
        totalCases: 64
    }
];

export default function LawyersPage() {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Simulate Backend API Fetching
    useEffect(() => {
        const fetchLawyers = async () => {
            setLoading(true);
            // 1.2s delay to showcase smooth skeleton loading
            await new Promise((resolve) => setTimeout(resolve, 1200));
            setLawyers(MOCK_LAWYERS);
            setLoading(false);
        };

        fetchLawyers();
    }, []);

    // Filter Logic
    const filteredLawyers = lawyers.filter((lawyer) => {
        const matchesSearch = lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lawyer.specialization.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || lawyer.specialization.includes(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    // Handle Authenticated Actions (Hire or Consult)
    const handleHireAction = (e, lawyerId) => {
        e.stopPropagation(); // Prevents card navigation event
        if (!session?.user) {
            // Redirect unauthenticated user to signin
            router.push(`/auth/signin?callbackUrl=/lawyers/${lawyerId}`);
        } else {
            router.push(`/lawyers/${lawyerId}/hire`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Page Header */}
                <div className="text-center space-y-3 max-w-2xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                        Find Experienced <span className="text-amber-500">Legal Experts</span>
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base">
                        Browse top-rated advocates and barristers. Book consultations seamlessly with verified professionals.
                    </p>
                </div>

                {/* Search & Filter Controls */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-1/2">
                        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            placeholder="Search by name or specialization..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-500"
                        />
                    </div>

                    {/* Category Filter Dropdown */}
                    <div className="relative w-full md:w-auto flex items-center gap-2">
                        <Filter className="w-4 h-4 text-amber-500 hidden sm:block" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full md:w-auto bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                            <option value="All">All Specializations</option>
                            <option value="Corporate">Corporate & Tax</option>
                            <option value="Criminal">Criminal Law</option>
                            <option value="Family">Family & Property</option>
                            <option value="Intellectual">Cyber & IP Law</option>
                        </select>
                    </div>
                </div>

                {/* Grid Section */}
                {loading ? (
                    // Skeleton Loading View
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 animate-pulse space-y-4">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-slate-800"></div>
                                <div className="space-y-2 text-center">
                                    <div className="h-4 bg-slate-800 rounded w-3/4 mx-auto"></div>
                                    <div className="h-3 bg-slate-800/60 rounded w-1/2 mx-auto"></div>
                                </div>
                                <div className="h-8 bg-slate-800/80 rounded-xl w-full pt-2"></div>
                                <div className="h-9 bg-slate-800 rounded-xl w-full"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredLawyers.length === 0 ? (
                    // Friendly Empty State
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto my-12">
                        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto">
                            <ShieldAlert className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white">No Lawyers Found</h3>
                        <p className="text-slate-400 text-sm">
                            We couldn&apos;t find any legal experts matching your search criteria. Try resetting your search or filter options.
                        </p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm px-5 py-2 rounded-xl transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    // Responsive Grid View (Mobile: 2 cols, Tablet: 3 cols, Desktop: 4 cols)
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {filteredLawyers.map((lawyer) => (
                            <div
                                key={lawyer.id}
                                onClick={() => router.push(`/lawyers/${lawyer.id}`)}
                                className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer relative overflow-hidden"
                            >
                                {/* Busy Badge Header */}
                                {lawyer.isBusy && (
                                    <div className="absolute top-3 right-3 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full">
                                        Busy
                                    </div>
                                )}

                                <div className="space-y-3 text-center">
                                    {/* Avatar */}
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
                                        <img
                                            src={lawyer.avatar}
                                            alt={lawyer.name}
                                            className="w-full h-full object-cover rounded-full border-2 border-slate-700 group-hover:border-amber-500 transition-colors"
                                        />
                                    </div>

                                    {/* Name & Specialization */}
                                    <div>
                                        <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                                            {lawyer.name}
                                        </h3>
                                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                                            {lawyer.specialization}
                                        </p>
                                    </div>

                                    {/* Hourly Rate & Rating */}
                                    <div className="bg-slate-800/60 rounded-xl p-2 flex items-center justify-around text-xs border border-slate-800">
                                        <div className="flex items-center gap-1 text-slate-300">
                                            <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                                            <span className="font-semibold text-white">${lawyer.hourlyRate}</span>/hr
                                        </div>
                                        <div className="w-px h-3 bg-slate-700"></div>
                                        <div className="flex items-center gap-1 text-amber-400 font-semibold">
                                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                                            {lawyer.rating}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Action Section */}
                                <div className="mt-4 space-y-2 pt-2 border-t border-slate-800/80">
                                    <button
                                        onClick={(e) => handleHireAction(e, lawyer.id)}
                                        disabled={lawyer.isBusy}
                                        className={`w-full py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${lawyer.isBusy
                                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20'
                                            }`}
                                    >
                                        {lawyer.isBusy ? 'Not Available' : 'Consult Now'}
                                        {!lawyer.isBusy && <ArrowRight className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}