"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    isUrlBased = true, 
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // পেজ নম্বর পরিবর্তন করার হ্যান্ডলার
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;

        if (isUrlBased) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", page.toString());
            router.push(`${pathname}?${params.toString()}`);
        }

        if (onPageChange) {
            onPageChange(page);
        }
    };

    if (totalPages <= 1) return null; // ১ পেজের কম হলে বা ১ পেজ থাকলে প্যাজিনেশন দেখাবে না

    // পেজ নাম্বারের রেঞ্জ ক্যালকুলেট করার হেলপার
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-between border-t border-slate-800/80 px-4 py-3 sm:px-6 mt-6">
            {/* Mobile Info & Buttons */}
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-lg bg-[#0a0f1d] px-3 py-1.5 text-xs font-medium text-slate-300 border border-slate-800 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <span className="text-xs text-slate-400 self-center">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-lg bg-[#0a0f1d] px-3 py-1.5 text-xs font-medium text-slate-300 border border-slate-800 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs text-slate-400">
                        Showing Page <span className="font-semibold text-white">{currentPage}</span> of{" "}
                        <span className="font-semibold text-white">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-xl bg-[#0a0f1d] p-1 border border-slate-800/80 gap-1">
                        {/* First Page */}
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="First Page"
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </button>

                        {/* Previous Page */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Previous Page"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Numeric Page Buttons */}
                        {getPageNumbers().map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${currentPage === page
                                        ? "bg-amber-500 text-slate-950 shadow-md"
                                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        {/* Next Page */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Next Page"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Last Page */}
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Last Page"
                        >
                            <ChevronsRight className="w-4 h-4" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}