import { requireRole } from "@/lib/core/session";


const adminDashboardLayout = async ({ children }) => {
    await requireRole('admin')
    return (
        <div className='flex gap-10 min-h-screen'>
            <div className='flex-1'>
                {children}
            </div>
        </div>
    );
};

export default adminDashboardLayout;