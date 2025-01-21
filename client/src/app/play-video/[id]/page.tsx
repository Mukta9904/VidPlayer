"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import VideoPlayer from '@/components/VideoPlayer/page'
import Navbar from '@/components/Navbar/page'
import Channel from '@/components/Channel/page'
import Comments from '@/components/Comments/page'
import Suggestion from '@/components/Suggestion/page'
import Notepad from '@/components/Notepad/page'
import ReduxProvider from '@/components/ReduxProvider'
import Sidebar from '@/components/Sidebar/page'

const page = () => {
    const {id} = useParams<{id: string}>();
    
  return (
    <ReduxProvider>
    <div className='w-full h-full'>
      <Navbar/>
      <div className='flex w-full h-full'>
        <Sidebar opening={false}/>
        <div className='lg:w-[1000px] flex-col gap-3 h-screen'>
        <VideoPlayer videoFile={id} />
        <Channel/>
        <Comments/>
        </div>
      <div className=' flex-col gap-3 h-screen'>
       <Notepad/> 
      <Suggestion/>
      </div>
      </div>
    </div>
    </ReduxProvider>
  )
}

export default page