import React, { useMemo } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { formatViews } from "@/lib/utils";
import { convertSecondsToHMS } from "@/lib/utils";
import ReduxProvider from "../ReduxProvider";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import { setPlayedVideo } from "@/app/slices/videoSlice";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Owner {
  fullname: string;
  avatar: string;
  username: string;
  _id: string;
}
interface Video {
  createdAt: string;
  title: string;
  description: string;
  videoFile: string;
  thumbNail: string;
  _id: string;
  owner: Owner;
  views: number;
  duration: number;
  isPublished: boolean;
}

const VideoLibrary = ({
  videos,
  currentVideoId,
}: {
  videos: Video[];
  currentVideoId: string;
}) => {
  dayjs.extend(relativeTime);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  // Memoized filtered videos list to optimize rendering
  const filteredVideos = useMemo(() => {
    if (currentVideoId) {
      return videos.filter((video) => video._id !== currentVideoId);
    }
    return videos;
  }, [videos, currentVideoId]);

  const handleVideoPlay = async (video: Video) => {
    try {
      const id = video.videoFile;
      
      const token = localStorage.getItem("token");
      if (token) {
        // Remove the API call here as it will be handled in the play-video page
        router.push(`/play-video/${id}`);
        dispatch(setPlayedVideo(video));
      localStorage.setItem("playedVideoOwnerId", video?.owner?._id);
      localStorage.setItem("playedVideoId", video?._id);
      localStorage.setItem("video", JSON.stringify(video));
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.log("Error playing video", error);
    }
  };
  return (
    <div className="max-w-full flex flex-col space-y-1 min-h-screen">
      {filteredVideos.map((video) => (
        <div
          onClick={() => handleVideoPlay(video)}
          key={video._id}
          className="flex items-start p-4 cursor-pointer rounded-lg shadow hover:shadow-lg transition"
        >
          {/* Thumbnail */}
          <div className="relative w-44 h-28 flex-shrink-0">
            <Image
              src={video.thumbNail}
              alt={video.title}
              layout="fill"
              objectFit="cover"
              className="rounded"
              priority
            />
            <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
              {convertSecondsToHMS(video.duration)}
            </span>
          </div>

          {/* Video Details */}
          <div className="ml-4 flex-grow">
            <h3 className="text-lg font-medium truncate" title={video.title}>
              {video.title}
            </h3>
            <p
              className="text-sm text-gray-400 truncate"
              title={video.description}
            >
              {video.description.length > 40
                ? `${video.description.slice(0, 40)}...`
                : video.description}
            </p>
            <div className="flex items-center mt-2 space-x-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={video?.owner?.avatar} />
                <AvatarFallback>{video?.owner?.username}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-300">
                {video.owner.username}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {formatViews(video.views)} |{" "}
            </span>
            <span className="text-xs text-gray-500">
              {dayjs(video.createdAt).fromNow()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoLibrary;
