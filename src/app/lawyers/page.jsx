import React from 'react';
import { getUserList } from '@/lib/api/users';
import LawyerList from '@/components/lawyer/LawyerList';
import { getLawyers } from '@/lib/api/lawyers';


export default async function LawyersPage() {

    const lawyers = await getLawyers() || [];
    // console.log(lawyers);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="text-center space-y-3 max-w-2xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                        Find Experienced <span className="text-amber-500">Legal Experts</span>
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base">
                        Browse top-rated advocates and barristers. Book consultations seamlessly with verified professionals.
                    </p>
                </div>

                <LawyerList lawyers={lawyers} />

            </div>
        </div>
    );
}