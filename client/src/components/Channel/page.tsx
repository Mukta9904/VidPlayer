"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import { Button } from "../ui/button";
import axios from "axios";
import Image from "next/image";

const Channel = () => {
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

  const dispatch = useDispatch<AppDispatch>();
  const video = useSelector((state: RootState) => state.video.video);
  const user = useSelector((state: RootState) => state.user.user);

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
        const token = localStorage.getItem("token");
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

  return (
    <div className="flex flex-col w-[800px] items-center p-5">
      {user && (
        <div className="flex justify-between w-full max-w-4xl border-b pb-5 mb-5">
          <div className="flex items-center">
            <Image
              src={user?.avatar}
              alt={`${user?.username}'s avatar`}
              width={80}
              height={80}
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
            <Button className="ml-2">Save to Playlist</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Channel;
