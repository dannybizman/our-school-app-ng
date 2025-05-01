"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "@/components/ThemeProvider";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useRestoreRoleFromToken from "@/hooks/useRestoreRoleFromToken";
import { AiOutlineMessage, AiOutlineBell } from "react-icons/ai";
import Link from "next/link";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  useRestoreRoleFromToken();

  const { value: role, avatarUrl, firstName, lastName, schoolName } = useSelector(
    (state: RootState) => state.role
  );

  return (
    <div className="flex items-center justify-between p-4">
      {/* Search Bar */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-50 p-1">
        <Image src="/search.png" alt="search-icon" width={14} height={14} />
        <input
          type="text"
          placeholder="Search...."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>

      {/* Icons And Users */}
      <div className="flex items-center gap-6 justify-end w-full">
        <button
          onClick={toggleTheme}
          className="text-lg cursor-pointer w-7 h-7 items-center justify-center"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <div>
          <AiOutlineMessage className="text-syncPurple dark:text-white text-lg rounded-full w-7 h-7 items-center justify-center cursor-pointer" />
        </div>
        <div className="relative">
          <AiOutlineBell className="text-syncPurple  dark:text-white text-lg w-7 h-7 items-center justify-center cursor-pointer" />
          <div className="absolute -top-4 -right-3 w-5 h-5 items-center justify-center flex bg-green-500 text-white text-xs rounded-full">
            3
          </div>
        </div>

        {/* Admin Info */}
        <div className="flex items-center space-x-2">
          {/* Avatar */}
          {avatarUrl && (
            <Image
              src={avatarUrl}
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full border border-gray-300 shadow-sm"
            />
          )}

          {/* User Info */}
          <div className="flex flex-col items-start space-y-1">
            <span className="text-sm font-semibold text-gray-800">
              {firstName && lastName ? `${firstName} ${lastName}` : "Loading..."}
            </span>
            <span className="text-xs text-gray-600">
              {role !== "guest" ? role : ""}
            </span>
            {schoolName && (
              <span className="text-xs text-gray-500">
                {schoolName}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
