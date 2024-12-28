"use client";
import { useState } from "react";
import Homepage from "./homepage/page";
import { NextUIProvider } from "@nextui-org/react";
import { userContext } from "@/context/context";

interface User {
  fullName: string;
  avatar: string;
  username: string;
  _id: string;
  watchHistory?: string[];
  email: string;
  coverImage?: string;
}

export default function Home() {
 

  return (
    
      <NextUIProvider>
        <Homepage />
      </NextUIProvider>
    
  );
}
