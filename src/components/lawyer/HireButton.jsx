'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CheckCircle, Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { createHireRequest } from '@/lib/action/lawyer-hiring'; // 👈 Server Action Import

export default function HireButton({ lawyer, lawyerId }) {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const currentUser = session?.user;

    const [isHireModalOpen, setIsHireModalOpen] = useState(false);
    const [hireSuccess, setHireSuccess] = useState(false);
    const [submittingHire, setSubmittingHire] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleHireClick = () => {
        if (!currentUser) {
            router.push(`/auth/signin?callbackUrl=/lawyers/${lawyerId}`);
            return;
        }
        setIsHireModalOpen(true);
    };

    const handleConfirmHire = async () => {
        setSubmittingHire(true);
        setErrorMessage('');

        try {
            // Payload Prepare
            const payload = {
                userId: currentUser.id,
                userName: currentUser.name,
                userEmail: currentUser.email,
                lawyerId: lawyerId || lawyer?._id,
                lawyerName: lawyer?.name,
                lawyerSpecialization: lawyer?.specialization || lawyer?.lawyerSpecialization || 'General Legal',
                consultationFee: lawyer?.consultationFee || 0,
            };

            const res = await createHireRequest(payload);

            if (res?.success || res?.insertedId) {
                setHireSuccess(true);
            } else {
                setErrorMessage(res?.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Failed to submit hire request:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
            setSubmittingHire(false);
        }
    };

    return (
        <>
            <button
                onClick={handleHireClick}
                disabled={lawyer?.isBusy}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg ${lawyer?.isBusy
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                    }`}
            >
                {lawyer?.isBusy ? 'Not Available' : 'Hire Lawyer'}
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
                                        You are about to send a legal consultation request to <span className="text-white font-semibold">{lawyer?.name}</span>.
                                    </p>
                                </div>

                                {errorMessage && (
                                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center">
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
                                    <div className="flex justify-between">
                                        <span>Hourly Consultation:</span>
                                        <span className="font-bold text-white">${lawyer?.consultationFee}/hr</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Initial Response Time:</span>
                                        <span className="font-bold text-emerald-400">Within 24 Hours</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsHireModalOpen(false)}
                                        disabled={submittingHire}
                                        className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmHire}
                                        disabled={submittingHire}
                                        className="w-1/2 bg-amber-600 hover:bg-amber-500 text-white py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                                    >
                                        {submittingHire ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                                            </>
                                        ) : (
                                            'Confirm Request'
                                        )}
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
                                    Your consultation request has been sent to <span className="text-white font-medium">{lawyer?.name}</span>.
                                </p>
                                <button
                                    onClick={() => {
                                        setIsHireModalOpen(false);
                                        setHireSuccess(false);
                                        router.push('/dashboard/user/hiring-history');
                                    }}
                                    className="w-full bg-amber-600 hover:bg-amber-500 text-white py-2.5 rounded-xl text-sm font-bold transition-colors"
                                >
                                    Go to Hiring History
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}