"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPlayedVideo } from "@/app/slices/videoSlice";
import { RootState, AppDispatch } from "@/app/store";
import { Button } from "../ui/button";
import axios from "axios";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { convertSecondsToHMS } from "@/lib/utils";
import { formatViews } from "@/lib/utils";


const Channel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [subscribers, setSubscribers] = useState<number>(() => {
    // Retrieve from local storage or default to 0
    const storedSubscribers = localStorage.getItem("subscribers");
    return storedSubscribers ? parseInt(storedSubscribers, 10) : 0;
  });

  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    // Retrieve from local storage or default to false
    const storedIsSubscribed = localStorage.getItem("isSubscribed");
    return storedIsSubscribed === "true";
  });
  
  const [ likes, setLikes ] = useState<number>(() => {
    // Retrieve from local storage or default to 0
    const storedLikes = localStorage.getItem("likes");
    return storedLikes ? parseInt(storedLikes, 10) : 0;
  })

  dayjs.extend(relativeTime);
  const dispatch = useDispatch<AppDispatch>();
  const video = useSelector((state: RootState) => state.video.video);
  const user = useSelector((state: RootState) => state.user.user);

   const [ isLiked, setIsliked ] = useState(()=>{
    // Retrieve from local storage or default to false
    const storedIsLiked = localStorage.getItem("isLiked");
    return storedIsLiked === "true";
   });
   const videoId = video?._id || localStorage.getItem("playedVideoId");
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    if(!video){
      const storedVideo = localStorage.getItem("video");
      if (storedVideo) {
        const parsedVideo = JSON.parse(storedVideo);
        dispatch(setPlayedVideo(parsedVideo));
      }
    }
  }, [])

  const handleSubscribe = async () => {
    
    try {
      const id = video?.owner?._id || localStorage.getItem("playedVideoOwnerId");
      const token = localStorage.getItem("token");
      
      if (token && id) {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/toggle/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data) {
          // Toggle subscription state
          const newSubscriptionState = !isSubscribed;
          const newSubscribersCount = newSubscriptionState
            ? subscribers + 1
            : subscribers - 1;
            localStorage.setItem("isSubscribed", String(newSubscriptionState));
            localStorage.setItem("subscribers", newSubscribersCount.toString());
          setIsSubscribed(newSubscriptionState);
          setSubscribers(newSubscribersCount);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = video?.owner?._id || localStorage.getItem("playedVideoId");
        if (token && id) {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/users/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.data.statusCode === 200) {
            console.log(res.data.data);
            const arr = res?.data?.data;
            const currentSubscribers = arr?.length;
            localStorage.setItem(
              "subscribers",
              currentSubscribers.toString()
            );
            setSubscribers(currentSubscribers);
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].subscriber === user?._id) {
                localStorage.setItem("isSubscribed", "true");
                setIsSubscribed(true);
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [isSubscribed, subscribers]);

  const handleLike = async () => {
    try {
      
      if (token && videoId) {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/like/toggle/v/${videoId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data) {
          // console.log(res.data);
          
          const newLikeState = !isLiked;
          const newLikesCount = newLikeState ? likes + 1 : likes - 1;
          localStorage.setItem("isLiked", String(newLikeState));
          localStorage.setItem("likes", newLikesCount.toString());
          setIsliked(newLikeState);
          setLikes(newLikesCount);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token && videoId) {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/like/video/${videoId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.data.statusCode === 200) {
            console.log(res.data.data, "likes");
            setLikes(res.data.data);
            localStorage.setItem("likes", res.data.data.toString());
          }
        }
      } catch (error) {
        console.error(error);
      }
    };  
    fetchUser();
  }, [likes]);

  useEffect(() => {
    console.log(videoId, isLiked);
    
  const fetchUser = async () => {
    try {
      if (token && videoId) {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/like/videos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.statusCode === 200) {
          console.log(res.data.data, "likes");
          if(res.data.data?.length){
            const arr = res?.data?.data;
            for (let i = 0; i < res.data.data.length; i++) {
              if (arr[i]._id === videoId) {
                localStorage.setItem("isLiked", "true");
                setIsliked(true);
                break;
              }
            } 
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  fetchUser();
  }, [isLiked]);  

  return (
    <div className="flex flex-col w-full items-center p-5">
      { video  && (
        <div className="w-full max-w-4xl border-2 rounded-2xl border-gray-200  p-5 mb-3">
        <div className="flex justify-between">
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-bold">{video?.title}</h1>
            <div className="flex gap-3">
              <p className="text-gray-400">{formatViews(video?.views)} | </p>
              <span className="text-gray-400">{dayjs(video?.createdAt).fromNow()}</span>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLike}
              className={
                isLiked
                  ? "ml-2 bg-gray-200 flex items-center space-x-2 border-black border-[1px] p-1 rounded-lg"
                  : "ml-2 flex items-center space-x-2 hover:bg-gray-900 border-[1px] border-gray-500 p-1 rounded-lg"
              }
            >
              <img src="/assets/like.svg" alt="like" />
              {likes}
            </button>
            <Button className="ml-2">Save to Playlist</Button>
          </div>
        </div>
        <p
  className={`text-sm text-gray-500 cursor-pointer ${
    isExpanded ? "whitespace-normal" : "truncate"
  }`}
  title={video.description}
  onClick={() => setIsExpanded(!isExpanded)}
>
  {isExpanded || video.description.length <= 70
    ? video.description
    : `${video.description.slice(0, 70)}...`}
</p>
      </div>
      )}
      {user && (
        <div className="flex justify-between w-full max-w-4xl border-2 rounded-2xl border-gray-200 p-5 mb-5">
          <div className="flex items-center">
            <Image
              src={user?.avatar}
              alt={`${user?.username}'s avatar`}
              width={70}
              height={700}
              className="rounded-full mr-3"
            />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{user?.username}</h1>
              <p className="text-gray-600">{subscribers} subscribers</p>
            </div>
          </div>
          <div className="flex items-center">
            <Button onClick={handleSubscribe} className="ml-2">
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </Button>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Channel;
