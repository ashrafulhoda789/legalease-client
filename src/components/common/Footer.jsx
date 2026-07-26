'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, Mail, Twitter, Linkedin, Instagram } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-300">
            <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Brand Profile */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-amber-600 p-2 rounded-lg text-white">
                                <Scale className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-2xl tracking-wider text-white">
                                Legal<span className="text-amber-500">Ease</span>
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Democratizing legal aid by connecting clients with verified, expert legal counsel globally.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h3 className="text-white font-semibold text-lg border-b border-amber-500/30 pb-1 w-max">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="hover:text-amber-500 transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link href="/lawyers" className="hover:text-amber-500 transition-colors">Browse Lawyers</Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-amber-500 transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-amber-500 transition-colors">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Icons */}
                    <div className="space-y-3">
                        <h3 className="text-white font-semibold text-lg border-b border-amber-500/30 pb-1 w-max">
                            Connect With Us
                        </h3>
                        <p className="text-sm text-slate-400">Follow us on our social platforms:</p>
                        <div className="flex items-center gap-3 pt-1">
                            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-amber-600 hover:text-white transition-colors">
                                <FaFacebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-amber-600 hover:text-white transition-colors">
                                <FaTwitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-amber-600 hover:text-white transition-colors">
                                <FaLinkedin className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-amber-600 hover:text-white transition-colors">
                                <FaInstagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Newsletter Form */}
                    <div className="space-y-3">
                        <h3 className="text-white font-semibold text-lg border-b border-amber-500/30 pb-1 w-max">
                            Newsletter
                        </h3>
                        <p className="text-sm text-slate-400">
                            Subscribe to receive legal updates and insights.
                        </p>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-amber-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm text-slate-500">
                    © {new Date().getFullYear()} LegalEase. All rights reserved.
                </div>
            </div>
        </footer>
    );
}