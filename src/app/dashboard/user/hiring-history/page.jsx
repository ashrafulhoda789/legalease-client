import React from 'react';
import { Clock, CheckCircle2, XCircle, Briefcase, Calendar, DollarSign, Scale } from 'lucide-react';
import { getHiringHistory } from '@/lib/api/hiring-history';
import { authClient } from '@/lib/auth-client';
import { headers } from 'next/headers';

export default async function HiringHistoryPage() {

    const session = await authClient.getSession({
        fetchOptions: {
            headers: await headers()
        }
    })

    console.log(session);

    const userEmail = session?.data?.user?.email;

    const history = await getHiringHistory(userEmail) || [];
    console.log(history);

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                    </span>
                );
            default: // pending
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Scale className="w-6 h-6 text-amber-500" /> Hiring History
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Track all your legal consultation requests and their current status.
                </p>
            </div>

            {/* Table / Card List */}
            {!history || history.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                    <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
                    <h3 className="text-lg font-semibold text-white">No Hiring Requests Found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        You haven&apos;t sent any consultation requests to lawyers yet.
                    </p>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-800/60 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                                <tr>
                                    <th className="py-4 px-6">Lawyer Name</th>
                                    <th className="py-4 px-6">Specialisation</th>
                                    <th className="py-4 px-6">Consultation Fee</th>
                                    <th className="py-4 px-6">Hiring Date</th>
                                    <th className="py-4 px-6 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {history.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-800/30 transition-colors">
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
                                                {item.hiringDate || new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {getStatusBadge(item.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}