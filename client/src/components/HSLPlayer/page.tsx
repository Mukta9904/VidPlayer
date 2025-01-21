"use client";
import React, { useEffect, useRef } from "react";
import "plyr-react/plyr.css";
import Hls from "hls.js";
import Plyr, { APITypes, PlyrProps, PlyrInstance } from "plyr-react";

const HLSPlayer: React.FC<{ videoSrc: string }> = ({ videoSrc }) => {
  const ref = useRef<APITypes>(null);

  useEffect(() => {
    const loadVideo = () => {
      const video = document.getElementById("plyr") as HTMLVideoElement;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);

        // Assign the HLS instance to the Plyr player
        // @ts-ignore
        ref.current!.plyr.media = video;

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          (ref.current!.plyr as PlyrInstance).play();
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Fallback for Safari
        video.src = videoSrc;
      }
    };

    loadVideo();
  }, [videoSrc]);

  return (
    <Plyr
      id="plyr"
      options={{ volume: 0.5 }}
      source={{} as PlyrProps["source"]}
      ref={ref}
    />
  );
};

export default HLSPlayer;
