"use client";

import React from 'react'
import Navbar from '@/components/Navbar/page'
import Sidebar from '@/components/Sidebar/page'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { setPlayedVideo } from '../slices/videoSlice';
import axios from 'axios'
import {Card, CardBody, CardFooter, Image} from "@nextui-org/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { userContext } from '@/context/context'
import { useRouter } from 'next/navigation'
import ReduxProvider from '@/components/ReduxProvider';

interface User {
  fullName: string,
  avatar: string,
  username: string,
  _id: string,
  watchHistory?: string[],
  email: string,
  coverImage?: string
}
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
const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M views';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K views';
  } else {
    return views + ' views';
  }
}
function convertSecondsToHMS(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60); // Remove fractional part

  let result = '';

  // Include hours only if greater than zero
  if (hours > 0) {
      result += `${hours.toString().padStart(2, '0')}:`;
  }

  // Always include minutes
  result += `${minutes.toString().padStart(2, '0')}:`;

  // Ensure two digits for seconds
  result += remainingSeconds.toString().padStart(2, '0');

  return result;
}

const Homepage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter()
  dayjs.extend(relativeTime);
  const [video , setVideo] = useState<Video[]>([])
  useEffect( () => {
  const getData = async () =>{
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/videos`);
    if(res.data.success)  setVideo(res.data.data);
  }   
  getData()
  }, [])
  
  const playVideo  = async (video: Video) =>{
    try {
      const id = video.videoFile
      dispatch(setPlayedVideo(video));
      localStorage.setItem("playedVideoOwnerId", video?.owner?._id);
      localStorage.setItem("playedVideoId", video?._id);
      const token = localStorage.getItem("token");
      if(token){
        const videoId = video?._id
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/videos/${videoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).then(()=> router.push(`/play-video/${id}`)).catch(err => console.log(err));
      } else {
        router.push("/login")
      }
    }catch (error) {
      console.log("Error playing video", error);
    } 
     
  }
  return (

    <div>
      <div className=' w-full h-20 backdrop-blur-md  border-b-[2px] border-gray-700'>
        <Navbar/>
      </div>
      <div className='flex '>
        <Sidebar opening={true}/>
        <div className='grid grid-cols-4 w-full ml-5 mt-5 gap-3 '>
           { Array.isArray(video) && video.map((video, index) =>(
            <Card shadow="sm" className='max-h-64' key={index} isPressable onPress={() => playVideo(video)}>
            <CardBody className="overflow-visible p-0 relative">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt={video.title}
                className="w-full object-cover h-[140px]"
                src={video.thumbNail}
              />
              <div className='bg-black px-1 opacity-75 rounded-sm text-white absolute right-2 bottom-3 z-10'>{convertSecondsToHMS(video.duration)}</div>
            </CardBody>
            <CardFooter className='flex flex-col  items-start justify-center'>
            <div className="flex gap-3 h-14 text-md font-bold overflow-clip justify-center items-center">
            <Avatar>
            <AvatarImage src={video.owner.avatar} />
            <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className='text-left w-full'>{video.title}</p>
            </div>
            <div className='flex flex-col pl-12 text-left '>
            
            <div className="flex gap-3 text-sm  justify-center items-center">
               <span>{formatViews(video.views)}  | </span>
               <span>
                {dayjs(video.createdAt).fromNow()}
               </span>
            </div>
            {video.owner.username}
            </div>
            </CardFooter>
          </Card>
           ))
           }
        </div>
      </div>
    </div>

  )
}

export default Homepage
