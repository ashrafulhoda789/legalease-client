'use client';

import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { Scale, ShieldCheck, Gavel, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

// Swiper Essential CSS
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HERO_SLIDES = [
    {
        id: 1,
        title: "Find & Hire Expert Legal Counsel",
        subtitle: "Connecting individuals and businesses with verified legal experts effortlessly.",
        badge: "Verified Legal Network",
        icon: Scale,
        bgGradient: "from-slate-900 via-slate-800 to-amber-950/30",
    },
    {
        id: 2,
        title: "Protect Your Rights with Top Attorneys",
        subtitle: "Corporate, Criminal, Family Law & More. Transparent hourly fees & instant hiring.",
        badge: "100% Secure Consultation",
        icon: ShieldCheck,
        bgGradient: "from-slate-900 via-slate-800 to-slate-900",
    },
    {
        id: 3,
        title: "Justice Made Simple & Accessible",
        subtitle: "Browse thousands of licensed lawyers, compare expertise, and hire on your terms.",
        badge: "Certified Counsel",
        icon: Gavel,
        bgGradient: "from-slate-900 via-amber-950/20 to-slate-900",
    }
];

export default function HeroBanner() {
    return (
        <section className="relative bg-slate-900 text-white overflow-hidden border-b border-slate-800">

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />

            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop={true}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                className="w-full max-w-350 mx-auto hero-swiper"
            >
                {HERO_SLIDES.map((slide) => {
                    const IconComponent = slide.icon;
                    return (
                        <SwiperSlide key={slide.id} className="bg-slate-900">
                            {/* Flex direction flex-col-reverse in small screens and lg:grid for desktop */}
                            <div className={`px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-28 flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-gradient-to-r ${slide.bgGradient}`}>

                                {/* Text Content Container (Mobile-e niche, Desktop-e left side) */}
                                <div className="w-full lg:col-span-7 space-y-5 sm:space-y-6 z-10 text-center lg:text-left">

                                    {/* Badge */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs sm:text-sm font-medium">
                                        <Award className="w-4 h-4" />
                                        <span>{slide.badge}</span>
                                    </div>

                                    {/* Main Tagline Requirement */}
                                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                                        {slide.title.includes("Find & Hire Expert Legal Counsel") ? (
                                            <>
                                                Find & Hire <span className="text-amber-500 underline decoration-amber-500/40 underline-offset-8">Expert Legal Counsel</span>
                                            </>
                                        ) : (
                                            slide.title
                                        )}
                                    </h1>

                                    {/* Subtitle */}
                                    <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                        {slide.subtitle}
                                    </p>

                                    {/* Highlights Bullet list */}
                                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400 pt-1">
                                        <span className="flex items-center gap-1.5">
                                            <CheckCircle2 className="w-4 h-4 text-amber-500" /> Transparent Pricing
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <CheckCircle2 className="w-4 h-4 text-amber-500" /> One-Click Direct Hiring
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <CheckCircle2 className="w-4 h-4 text-amber-500" /> Stripe Secure Payments
                                        </span>
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
                                        <Link
                                            href="/lawyers"
                                            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 sm:px-6 py-3 rounded-xl shadow-lg shadow-amber-600/20 transition-all hover:gap-3 text-sm sm:text-base"
                                        >
                                            Browse Lawyers
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>

                                        <Link
                                            href="/register"
                                            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-5 sm:px-6 py-3 rounded-xl transition-colors text-sm sm:text-base"
                                        >
                                            Join as a Lawyer
                                        </Link>
                                    </div>

                                </div>

                                {/* Professional Legal Graphics Container (Mobile-e opore, Desktop-e right side) */}
                                <div className="w-full lg:col-span-5 flex justify-center z-10">
                                    <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
                                        <div className="relative bg-slate-800/90 border border-slate-700/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center space-y-3 sm:space-y-4">
                                            <div className="p-4 sm:p-5 bg-amber-600/10 border border-amber-500/30 rounded-2xl text-amber-500">
                                                <IconComponent className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-lg sm:text-xl font-bold text-white">Legal Ease</p>
                                                <p className="text-xs text-slate-400">Trusted Legal Marketplace</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </section>
    );
}