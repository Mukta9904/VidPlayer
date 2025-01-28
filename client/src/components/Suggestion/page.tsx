"use client"
import React from 'react' 
import { useState , useEffect} from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import ReduxProvider from '../ReduxProvider'
import VideoLibrary from '../VideoLibrary/page'

interface Owner{
  fullname: string,
  avatar: string,
  username: string,
  _id: string
}
interface Video {
  createdAt: string,
  title: string,
  description: string,
  videoFile: string,
  thumbNail: string,
  _id: string,
  owner: Owner,
  views: number,
  duration: number,
  isPublished: boolean
}

const Suggestion = () => {
  const currentVideoId = localStorage.getItem("playedVideoId") || "";
  const [video , setVideo] = useState<Video[]>([])
  useEffect( () => {
  const getData = async () =>{
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/videos`);
    if(res.data.success)  setVideo(res.data.data);
  }   
  getData()
  }, [])

  return (
    <ReduxProvider>
    <div>
      <VideoLibrary videos={video} currentVideoId={currentVideoId} />
    </div>
    </ReduxProvider>
  )
}

export default Suggestion
