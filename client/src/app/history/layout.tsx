import React from 'react';
import Navbar from '@/components/Navbar/page';
import Sidebar from '@/components/Sidebar/page';
const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex'>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <div style={{ flex: 1, padding: '20px' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout