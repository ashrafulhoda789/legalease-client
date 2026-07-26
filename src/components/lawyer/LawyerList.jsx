'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Star, DollarSign, ShieldAlert, ArrowRight } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

export default function LawyerList({ lawyers = [] }) {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Array Validation & Fallback Handling
    const lawyerArray = Array.isArray(lawyers)
        ? lawyers
        : (Array.isArray(lawyers?.data) ? lawyers.data : []);

    // Filter Logic
    const filteredLawyers = lawyerArray.filter((lawyer) => {
        // Flat or Aggregated/Nested schema compatibility
        const name = lawyer?.name || lawyer?.user?.name || '';
        const specialization = lawyer?.specialization || lawyer?.profile?.specialization || '';

        const matchesSearch =
            name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            specialization.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategory === 'All' || specialization.toLowerCase().includes(selectedCategory.toLowerCase());

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8">
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
                        <option value="Cyber">Cyber & IP Law</option>
                    </select>
                </div>
            </div>

            {/* Empty State Handler */}
            {filteredLawyers.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto my-12">
                    <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">No Lawyers Found</h3>
                    <p className="text-slate-400 text-sm">
                        We couldn&apos;t find any legal experts matching your search criteria. Try resetting your search or filter options.
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('All');
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm px-5 py-2 rounded-xl transition-colors"
                    >
                        Reset Filters
                    </button>
                </div>
            ) : (
                /* Responsive Grid View */
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filteredLawyers.map((lawyer) => {
                        const targetId = lawyer?._id || lawyer?.user?._id;
                        const name = lawyer?.name || lawyer?.user?.name || 'Unnamed Lawyer';
                        const avatarSrc =  lawyer?.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250';
                        const specialization = lawyer?.profile?.specialization || lawyer?.specialization || 'General Practitioner';
                        const consultationFee = lawyer?.consultationFee || '0';
                        const status = lawyer?.status || 'Available';
                        const isBusy = status === 'Busy' || lawyer?.isBusy || false;

                        return (
                            <div
                                key={targetId}
                                className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer relative overflow-hidden"
                            >
                                {/* Busy Badge */}
                                {isBusy && (
                                    <div className="absolute top-3 right-3 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full z-10">
                                        Busy
                                    </div>
                                )}

                                <div className="space-y-3 text-center">
                                    {/* Avatar Image */}
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
                                        <img
                                            src={avatarSrc}
                                            alt={name}
                                            className="w-full h-full object-cover rounded-full border-2 border-slate-700 group-hover:border-amber-500 transition-colors"
                                        />
                                    </div>

                                    {/* Name & Specialization */}
                                    <div>
                                        <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                                            {name}
                                        </h3>
                                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                                            {specialization}
                                        </p>
                                    </div>

                                    {/* Consultation Fee & Rating */}
                                    <div className="bg-slate-800/60 rounded-xl p-2 flex items-center justify-around text-xs border border-slate-800">
                                        <div className="flex items-center gap-1 text-slate-300">
                                            <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                                            <span className="font-semibold text-white">{consultationFee}</span>/hr
                                        </div>
                                        <div className="w-px h-3 bg-slate-700"></div>
                                        <div className="flex items-center gap-1 text-amber-400 font-semibold">
                                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                                            {lawyer?.rating || '5.0'}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons Section */}
                                <div className="mt-4 space-y-2 pt-2 border-t border-slate-800/80">
                                    <Link
                                        href={`/lawyers/${lawyer?.email || lawyer?.user?.email || targetId}`}
                                        className={`w-full py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${isBusy
                                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed pointer-events-none'
                                                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20'
                                            }`}
                                    >
                                        {isBusy ? 'Not Available' : 'Consult Now'}
                                        {!isBusy && <ArrowRight className="w-3.5 h-3.5" />}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}