"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React from "react";
import { useRouter } from "next/navigation";
import { setUser } from "@/app/slices/userSlice";  
import { AppDispatch, RootState } from "@/app/store";
import { useSelector, useDispatch } from "react-redux";

const Logout = () => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        axios
          .get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/logout`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            console.log("Logout successful");
            localStorage.removeItem("token");
            localStorage.removeItem("video");
            localStorage.removeItem("isSubscribed");
            localStorage.removeItem("subscribers");
            localStorage.removeItem("isLiked");
            localStorage.removeItem("likes");
            localStorage.removeItem("playedVideoId");
            localStorage.removeItem("playedVideoOwnerId");
            dispatch(setUser(null));
            router.push("/");
          })
          .catch((err) => console.log(err));
      }
    } catch (error) {
      console.log(`Error logging out`, error);
    }
  };
  
  return (
    <div>
      <Button variant="destructive" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Logout;
