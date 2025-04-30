"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useRestoreRoleFromToken from "@/hooks/useRestoreRoleFromToken";

const HeaderModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { theme, toggleTheme } = useTheme();
  // Restore role & avatar on component mount
  useRestoreRoleFromToken();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden"); // Prevent scrolling
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);



  const { value: role, avatarUrl, firstName, lastName } = useSelector(
    (state: RootState) => state.role
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 w-full h-full">
      <div className="bg-[#161616] dark:bg-white text-white dark:text-black rounded-2xl w-full max-w-md p-6 relative shadow-xl">
        {/* Close Button */}
        <button
          className="absolute top-5 right-5 text-gray-400 dark:text-black hover:text-white dark:hover-text-black transition"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Navigation */}
        <nav className="space-y-4 mb-12">
          <div className="flex items-center space-x-3">
            {/* Logo Section */}
            <Link href="/">
              <Image
                src="/logo.png"
                alt="App Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
          </div>
          <ul className="space-y-9 w-full">
            <li>
              <Link
                href="/"
                className="block border-b border-gray-700 dark:border-black pb-2 text-gray-300 dark:text-black hover:text-white dark:hover-text-black"
                onClick={onClose}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block border-b border-gray-700 dark:border-black pb-2 text-gray-300 dark:text-black hover:text-white dark:hover-text-black"
                onClick={onClose}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/plans"
                className="block border-b border-gray-700 dark:border-black pb-2 text-gray-300 dark:text-black hover:text-white dark:hover-text-black"
                onClick={onClose}
              >
                Plans
              </Link>
            </li>
            <li>
              <Link
                href="/articles"
                className="block border-b border-gray-700 dark:border-black pb-2 text-gray-300 dark:text-black hover:text-white dark:hover-text-black"
                onClick={onClose}
              >
                Articles
              </Link>
            </li>

            {/* Conditionally Render "Get Started" & "Login" or Admin Avatar */}

            {role === 'guest' && (
              <>

                <li>
                  <Link
                    href="/login"
                    className="block text-gray-300 dark:text-black hover:text-white dark:hover-text-black"
                    onClick={onClose}
                  >
                    Login
                  </Link>
                </li>
              </>
            )}

            {role !== 'guest' && avatarUrl && (
              <li className="flex items-center space-x-3 mt-4">
                <Link href="/admin" onClick={onClose}>
                  <Image
                    src={avatarUrl}
                    alt="Admin Avatar"
                    width={40}
                    height={40}
                    className="rounded-full border border-gray-500"
                  />
                </Link>
                {/* <span className="text-gray-300 dark:text-black">
                  {username}
                </span> */}
              </li>
            )}
          </ul>
        </nav>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="p-4 py-3 rounded-full">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </div>
  );
};

export default HeaderModal;
