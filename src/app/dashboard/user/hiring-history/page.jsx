import React from 'react';
import Link from 'next/link';
import { Clock, CheckCircle2, XCircle, Briefcase, Calendar, DollarSign, Scale, CreditCard } from 'lucide-react';
import { getHiringHistory } from '@/lib/api/hiring-history';
import { authClient } from '@/lib/auth-client';
import { headers } from 'next/headers';
import Pagination from '@/components/common/Pagination'; 

export default async function HiringHistoryPage({ searchParams }) {
    
    const params = await searchParams;
    const currentPage = Number(params?.page) || 1;
    const ITEMS_PER_PAGE = 10; 

    const session = await authClient.getSession({
        fetchOptions: {
            headers: await headers()
        }
    });

    const userEmail = session?.data?.user?.email;

    const rawData = userEmail ? await getHiringHistory(userEmail) : [];

    // Safety check for array rendering
    const allHistory = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.data)
            ? rawData.data
            : [];

    // 2. Pagination Calculation
    const totalItems = allHistory.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const history = allHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                    </span>
                );
            default: // pending
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6 w-full max-w-360 mx-auto px-1 sm:px-0">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0" /> Hiring History
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                    Track all your legal consultation requests and their current status.
                </p>
            </div>

            {/* Empty State */}
            {allHistory.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-3">
                    <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600 mx-auto" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">No Hiring Requests Found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        You haven&apos;t sent any consultation requests to lawyers yet.
                    </p>
                </div>
            ) : (
                <>
                    {/* Mobile View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {history.map((item) => {
                            const isAccepted = item.status?.toLowerCase() === 'accepted';
                            return (
                                <div
                                    key={item._id || item.id}
                                    className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg"
                                >
                                    <div className="flex justify-between items-start gap-2 border-b border-slate-800/80 pb-3">
                                        <div>
                                            <h3 className="font-bold text-white text-base">
                                                {item.lawyerName || 'N/A'}
                                            </h3>
                                            <p className="text-amber-500/90 text-xs font-medium mt-0.5">
                                                {item.specialization || item.lawyerSpecialization || 'General Legal'}
                                            </p>
                                        </div>
                                        <div>
                                            {getStatusBadge(item.status)}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                                        <div className="flex items-center gap-1 font-semibold text-slate-200">
                                            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{item.fee || item.consultationFee || 0} / hr</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                            <span>{item.hiringDate || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A')}</span>
                                        </div>
                                    </div>

                                    {/* Pay Button for Mobile */}
                                    {isAccepted && (
                                        <div className="pt-2 border-t border-slate-800/60">
                                            {item.paymentStatus === 'paid' ? (
                                                <button
                                                    disabled
                                                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed"
                                                >
                                                    ✓ Paid
                                                </button>
                                            ) : (
                                                <Link
                                                    href={`/checkout?id=${item._id || item.id}`}
                                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-md"
                                                >
                                                    <CreditCard className="w-4 h-4" /> Pay Now
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="bg-slate-800/60 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                                    <tr>
                                        <th className="py-4 px-6">Lawyer Name</th>
                                        <th className="py-4 px-6">Specialisation</th>
                                        <th className="py-4 px-6">Consultation Fee</th>
                                        <th className="py-4 px-6">Hiring Date</th>
                                        <th className="py-4 px-6 text-center">Status</th>
                                        <th className="py-4 px-6 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {history.map((item) => {
                                        const isAccepted = item.status?.toLowerCase() === 'accepted';
                                        return (
                                            <tr key={item._id || item.id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="py-4 px-6 font-semibold text-white">
                                                    {item.lawyerName || 'N/A'}
                                                </td>
                                                <td className="py-4 px-6 text-amber-500/90 font-medium">
                                                    {item.specialization || item.lawyerSpecialization || 'General Legal'}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="inline-flex items-center text-slate-200 font-semibold">
                                                        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                                                        {item.fee || item.consultationFee || 0}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-slate-400 text-xs">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                                        {item.hiringDate || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A')}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    {getStatusBadge(item.status)}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    {item.paymentStatus === 'paid' ? (
                                                        <button
                                                            disabled
                                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed"
                                                        >
                                                            ✓ Paid
                                                        </button>
                                                    ) : isAccepted ? (
                                                        <form action="/api/checkout_sessions" method="POST">
                                                            <input type="hidden" name="hiringId" value={item._id || item.id} />
                                                            <input type="hidden" name="fee" value={item.fee || item.consultationFee || 0} />
                                                            <input type="hidden" name="lawyerName" value={item.lawyerName || 'Lawyer'} />

                                                            <button
                                                                type="submit"
                                                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-sm cursor-pointer"
                                                            >
                                                                Pay Now
                                                            </button>
                                                        </form>
                                                    ) : (
                                                        <span className="text-xs text-slate-500 italic">N/A</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 3. Pagination Control */}
                    <div className="pt-2">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                        />
                    </div>
                </>
            )}
        </div>
    );
}