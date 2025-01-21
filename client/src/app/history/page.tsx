"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

interface Video {
  _id: string;
  videoFile: string;
  thumbNail: string;
  title: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  duration: number;
  description: string;
  owner: {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  isPublished: boolean;
  __v: number;
}

const HistoryPage: React.FC = () => {
    dayjs.extend(relativeTime);
  const [videos, setVideos] = useState<Video[]>([]);
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
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/history`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log(res.data.data);
        if (res.data.statusCode === 200) {
          setVideos(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
      // Fetch watch history from the server
    };
    fetchHistory();
  }, []);

  return (
    <div className="">
      <h1 className="text-4xl font-extrabold text-center my-10">Watch History</h1>
      <div className="md:w-[80%] mx-auto">
        {videos &&
          videos.map((video, index) => (
            <Card
              shadow="sm"
              className="max-h-64 my-5 w-full flex flex-row "
              key={index}
              isPressable
              onPress={() => console.log("video pressed")}
            >
              <CardBody className="overflow-visible p-0 w-[400px] relative">
                <Image
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  alt={video.title}
                  className="w-full object-cover h-[180px]"
                  src={video.thumbNail}
                />
                <div className="bg-black px-1 opacity-75 rounded-sm text-white absolute right-2 bottom-3 z-10">
                  {convertSecondsToHMS(video.duration)}
                </div>
              </CardBody>
              <CardFooter className="flex flex-col  items-start justify-center">
                <div className="flex gap-3 h-14 text-md font-bold overflow-clip justify-center items-center">
                  <Avatar>
                    <AvatarImage src={video.owner.avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className="text-left w-full">{video.title}</p>
                </div>
                <div className="flex flex-col pl-12 text-left ">
                  <div className="flex gap-3 text-sm  justify-center items-center">
                    <span>{formatViews(video.views)} | </span>
                    <span>{dayjs(video.createdAt).fromNow()}</span>
                  </div>
                  {video.owner.username}
                </div>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default HistoryPage;
