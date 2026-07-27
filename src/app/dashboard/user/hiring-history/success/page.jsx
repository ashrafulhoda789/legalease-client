import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Mail, ShieldCheck, ArrowLeft, LayoutDashboard } from 'lucide-react'
import { createPayment } from '@/lib/action/payment'

export default async function Success({ searchParams }) {
    const { session_id } = await searchParams

    if (!session_id) {
        throw new Error('Please provide a valid session_id (`cs_test_...`)')
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'payment_intent']
    })

    const { status, customer_details, amount_total, metadata, id } = session
    const customerEmail = customer_details?.email

    if (status === 'open') {
        return redirect('/')
    }

    if (status === 'complete') {
        
        const paymentData = {
            userEmail: customerEmail,
            userName: customer_details?.name || 'Client',
            lawyerEmail: metadata?.lawyerEmail || 'N/A',
            lawyerName: metadata?.lawyerName || 'N/A',
            price: amount_total / 100, 
            transactionId: id,
            hiringId: metadata?.hiringId
        }

        try {
            await createPayment(paymentData);
        } catch (error) {
            console.error('Failed to save payment history:', error);
        }

        const formattedAmount = (amount_total / 100).toLocaleString('en-US', {
            style: 'currency',
            currency: session.currency?.toUpperCase() || 'USD'
        })

        return (
            <div className="min-h-[85vh] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[#111827] rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden">

                    {/* Header Banner */}
                    <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-6 text-center relative">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
                            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
                        <p className="text-slate-400 text-sm mt-1">Thank you for your trust & consultation fee.</p>
                    </div>

                    {/* Receipt Details Body */}
                    <div className="p-6 space-y-5">

                        {/* Transaction Breakdown */}
                        <div className="bg-[#0B0F19] rounded-xl p-4 border border-slate-800 space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Amount Paid</span>
                                <span className="font-bold text-amber-400 text-base">{formattedAmount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Order Reference</span>
                                <span className="font-mono text-xs text-slate-500 truncate max-w-[160px]" title={id}>
                                    {id}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Status</span>
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Paid
                                </span>
                            </div>
                        </div>

                        {/* Confirmation Email Box */}
                        <div className="flex items-start gap-3 bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60 text-slate-300 text-sm">
                            <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-xs leading-relaxed">
                                A receipt has been sent to{' '}
                                <span className="font-semibold text-white">{customerEmail}</span>.
                            </p>
                        </div>

                        {/* Support Info */}
                        <p className="text-xs text-center text-slate-500">
                            Questions? Email us at{' '}
                            <a href="mailto:support@legalease.com" className="text-amber-400 hover:underline">
                                support@legalease.com
                            </a>
                        </p>

                        {/* Action Buttons */}
                        <div className="pt-2 space-y-2.5">
                            <Link
                                href="/dashboard/user/hiring-history"
                                className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-2.5 px-4 rounded-xl transition duration-200 shadow-md text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" /> My Hiring Requests
                            </Link>

                    
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}