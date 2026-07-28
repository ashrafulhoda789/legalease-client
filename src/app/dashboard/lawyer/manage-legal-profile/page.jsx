'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getLawyerProfile } from '@/lib/api/lawyers';
import { updateLawyerProfile } from '@/lib/action/lawyers';
import {
    User,
    Briefcase,
    GraduationCap,
    Award,
    Camera,
    Plus,
    Trash2,
    Save,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';

export default function ManageLegalProfile() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const fileInputRef = useRef(null);

    const SPECIALIZATIONS = [
        'Corporate & Tax',
        'Criminal Law',
        'Family & Property',
        'Cyber & IP Law'
    ];

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        contactNumber: '',
        photoUrl: '',
        specialization: '',
        experienceYears: '',
        barCouncilNo: '',
        consultationFee: '',
        status: 'Available',
        chamberAddress: '',
        bio: '',
        education: [{ degree: '', institution: '', year: '' }],
        awards: [{ title: '', organization: '', year: '' }]
    });

    useEffect(() => {
        const loadProfile = async () => {
            if (!session?.user?.email) return;

            try {
                const res = await getLawyerProfile(session.user.email);

                if (res?.success) {
                    const { user, profile } = res.data;
                    setFormData({
                        fullName: user?.name || session.user.name || '',
                        email: user?.email || session.user.email || '',
                        contactNumber: profile?.contactNumber || user?.phone || '',
                        photoUrl: profile?.photoUrl || '',
                        specialization: profile?.specialization || '',
                        experienceYears: profile?.experienceYears || '',
                        barCouncilNo: profile?.barCouncilNo || '',
                        consultationFee: profile?.consultationFee || '',
                        status: profile?.status || 'Available',
                        chamberAddress: profile?.chamberAddress || '',
                        bio: profile?.bio || '',
                        education: profile?.education?.length ? profile.education : [{ degree: '', institution: '', year: '' }],
                        awards: profile?.awards?.length ? profile.awards : [{ title: '', organization: '', year: '' }]
                    });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [session?.user?.email, session?.user?.name]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: 'POST',
                body: uploadData,
            });

            const data = await res.json();

            if (data.success) {
                setFormData(prev => ({ ...prev, photoUrl: data.data.url }));
            } else {
                // alert('Image upload failed!');
            }
        } catch (error) {
            // console.error('Upload Error:', error);
            // alert('Something went wrong during image upload.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleEducationChange = (index, field, value) => {
        const updatedEducation = [...formData.education];
        updatedEducation[index][field] = value;
        setFormData(prev => ({ ...prev, education: updatedEducation }));
    };

    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, { degree: '', institution: '', year: '' }]
        }));
    };

    const removeEducation = (index) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const handleAwardChange = (index, field, value) => {
        const updatedAwards = [...formData.awards];
        updatedAwards[index][field] = value;
        setFormData(prev => ({ ...prev, awards: updatedAwards }));
    };

    const addAward = () => {
        setFormData(prev => ({
            ...prev,
            awards: [...prev.awards, { title: '', organization: '', year: '' }]
        }));
    };

    const removeAward = (index) => {
        setFormData(prev => ({
            ...prev,
            awards: prev.awards.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveSuccess(false);

        try {
            const payload = {
                email: session?.user?.email,
                name: formData.fullName,
                contactNumber: formData.contactNumber,
                photoUrl: formData.photoUrl,
                specialization: formData.specialization,
                experienceYears: formData.experienceYears,
                barCouncilNo: formData.barCouncilNo,
                consultationFee: formData.consultationFee,
                status: formData.status,
                chamberAddress: formData.chamberAddress,
                bio: formData.bio,
                education: formData.education,
                awards: formData.awards
            };

            const res = await updateLawyerProfile(payload);

            if (res?.success) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                alert(res?.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-wide">Manage Legal Profile</h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Update your public information to attract more clients and maintain transparency.
                    </p>
                </div>
                {saveSuccess && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                        <CheckCircle2 className="w-4 h-4" />
                        Saved successfully
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                    <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                        <User className="w-4 h-4" /> Basic Details & Avatar
                    </h2>

                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />

                        <div className="flex flex-col items-center gap-2 shrink-0">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="group relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-dashed border-amber-500/50 hover:border-amber-500 bg-slate-950 flex items-center justify-center cursor-pointer transition-all shadow-md"
                            >
                                {isUploading ? (
                                    <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                                ) : formData.photoUrl ? (
                                    <>
                                        <img src={formData.photoUrl} alt="Lawyer Profile" className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-[10px] font-medium gap-1">
                                            <Camera className="w-4 h-4 text-amber-400" />
                                            <span>Change Photo</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-1.5 text-slate-500 group-hover:text-amber-400 transition-colors">
                                        <Camera className="w-6 h-6" />
                                        <span className="text-[10px] font-medium">Upload Photo</span>
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">Click card to upload</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Contact Number
                                </label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    placeholder="+880 1XXXXXXXXX"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-slate-950/50 border border-slate-800/50 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                    <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Professional Credentials
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Specialization
                            </label>
                            <select
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                                required
                            >
                                <option value="" disabled>Select Specialization</option>
                                {SPECIALIZATIONS.map((spec) => (
                                    <option key={spec} value={spec} className="bg-slate-900 text-slate-200">
                                        {spec}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Experience (Years)
                            </label>
                            <input
                                type="number"
                                name="experienceYears"
                                value={formData.experienceYears}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Bar Council Reg No.
                            </label>
                            <input
                                type="text"
                                name="barCouncilNo"
                                value={formData.barCouncilNo}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Consultation Fee (BDT)
                            </label>
                            <input
                                type="number"
                                name="consultationFee"
                                value={formData.consultationFee}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Availability Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                            >
                                <option value="Available">Available</option>
                                <option value="Busy">Busy</option>
                            </select>
                        </div>

                        <div className="md:col-span-3">
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Chamber / Office Address
                            </label>
                            <input
                                type="text"
                                name="chamberAddress"
                                value={formData.chamberAddress}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                            Bio / Summary
                        </label>
                        <textarea
                            name="bio"
                            rows={4}
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                            required
                        />
                    </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" /> Education
                        </h2>
                        <button
                            type="button"
                            onClick={addEducation}
                            className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 font-semibold transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add Degree
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.education.map((edu, index) => (
                            <div key={index} className="flex flex-col sm:flex-row items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                                <input
                                    type="text"
                                    placeholder="Degree"
                                    value={edu.degree}
                                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                    className="w-full sm:flex-1 bg-transparent border-b border-slate-800 sm:border-none text-xs text-slate-200 p-1 focus:outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Institution"
                                    value={edu.institution}
                                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                    className="w-full sm:flex-1 bg-transparent border-b border-slate-800 sm:border-none text-xs text-slate-200 p-1 focus:outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Year"
                                    value={edu.year}
                                    onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                    className="w-full sm:w-24 bg-transparent text-xs text-slate-200 p-1 focus:outline-none"
                                />
                                {formData.education.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeEducation(index)}
                                        className="text-red-400 hover:text-red-300 p-1 shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                            <Award className="w-4 h-4" /> Honors & Awards
                        </h2>
                        <button
                            type="button"
                            onClick={addAward}
                            className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 font-semibold transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add Award
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.awards.map((award, index) => (
                            <div key={index} className="flex flex-col sm:flex-row items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={award.title}
                                    onChange={(e) => handleAwardChange(index, 'title', e.target.value)}
                                    className="w-full sm:flex-1 bg-transparent border-b border-slate-800 sm:border-none text-xs text-slate-200 p-1 focus:outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Organization"
                                    value={award.organization}
                                    onChange={(e) => handleAwardChange(index, 'organization', e.target.value)}
                                    className="w-full sm:flex-1 bg-transparent border-b border-slate-800 sm:border-none text-xs text-slate-200 p-1 focus:outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Year"
                                    value={award.year}
                                    onChange={(e) => handleAwardChange(index, 'year', e.target.value)}
                                    className="w-full sm:w-24 bg-transparent text-xs text-slate-200 p-1 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeAward(index)}
                                    className="text-red-400 hover:text-red-300 p-1 shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving || isUploading}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}