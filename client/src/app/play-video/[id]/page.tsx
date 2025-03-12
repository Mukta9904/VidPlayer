"use client"
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import VideoPlayer from '@/components/VideoPlayer/page'
import Navbar from '@/components/Navbar/page'
const Channel = dynamic(() => import("@/components/Channel/page"), { ssr: false });
const Comments = dynamic(() => import("@/components/Comments/page"), { ssr: false });
const Suggestion = dynamic(() => import("@/components/Suggestion/page"), { ssr: false });
const NotesEditor = dynamic(() => import("@/components/Notepad/page"), { ssr: false });
import ReduxProvider from '@/components/ReduxProvider'
import Sidebar from '@/components/Sidebar/page'
import { log } from 'console'
import dynamic from 'next/dynamic'

const page = () => {
    const {id} = useParams<{id: string}>();
    useEffect(() => {
      async function addViews() {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/videos/${id}`);
          
        } catch (error) {
          console.log(error);
        }
      }
      
    }, [])
  return (
    <ReduxProvider>
    <div className='w-full h-full'>
      <Navbar/>
      <div className='flex w-full h-full'>
        <Sidebar/>
        <div className='max-w-[750px] pl-3 flex flex-col items-center justify-center ml-20 gap-3 h-full'>
          <div className='shadow-xl m-4 w-full shadow-gray-600 rounded-xl overflow-hidden'>
        <VideoPlayer videoFile={id} />
          </div>
        <Channel/>
        <Comments/>
        </div>
      <div className='mx-auto h-full flex-col items-center justify-center gap-3'>
        <div className='w-full'>
       <NotesEditor/> 
        </div>
      <Suggestion/>
      </div>
      </div>
    </div>
    </ReduxProvider>
  )
}

export default page