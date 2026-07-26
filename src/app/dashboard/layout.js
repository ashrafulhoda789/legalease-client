import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import React from 'react';


export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100">

            <DashboardSidebar />

            <main className="flex-1 p-6 sm:p-8 overflow-y-auto ml-8">
                {children}
            </main>
        </div>
    );
}