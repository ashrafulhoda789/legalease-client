'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CheckCircle } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function HireButton({ lawyer, lawyerId }) {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const currentUser = session?.user;

    const [isHireModalOpen, setIsHireModalOpen] = useState(false);
    const [hireSuccess, setHireSuccess] = useState(false);
    const [submittingHire, setSubmittingHire] = useState(false);

    const handleHireClick = () => {
        if (!currentUser) {
            router.push(`/auth/signin?callbackUrl=/lawyers/${lawyerId}`);
            return;
        }
        setIsHireModalOpen(true);
    };

    const handleConfirmHire = async () => {
        setSubmittingHire(true);
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setSubmittingHire(false);
        setHireSuccess(true);
    };

    return (
        <>
            <button
                onClick={handleHireClick}
                disabled={lawyer.isBusy}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg ${
                    lawyer.isBusy
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                }`}
            >
                {lawyer.isBusy ? 'Not Available' : 'Hire Lawyer'}
            </button>

            {/* Modal */}
            {isHireModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
                        {!hireSuccess ? (
                            <>
                                <div className="text-center space-y-2">
                                    <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Confirm Hiring Request</h3>
                                    <p className="text-xs text-slate-400">
                                        You are about to send a legal consultation request to <span className="text-white font-semibold">{lawyer.name}</span>.
                                    </p>
                                </div>

                                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
                                    <div className="flex justify-between">
                                        <span>Hourly Consultation:</span>
                                        <span className="font-bold text-white">${lawyer.hourlyRate}/hr</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Initial Response Time:</span>
                                        <span className="font-bold text-emerald-400">Within 24 Hours</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsHireModalOpen(false)}
                                        className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmHire}
                                        disabled={submittingHire}
                                        className="w-1/2 bg-amber-600 hover:bg-amber-500 text-white py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center"
                                    >
                                        {submittingHire ? 'Sending...' : 'Confirm Request'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center space-y-4 py-4">
                                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Request Submitted!</h3>
                                <p className="text-xs text-slate-400">
                                    Your consultation request has been sent to <span className="text-white">{lawyer.name}</span>.
                                </p>
                                <button
                                    onClick={() => {
                                        setIsHireModalOpen(false);
                                        setHireSuccess(false);
                                        router.push('/dashboard');
                                    }}
                                    className="w-full bg-amber-600 hover:bg-amber-500 text-white py-2.5 rounded-xl text-sm font-bold transition-colors"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}