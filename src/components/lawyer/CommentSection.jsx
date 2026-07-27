'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquare, Send, User, Lock, Star, Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function CommentSection({ lawyerId, initialComments = [], isHired: initialIsHired }) {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const currentUser = session?.user;

    const [commentText, setCommentText] = useState('');
    const [rating, setRating] = useState(5);
    const [commentsList, setCommentsList] = useState(initialComments);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-checking hiring status if not explicitly passed from parent
    const [isHired, setIsHired] = useState(initialIsHired ?? false);
    const [checkingHiredStatus, setCheckingHiredStatus] = useState(initialIsHired === undefined);

    // Initial Comments আপডেট হলে স্টেট আপডেট করা
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCommentsList(initialComments);
    }, [initialComments]);

    // Parent থেকে isHired চেঞ্জ হলে তা সিঙ্ক করা
    useEffect(() => {
        if (initialIsHired !== undefined) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsHired(initialIsHired);
            setCheckingHiredStatus(false);
        }
    }, [initialIsHired]);

    // Parent যদি isHired না পাঠায়, তবে Client-side থেকে Hire Status চেক করা
    useEffect(() => {
        const checkHiredStatus = async () => {
            if (initialIsHired !== undefined || !currentUser?.email || !lawyerId) {
                setCheckingHiredStatus(false);
                return;
            }

            try {
                // আপনার Appointments / Bookings API endpoint অনুযায়ী URL টি চেক করতে পারেন
                const res = await fetch(`/api/appointments/check-hired?userEmail=${currentUser.email}&lawyerId=${lawyerId}`);
                const data = await res.json();

                if (data.success && data.isHired) {
                    setIsHired(true);
                }
            } catch (err) {
                console.error('Error verifying hire status:', err);
            } finally {
                setCheckingHiredStatus(false);
            }
        };

        checkHiredStatus();
    }, [currentUser, lawyerId, initialIsHired]);

    // New Comment Submit Handler
    const handleAddComment = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            router.push(`/auth/signin?callbackUrl=/lawyers/${lawyerId}`);
            return;
        }

        if (!isHired) {
            alert('You can only review or comment on lawyers you have hired.');
            return;
        }

        if (!commentText.trim()) return;

        setIsSubmitting(true);

        try {
            // 🚀 Backend API Call
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: currentUser.email,
                    userName: currentUser.name || 'Anonymous User',
                    userPhoto: currentUser.image || '',
                    lawyerId: lawyerId,
                    commentText: commentText,
                    rating: rating,
                }),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                // Dynamically update UI list
                const newCommentObj = {
                    _id: result.insertedId || Date.now().toString(),
                    userName: currentUser.name || 'Anonymous User',
                    userEmail: currentUser.email,
                    commentText: commentText,
                    rating: rating,
                    createdAt: new Date().toISOString(),
                };

                setCommentsList([newCommentObj, ...commentsList]);
                setCommentText('');
                setRating(5);
            } else {
                alert(result.message || 'Failed to post comment.');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Something went wrong while posting your review.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" /> Client Reviews & Consultation Feedback
            </h2>

            {/* 🔄 Loading State while verifying Hire Status */}
            {checkingHiredStatus ? (
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-amber-500" /> Checking eligibility...
                </div>
            ) : !isHired ? (
                /* 🔒 RESTRICTED LOCK SCREEN */
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
                        <Lock className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-white">Review Section Restricted</h3>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                            Only clients who have officially hired or consulted with this lawyer are allowed to post comments and reviews.
                        </p>
                    </div>

                    {!currentUser && (
                        <p className="text-xs text-slate-400 pt-2">
                            Already hired? Please{' '}
                            <Link href={`/auth/signin?callbackUrl=/lawyers/${lawyerId}`} className="text-amber-500 underline font-semibold">
                                Sign In
                            </Link>{' '}
                            to post your review.
                        </p>
                    )}
                </div>
            ) : (
                /* ✍️ UNLOCKED COMMENT FORM */
                <form onSubmit={handleAddComment} className="space-y-4 bg-slate-950/50 p-4 sm:p-5 rounded-2xl border border-slate-800">
                    {/* Rating Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-400">Your Rating:</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="hover:scale-110 transition-transform"
                                >
                                    <Star
                                        className={`w-4 h-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <textarea
                        rows={3}
                        placeholder="Share your consultation experience with this lawyer..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-amber-500 placeholder:text-slate-500 transition-colors"
                    />

                    <div className="flex justify-between items-center">
                        <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                            ✓ Verified Client
                        </span>
                        <button
                            type="submit"
                            disabled={!commentText.trim() || isSubmitting}
                            className="bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors ml-auto cursor-pointer"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            Post Comment
                        </button>
                    </div>
                </form>
            )}

            {/* 💬 ALL REVIEWS LIST */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-semibold text-slate-300">
                    Reviews ({commentsList.length})
                </h3>

                {commentsList.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">
                        No reviews yet. Be the first to share your experience!
                    </p>
                ) : (
                    commentsList.map((c, index) => (
                        <div key={c._id || c.id || index} className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs border border-amber-500/20">
                                        {c.userName ? c.userName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-white block">
                                            {c.userName || c.user?.name || 'Anonymous User'}
                                        </span>
                                        <div className="flex items-center gap-0.5 mt-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-3 h-3 ${i < (c.rating || 5)
                                                            ? 'text-amber-400 fill-amber-400'
                                                            : 'text-slate-700'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[11px] text-slate-500">
                                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : c.date || 'Recent'}
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-300 pl-10 leading-relaxed">
                                {c.commentText || c.text || c.content}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}