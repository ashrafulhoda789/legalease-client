'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquare, Send, User, Lock, Star, Loader2, X, Eye } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { createComment } from '@/lib/action/comments';
import { getCommentsForSpecificLawyer } from '@/lib/api/comments';
import { getCheckHiring } from '@/lib/api/check-hiring';


export default function CommentSection({ lawyerId, initialComments = [], isHired: initialIsHired }) {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const currentUser = session?.user;

    const [commentText, setCommentText] = useState('');
    const [rating, setRating] = useState(5);
    const [commentsList, setCommentsList] = useState(initialComments);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Auto-checking hiring status
    const [isHired, setIsHired] = useState(initialIsHired ?? false);
    const [checkingHiredStatus, setCheckingHiredStatus] = useState(initialIsHired === undefined);

    useEffect(() => {
        const fetchComments = async () => {
            if (!lawyerId) return;
            setIsLoadingComments(true);
            try {
                const res = await getCommentsForSpecificLawyer(lawyerId);
                if (res?.data) {
                    setCommentsList(res.data);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setIsLoadingComments(false);
            }
        };

        if (!initialComments || initialComments.length === 0) {
            fetchComments();
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCommentsList(initialComments);
        }
    }, [lawyerId, initialComments]);

    // Sync isHired prop
    useEffect(() => {
        if (initialIsHired !== undefined) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsHired(initialIsHired);
            setCheckingHiredStatus(false);
        }
    }, [initialIsHired]);

    useEffect(() => {
        const checkHiredStatus = async () => {
            if (initialIsHired !== undefined || !currentUser?.email || !lawyerId) {
                setCheckingHiredStatus(false);
                return;
            }

            try {
        
                const data = await getCheckHiring(lawyerId, currentUser.email);

                if (data?.isHired || (data?.success && data?.isHired)) {
                    setIsHired(true);
                } else {
                    setIsHired(false);
                }
            } catch (err) {
                console.error('Error verifying hire status:', err);
                setIsHired(false);
            } finally {
                setCheckingHiredStatus(false);
            }
        };

        checkHiredStatus();
    }, [currentUser, lawyerId, initialIsHired]);

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

        const commentPayload = {
            userEmail: currentUser.email,
            userName: currentUser.name || 'Anonymous User',
            userPhoto: currentUser.image || '',
            lawyerId: lawyerId,
            commentText: commentText,
            rating: rating,
        };

        try {
            const result = await createComment(commentPayload);

            if (result?.success) {
                const newCommentObj = {
                    _id: result.insertedId || result.data?._id || Date.now().toString(),
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
                alert(result?.message || 'Failed to post comment.');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Something went wrong while posting your review.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const visibleComments = commentsList.slice(0, 2);

    const CommentCard = ({ comment }) => (
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs border border-amber-500/20">
                        {comment.userName ? comment.userName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-white block">
                            {comment.userName || comment.user?.name || 'Anonymous User'}
                        </span>
                        <div className="flex items-center gap-0.5 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < (comment.rating || 5)
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-slate-700'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <span className="text-[11px] text-slate-500">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : comment.date || 'Recent'}
                </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 pl-10 leading-relaxed">
                {comment.commentText || comment.text || comment.content}
            </p>
        </div>
    );

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" /> Client Reviews & Consultation Feedback
            </h2>

            {/* 🔄 Hiring Status Check */}
            {checkingHiredStatus ? (
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-amber-500" /> Checking eligibility...
                </div>
            ) : !isHired ? (
                /* 🔒 LOCK SCREEN */
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
                /* ✍️ UNLOCKED FORM */
                <form onSubmit={handleAddComment} className="space-y-4 bg-slate-950/50 p-4 sm:p-5 rounded-2xl border border-slate-800">
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
                                        className={`w-4 h-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
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

            {/* 💬 FIRST 2 REVIEWS LIST */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-semibold text-slate-300">
                    Reviews ({commentsList.length})
                </h3>

                {isLoadingComments ? (
                    <div className="flex justify-center py-6">
                        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                    </div>
                ) : commentsList.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">
                        No reviews yet. Be the first to share your experience!
                    </p>
                ) : (
                    <>
                        <div className="space-y-3">
                            {visibleComments.map((c, index) => (
                                <CommentCard key={c._id || c.id || index} comment={c} />
                            ))}
                        </div>

                        {/* 🔘 SHOW ALL COMMENTS BUTTON */}
                        {commentsList.length > 2 && (
                            <div className="text-center pt-2">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl hover:bg-amber-500/20 transition-all cursor-pointer"
                                >
                                    <Eye className="w-4 h-4" /> View All {commentsList.length} Reviews
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* 🪟 ALL COMMENTS MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl max-h-[80vh] rounded-3xl p-6 flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-amber-500" />
                                All Reviews ({commentsList.length})
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full hover:bg-slate-700 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 custom-scrollbar">
                            {commentsList.map((c, index) => (
                                <CommentCard key={c._id || c.id || index} comment={c} />
                            ))}
                        </div>

                        {/* Modal Footer */}
                        <div className="pt-3 border-t border-slate-800 text-right">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}