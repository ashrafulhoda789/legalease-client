'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquare, Send, User, Lock, ShieldAlert } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function CommentSection({ lawyerId, initialComments, isHired }) {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const currentUser = session?.user;

    const [commentText, setCommentText] = useState('');
    const [commentsList, setCommentsList] = useState(initialComments);

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

        const newCommentObj = {
            id: Date.now(),
            userName: currentUser.name || 'Anonymous User',
            text: commentText,
            date: 'Just now'
        };

        setCommentsList([newCommentObj, ...commentsList]);
        setCommentText('');
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" /> Client Reviews & Consultation Feedback
            </h2>

            {/* 🔒 IF USER IS NOT LOGGED IN OR HAS NOT HIRED THIS LAWYER */}
            {!isHired ? (
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
                /* ✍️ IF USER HAS HIRED THIS LAWYER - SHOW COMMENT FORM */
                <form onSubmit={handleAddComment} className="space-y-3">
                    <textarea
                        rows={3}
                        placeholder="Share your consultation experience with this lawyer..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-2xl p-4 focus:outline-none focus:border-amber-500 placeholder:text-slate-500 transition-colors"
                    />
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                            ✓ Verified Client
                        </span>
                        <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ml-auto cursor-pointer"
                        >
                            <Send className="w-4 h-4" /> Post Comment
                        </button>
                    </div>
                </form>
            )}

            {/* 💬 COMMENT LIST SECTION (হায়ার করা থাকলে কমেন্টগুলো দেখাবে) */}
            {isHired && (
                <div className="space-y-4 pt-4 border-t border-slate-800">
                    {commentsList.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-4">No reviews yet. Be the first to share your experience!</p>
                    ) : (
                        commentsList.map((c, index) => (
                            <div key={c.id || index} className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-semibold text-white">{c.userName || c.user?.name || 'Anonymous'}</span>
                                    </div>
                                    <span className="text-xs text-slate-500">{c.date || 'Recent'}</span>
                                </div>
                                <p className="text-sm text-slate-300 pl-9">{c.text || c.content}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}