'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare, Edit3, Trash2, Star, Calendar, Loader2, AlertCircle, X, CheckCircle, User, ExternalLink, Briefcase } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { deleteComment, updateComment } from '@/lib/action/comments';
import { getComments } from '@/lib/api/comments';

export default function UserCommentsPage() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);

    // Form & Action States
    const [editText, setEditText] = useState('');
    const [editRating, setEditRating] = useState(5);
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch user comments
    const fetchUserComments = async () => {
        try {
            setLoading(true);
            const session = await authClient.getSession();
            const userEmail = session?.data?.user?.email;

            if (!userEmail) {
                setComments([]);
                return;
            }

            const result = await getComments(userEmail);
            console.log(result.data);

            if (result?.success) {
                setComments(result.data || []);
            } else {
                setComments([]);
            }
        } catch (error) {
            console.error('Failed to load comments:', error);
            setComments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUserComments();
    }, []);

    const handleOpenEdit = (comment) => {
        setSelectedComment(comment);
        setEditText(comment.commentText || comment.text || '');
        setEditRating(comment.rating || 5);
        setEditModalOpen(true);
    };

    const handleOpenDelete = (comment) => {
        setSelectedComment(comment);
        setDeleteModalOpen(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!selectedComment) return;

        setActionLoading(true);
        try {
            const res = await updateComment(selectedComment._id, {
                commentText: editText,
                rating: editRating,
            });

            if (res.success) {
                setComments((prev) =>
                    prev.map((c) =>
                        c._id === selectedComment._id
                            ? { ...c, commentText: editText, rating: editRating, updatedAt: new Date() }
                            : c
                    )
                );
                setEditModalOpen(false);
            } else {
                alert(res.message || 'Failed to update comment');
            }
        } catch (error) {
            console.error('Error updating comment:', error);
            alert('An error occurred while updating.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteSubmit = async () => {
        if (!selectedComment) return;

        setActionLoading(true);
        try {
            const res = await deleteComment(selectedComment._id);

            if (res.success) {
                setComments((prev) => prev.filter((c) => c._id !== selectedComment._id));
                setDeleteModalOpen(false);
            } else {
                // alert(res.message || 'Failed to delete comment');
            }
        } catch (error) {
            // console.error('Error deleting comment:', error);
            // alert('An error occurred while deleting.');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto px-1 sm:px-0">
            {/* Page Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0" /> My Reviews & Comments
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Manage and edit all the feedback you have submitted on lawyer profiles.
                </p>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="min-h-[300px] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                </div>
            ) : comments.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-3">
                    <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600 mx-auto" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">No Comments Found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        You haven&apos;t posted any reviews or comments on lawyer profiles yet.
                    </p>
                </div>
            ) : (
                /* Card Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {comments.map((item) => {
                        
                        const lawyer = item.lawyerDetails || item.lawyerInfo || {};
                        const lawyerName = lawyer.name || 'Lawyer Profile';
                        const lawyerImage = lawyer.photoUrl;
                        const lawyerSpeciality = lawyer?.specialization || lawyer.category || 'Legal Specialist';
                        const lawyerId = item.lawyerId || lawyer._id;

                        return (
                            <div
                                key={item._id}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between hover:border-slate-700/80 transition-all"
                            >
                                <div className="space-y-4">
                                    {/* 🚀 LAWYER INFO HEADER */}
                                    <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                                        <div className="flex items-center gap-3">
                                            {/* Lawyer Avatar */}
                                            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0 flex items-center justify-center">
                                                {lawyerImage ? (
                                                    <Image
                                                        src={lawyerImage}
                                                        alt={lawyerName}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-6 h-6 text-slate-500" />
                                                )}
                                            </div>

                                            {/* Lawyer Details */}
                                            <div>
                                                <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-1.5">
                                                    {lawyerName}
                                                </h3>
                                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <Briefcase className="w-3 h-3 text-amber-500" />
                                                    {lawyerSpeciality}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Lawyer Profile Link */}
                                        {lawyerId && (
                                            <Link
                                                href={`/lawyers/${lawyerId}`}
                                                className="p-2 text-slate-400 hover:text-amber-500 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/40"
                                                title="View Lawyer Profile"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>

                                    {/* Rating & Date */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-3.5 h-3.5 ${i < (item.rating || 5)
                                                            ? 'text-amber-400 fill-amber-400'
                                                            : 'text-slate-700'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>
                                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Comment Content */}
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
                                        &ldquo;{item.commentText || item.text}&rdquo;
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/60">
                                    <button
                                        onClick={() => handleOpenEdit(item)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/50"
                                    >
                                        <Edit3 className="w-3.5 h-3.5 text-amber-500" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleOpenDelete(item)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ✏️ EDIT MODAL */}
            {editModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-2xl relative">
                        <button
                            onClick={() => setEditModalOpen(false)}
                            className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Edit3 className="w-5 h-5 text-amber-500" /> Edit Review
                        </h2>

                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-xs font-medium text-slate-300">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setEditRating(star)}
                                            className="p-1 hover:scale-110 transition-transform"
                                        >
                                            <Star
                                                className={`w-6 h-6 ${star <= editRating
                                                        ? 'text-amber-400 fill-amber-400'
                                                        : 'text-slate-700'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-xs font-medium text-slate-300">
                                    Your Comment
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    placeholder="Write your experience..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 transition-colors"
                                >
                                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 🗑️ DELETE CONFIRMATION MODAL */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl text-center relative">
                        <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
                            <AlertCircle className="w-6 h-6" />
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-white">Delete Comment?</h3>
                            <p className="text-xs text-slate-400">
                                Are you sure you want to delete this comment? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex justify-center gap-3 pt-2">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteSubmit}
                                disabled={actionLoading}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 transition-colors"
                            >
                                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}