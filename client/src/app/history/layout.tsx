"use client"
import React from 'react';
import Navbar from '@/components/Navbar/page';
import Sidebar from '@/components/Sidebar/page';
import { Provider } from "react-redux";
import { store } from '../store';
const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}> 
        <div className='flex'>
            
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <div style={{ flex: 1, padding: '20px' }}>
                    {children}
                </div>
            </div>
        </div>
    </Provider>
    );
};

export default Layout