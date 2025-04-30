"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import React from "react";
import Image from "next/image";

const GlobalLoader = () => {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-6">
        {/* Bouncing Dots */}
        <div className="flex space-x-4">
          <span className="w-5 h-5 bg-syncPurple rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-5 h-5 bg-syncSky rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-5 h-5 bg-syncOrange rounded-full animate-bounce"></span>
        </div>

        {/* Logo and Loading Text on the same line */}
        <div className="flex items-center space-x-3 bg-gradient-to-r from-syncPurpleLight via-syncSkyLight to-syncOrangeLight bg-[length:400%_100%] animate-shimmer p-2 rounded-md border-none">
          <Image
            src="/logo.png"
            alt="App Logo"
            width={20}
            height={20}
            className="rounded-full"
          />
          <p className="text-white text-sm font-semibold ">
            Loading...Please wait.
          </p>
        </div> 
      </div>
    </div>
  );
};

export default GlobalLoader;
