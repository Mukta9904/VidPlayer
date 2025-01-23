"use client";
import { useState } from "react";
import Homepage from "./homepage/page";
import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "react-redux";
import { store } from "./store";
export default function Home() {
  return (
    <NextUIProvider>
      <Provider store={store}>
      <Homepage />
      </Provider>
    </NextUIProvider>
  );
}
