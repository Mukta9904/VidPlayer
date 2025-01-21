"use client";
import { useState } from "react";
import Homepage from "./homepage/page";
import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  return (
    <NextUIProvider>
      <Homepage />
    </NextUIProvider>
  );
}
