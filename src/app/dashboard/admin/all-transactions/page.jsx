import React from 'react';
import {
    Receipt,
    ArrowUpRight,
    DollarSign,
    Calendar,
    User,
    Mail,
    Hash,
    CheckCircle2
} from 'lucide-react';
import { getAllPayments } from '@/lib/api/payments';
import Pagination from '@/components/common/Pagination'; 
export default async function AllTransactionsPage({ searchParams }) {
  
    const params = await searchParams;
    const currentPage = Number(params?.page) || 1;
    const limit = 4; 

    const rawData = await getAllPayments();

    const transactions = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.data)
            ? rawData.data
            : [];

    const totalRevenue = transactions.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

    // Pagination Calculation
    const totalTransactions = transactions.length;
    const totalPages = Math.max(1, Math.ceil(totalTransactions / limit));

    // বর্তমান পেজের জন্য স্লাইস করা ডাটা
    const startIndex = (currentPage - 1) * limit;
    const paginatedTransactions = transactions.slice(startIndex, startIndex + limit);

    return (
        <div className="space-y-6 w-full max-w-350 mx-auto px-4 sm:px-6 py-6">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                        <Receipt className="w-6 h-6 text-amber-500 shrink-0" /> View All Transactions
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Monitor all successful payment history and platform revenue.
                    </p>
                </div>

                {/* Quick Summary Stat */}
                <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-3 self-start sm:self-auto">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                        <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Volume</p>
                        <p className="text-base font-bold text-white">${totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {transactions.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-3">
                    <Receipt className="w-12 h-12 text-slate-600 mx-auto" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">No Transactions Recorded</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        There are no payment records available in the database right now.
                    </p>
                </div>
            ) : (
                <>
                    {/* Mobile Card View (For small screens) */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {paginatedTransactions.map((tx) => (
                            <div
                                key={tx._id || tx.transactionId}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg"
                            >
                                <div className="flex justify-between items-start gap-2 border-b border-slate-800 pb-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                                            <Hash className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                            <span className="truncate max-w-[180px] font-medium text-slate-200">
                                                {tx.transactionId || tx._id}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        <CheckCircle2 className="w-3 h-3" /> Paid
                                    </span>
                                </div>

                                <div className="space-y-2 text-xs">
                                    {/* User Email */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-slate-500" /> Client:
                                        </span>
                                        <span className="text-slate-200 font-medium truncate max-w-[180px]">
                                            {tx.userEmail || 'N/A'}
                                        </span>
                                    </div>

                                    {/* Lawyer Email */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 flex items-center gap-1.5">
                                            <Mail className="w-3.5 h-3.5 text-amber-500/80" /> Lawyer:
                                        </span>
                                        <span className="text-slate-200 font-medium truncate max-w-[180px]">
                                            {tx.lawyerName || 'N/A'}
                                        </span>
                                    </div>

                                    {/* Amount & Date */}
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                                        <div className="flex items-center gap-1 text-slate-400">
                                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                            <span>
                                                {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                }) : 'N/A'}
                                            </span>
                                        </div>
                                        <span className="text-base font-bold text-emerald-400">
                                            ${Number(tx.price || 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="bg-slate-800/60 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                                    <tr>
                                        <th className="py-4 px-6">Transaction ID</th>
                                        <th className="py-4 px-6">Client</th>
                                        <th className="py-4 px-6">Lawyer</th>
                                        <th className="py-4 px-6">Amount</th>
                                        <th className="py-4 px-6 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {paginatedTransactions.map((tx) => (
                                        <tr key={tx._id || tx.transactionId} className="hover:bg-slate-800/30 transition-colors">
                                            {/* Transaction ID */}
                                            <td className="py-4 px-6 font-mono text-xs text-amber-500 font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    <Receipt className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                    <span className="truncate max-w-[160px]" title={tx.transactionId}>
                                                        {tx.transactionId || tx._id}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* User Email */}
                                            <td className="py-4 px-6 text-slate-200">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{tx.userName || 'User'}</span>
                                                    <span className="text-xs text-slate-400">{tx.userEmail || 'N/A'}</span>
                                                </div>
                                            </td>

                                            {/* Lawyer Email */}
                                            <td className="py-4 px-6 text-slate-200">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{tx.lawyerName || 'Lawyer'}</span>
                                                </div>
                                            </td>

                                            {/* Amount */}
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    ${Number(tx.price || 0).toFixed(2)}
                                                </span>
                                            </td>

                                            {/* Date */}
                                            <td className="py-4 px-6 text-right text-xs text-slate-400 whitespace-nowrap">
                                                <span className="inline-flex items-center justify-end gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                                    {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    }) : 'N/A'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination Component */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                </>
            )}
        </div>
    );
}