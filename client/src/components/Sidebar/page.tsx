"use client"
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, ClockIcon, FolderIcon, HeartIcon, UserIcon, Bars3Icon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  
  const isActive = (path: string ) => pathname === path;

  return (
    <div className={`flex flex-col h-[calc(100vh-80px)] pl-6 p-3 bg-black  text-white ${isOpen ? 'w-56' : 'w-20'} transition-width duration-300`}>
      <button onClick={toggleSidebar} className="mb-4 flex justify-start items-center p-2 rounded-lg hover:border-[1px] box-border hover:border-gray-500 hover:bg-gray-900 w-12 pl-[8px]">
        <Bars3Icon className="w-8  " />
      </button>
      <div className="flex flex-col justify-between h-full">
      <nav className="flex flex-col gap-2">
        <Link className='h-10' href="/">
          <div className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/') ? 'bg-gray-900 border-[1px] border-gray-500 ' : 'hover:bg-gray-900  hover:border-gray-500'}`}>
            <img src="assets/home.svg" alt="home" />
            {isOpen && <span>Home</span>}
          </div>
        </Link>
        <Link className='h-10' href="/history">
          <div className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/history') ? 'bg-gray-900 border-[1px] border-gray-500 ' : 'hover:bg-gray-900  hover:border-gray-500'}`}>
          <img src="assets/history.svg" alt="home" />
            {isOpen && <span>History</span>}
          </div>
        </Link>
        <Link className='h-10' href="/playlist">
          <div className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/playlist') ? 'bg-gray-900 border-[1px] border-gray-500 ' : 'hover:bg-gray-900  hover:border-gray-500'}`}>
          <img src="assets/playlist.svg" alt="home" />
            {isOpen && <span>Playlist</span>}
          </div>
        </Link>
        <Link className='h-10' href="/liked-videos">
          <div className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/liked-videos') ? 'bg-gray-900 border-[1px] border-gray-500 ' : 'hover:bg-gray-900  hover:border-gray-500'}`}>
          <img src="assets/thumbUp.svg" alt="home" />
            {isOpen && <span>Liked Videos</span>}
          </div>
        </Link>
        <Link className='h-10' href="/your-channel">
          <div className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/your-channel') ? 'bg-gray-900 border-[1px] border-gray-500 ' : 'hover:bg-gray-900  hover:border-gray-500'}`}>
          <img src="assets/videocam.svg" alt="home" />
            {isOpen && <span>Your Channel</span>}
          </div>
        </Link>
      </nav>
      <div className='mb-4 flex flex-col gap-2'>
      <Link className='h-10' href="/support">
          <div className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/support') ? 'bg-gray-900 border-[1px] border-gray-500 ' : 'hover:bg-gray-900  hover:border-gray-500'}`}>
          <img src="assets/help.svg" alt="home" />
            {isOpen && <span>Support</span>}
          </div>
        </Link>
        <Link className='h-10' href="/settings">
          <div className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/settings') ? 'bg-gray-900 border-[1px] border-gray-500 ' : 'hover:bg-gray-900  hover:border-gray-500'}`}>
          <img src="assets/setting.svg" alt="home" />
            {isOpen && <span>Settings</span>}
          </div>
        </Link>
      </div>
      </div>
    </div>
  );
};

export default Sidebar;
