'use client';

import React, { useState, useEffect } from 'react';
import { User, Camera, Loader2, Save, ArrowLeft, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function UpdateProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [fetchingSession, setFetchingSession] = useState(true);

    // Form States
    const [fullName, setFullName] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    // বর্তমান ইউজারের ডাটা লোড করা
    useEffect(() => {
        async function loadUserData() {
            try {
                const session = await authClient.getSession();
                const user = session?.data?.user;
                if (user) {
                    setFullName(user.name || '');
                    setImagePreview(user.image || '');
                }
            } catch (error) {
                console.error("Failed to load session:", error);
            } finally {
                setFetchingSession(false);
            }
        }
        loadUserData();
    }, []);

    // ImgBB-তে ইমেজ আপলোড হ্যান্ডলার
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // ইমেজ ফাইলের প্রিভিউ তাৎক্ষণিকভাবে দেখানোর জন্য
        const localPreview = URL.createObjectURL(file);
        setImagePreview(localPreview);

        setUploadingImage(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

            if (!apiKey) {
                // alert("ImgBB API Key is missing in environment variables!");
                setUploadingImage(false);
                return;
            }

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (data.success) {

                const uploadedImageUrl = data.data.url;
                setImagePreview(uploadedImageUrl);
            } else {
                // alert("Image upload failed! Please try again.");
            }
        } catch (error) {
            console.error("ImgBB Upload Error:", error);
            // alert("An error occurred while uploading the image.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (uploadingImage) {
            // alert("Please wait until the image finishes uploading!");
            return;
        }

        setLoading(true);

        try {
            // User profile update
            await authClient.updateUser({
                name: fullName,
                image: imagePreview,
            });

            router.push('/dashboard/user/update-profile');
            router.refresh();
        } catch (error) {
            console.error("Profile update failed:", error);
            // alert("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (fetchingSession) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 w-full">
            {/* Header */}
            <div>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <User className="w-6 h-6 text-amber-500" /> Update Profile
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Manage your public profile information and personal details.
                </p>
            </div>

            {/* Profile Update Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Profile Picture Upload & Preview */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
                        <div className="relative group shrink-0">
                            <div className="w-24 h-24 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center overflow-hidden relative shadow-inner">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-800/80 flex items-center justify-center">
                                        <User className="w-10 h-10 text-slate-500" />
                                    </div>
                                )}

                                {/* ইমেজ আপলোডের সময়ে লোডিং ওভারলে */}
                                {uploadingImage && (
                                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 text-center sm:text-left flex-1 w-full">
                            <label className="block text-xs font-semibold text-slate-300">
                                Profile Picture
                            </label>

                            <div className="flex items-center justify-center sm:justify-start gap-3">
                                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all shadow-xs hover:border-slate-600">
                                    <UploadCloud className="w-4 h-4 text-amber-500" />
                                    {uploadingImage ? 'Uploading...' : 'Choose New Photo'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploadingImage}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <p className="text-[11px] text-slate-500">
                                Supports JPG, PNG, or WebP. Max file size 32MB.
                            </p>
                        </div>
                    </div>

                    {/* Full Name Input */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-300">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                        <Link
                            href="/dashboard/user"
                            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-all"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading || uploadingImage}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/10"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}