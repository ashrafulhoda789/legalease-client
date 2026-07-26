

const LawyerDashboardLayout = async ({ children }) => {
    
    return (
        <div className='flex gap-10 min-h-screen'>
            <div className='flex-1'>
                {children}
            </div>
        </div>
    );
};

export default LawyerDashboardLayout;