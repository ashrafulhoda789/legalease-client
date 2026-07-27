import { Calendar, Clock } from 'lucide-react';
import HiringActionButtons from '@/components/dashboard/HiringActionButtons';
import { getHiringRequest } from '@/lib/api/hiring-request';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function HiringHistoryPage() {

    const session = await auth.api.getSession({
        headers: await headers()
    });
    const userEmail = session?.user?.email;

    let requests = [];

    if (userEmail) {
        const res = await getHiringRequest(userEmail);
        if (res?.success) {
            requests = res.data || [];
        }
    }

    return (
        <div className="p-3 sm:p-6 max-w-350 mx-auto space-y-4 sm:space-y-6">
            {/* Header Section */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Hiring Requests</h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">Manage client requests sent to your profile</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
                {requests.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-xs sm:text-sm">No hiring requests found.</div>
                ) : (
                    <>
                        {/* 1. Mobile Card Layout (Specifically optimized for 375px & smaller screens) */}
                        <div className="block md:hidden divide-y divide-slate-800">
                            {requests.map((item) => (
                                <div key={item._id} className="p-3.5 space-y-3">
                                    {/* User Details Header */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-500 font-bold text-xs uppercase shrink-0">
                                                {item.userName ? item.userName.charAt(0) : 'U'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-white font-medium text-xs sm:text-sm truncate">
                                                    {item.userName || 'Anonymous User'}
                                                </p>
                                                <p className="text-[11px] text-slate-400 truncate break-all max-w-[170px] xs:max-w-[200px]">
                                                    {item.userEmail}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 capitalize shrink-0 ${item.status === 'accepted'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : item.status === 'rejected'
                                                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                }`}
                                        >
                                            {item.status === 'pending' && <Clock className="w-2.5 h-2.5 inline" />}
                                            {item.status || 'pending'}
                                        </span>
                                    </div>

                                    {/* Date & Actions Row */}
                                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                            <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                                            <span className="truncate">
                                                {item.hiringDate || new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="shrink-0">
                                            {item.status === 'pending' ? (
                                                <HiringActionButtons requestId={item._id} />
                                            ) : (
                                                <span className="text-[11px] text-slate-500 italic">No actions</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 2. Desktop Table Layout (Visible on md+ screens) */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                                        <th className="p-4">Client Name</th>
                                        <th className="p-4">Request Date</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-sm text-slate-200">
                                    {requests.map((item) => (
                                        <tr key={item._id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="p-4 font-medium flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-500 font-bold uppercase shrink-0">
                                                    {item.userName ? item.userName.charAt(0) : 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{item.userName || 'Anonymous User'}</p>
                                                    <p className="text-xs text-slate-400">{item.userEmail}</p>
                                                </div>
                                            </td>

                                            <td className="p-4 text-slate-400">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4 text-slate-500" />
                                                    {item.hiringDate || new Date(item.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 capitalize ${item.status === 'accepted'
                                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                            : item.status === 'rejected'
                                                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                        }`}
                                                >
                                                    {item.status === 'pending' && <Clock className="w-3 h-3 inline" />}
                                                    {item.status || 'pending'}
                                                </span>
                                            </td>

                                            <td className="p-4 text-right">
                                                {item.status === 'pending' ? (
                                                    <HiringActionButtons requestId={item._id} />
                                                ) : (
                                                    <span className="text-xs text-slate-500 italic">No actions needed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}