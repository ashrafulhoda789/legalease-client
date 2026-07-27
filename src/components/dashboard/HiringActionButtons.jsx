'use client';

import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateHiringRequest } from '@/lib/action/updateHiringRequest';

export default function HiringActionButtons({ requestId }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleStatusUpdate = async (status) => {
        try {
            setLoading(true);
            const res = await updateHiringRequest(requestId, status);
            if (res?.success) {
                router.refresh();
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <button
                disabled={loading}
                onClick={() => handleStatusUpdate('accepted')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-medium transition-all flex items-center gap-1 disabled:opacity-50"
            >
                <Check className="w-3.5 h-3.5" /> Accept
            </button>
            <button
                disabled={loading}
                onClick={() => handleStatusUpdate('rejected')}
                className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-medium transition-all flex items-center gap-1 disabled:opacity-50"
            >
                <X className="w-3.5 h-3.5" /> Reject
            </button>
        </div>
    );
}