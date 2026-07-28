import React from 'react';
import LawyerList from '@/components/lawyer/LawyerList';
import { getLawyers } from '@/lib/api/lawyers';
import { getComments } from '@/lib/api/comments';

export default async function LawyersPage({ searchParams }) {
    // Next.js 15+ এ searchParams await করতে হয়
    const resolvedParams = await searchParams;

    const search = resolvedParams?.search || '';
    const category = resolvedParams?.category || 'All';
    const page = resolvedParams?.page || '1';

    // Query String তৈরি
    const query = new URLSearchParams({
        ...(search && { search }),
        ...(category !== 'All' && { category }),
        page
    }).toString();

    // Server-side fetching with URL Query
    const { lawyers = [], total = 0, totalPages = 1 } = await getLawyers(query);
    const comments = await getComments(lawyers?.map(l => l.email)) || [];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-3 max-w-2xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                        Find Experienced <span className="text-amber-500">Legal Experts</span>
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base">
                        Browse top-rated advocates and barristers. Shareable search & filter enabled.
                    </p>
                </div>

                {/* Client Container */}
                <LawyerList
                    lawyers={lawyers}
                    total={total}
                    totalPages={totalPages}
                    initialFilters={{ search, category, page: Number(page) }}
                />
            </div>
        </div>
    );
}