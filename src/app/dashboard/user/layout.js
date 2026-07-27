import { requireRole } from "@/lib/core/session";


const userDashboardLayout = async ({ children }) => {
    await requireRole('user')
    return (
        <div className='flex gap-10 min-h-screen'>
            <div className='flex-1'>
                {children}
            </div>
        </div>
    );
};

export default userDashboardLayout;