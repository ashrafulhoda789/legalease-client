'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquare, Send, User } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function CommentSection({ lawyerId, initialComments }) {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const currentUser = session?.user;

    const [commentText, setCommentText] = useState('');
    const [commentsList, setCommentsList] = useState(initialComments);

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!currentUser) {
            router.push(`/auth/signin?callbackUrl=/lawyers/${lawyerId}`);
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

            {/* Form */}
            <form onSubmit={handleAddComment} className="space-y-3">
                <textarea
                    rows={3}
                    placeholder={currentUser ? "Write a comment or query about this lawyer..." : "Log in to post a comment..."}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={!currentUser}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-2xl p-4 focus:outline-none focus:border-amber-500 disabled:opacity-50 placeholder:text-slate-500"
                />
                <div className="flex justify-between items-center">
                    {!currentUser && (
                        <p className="text-xs text-slate-400">
                            You need to <Link href={`/auth/signin?callbackUrl=/lawyers/${lawyerId}`} className="text-amber-500 underline font-medium">sign in</Link> to leave a comment.
                        </p>
                    )}
                    {currentUser && <div></div>}
                    <button
                        type="submit"
                        disabled={!currentUser || !commentText.trim()}
                        className="bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ml-auto"
                    >
                        <Send className="w-4 h-4" /> Post Comment
                    </button>
                </div>
            </form>

            {/* List */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
                {commentsList.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No reviews or comments yet. Be the first to start a conversation!</p>
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
        </div>
    );
}