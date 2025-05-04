"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import HeaderModal from "./HeaderModal";
import { useTheme } from "@/components/ThemeProvider";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useRestoreRoleFromToken from "@/hooks/useRestoreRoleFromToken";
import { useRouter } from "next/navigation";
import { ExpandAltOutlined } from "@ant-design/icons";
import LoginSelectorModal from "@/components/LoginSelectorModal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  // Restore role on mount
  useRestoreRoleFromToken();

  const role = useSelector((state: RootState) => state.role.value);
  const avatarUrl = useSelector((state: RootState) => state.role.avatarUrl);

  const handleAvatarClick = () => {
    // Redirect to dashboard or user profile based on role
    if (role === "admin") {
      router.push("/admin");
    } else if (role === "teacher") {
      router.push("/teacher");
    } else if (role === "student") {
      router.push("/student");
    } else if (role === "parent") {
      router.push("/parent");
    } else {
      // fallback or guest login
      setLoginModalOpen(true);
    }
  };

  return (
    <header className="flex justify-between items-center p-4 w-full bg-gray-100 dark:bg-black">
      <div className="flex items-center space-x-3">
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

      <nav className="hidden md:flex space-x-4 bg-white dark:bg-syncSkyLight p-2 rounded-full shadow dark:shadow">
        <Link href="/" className="px-4 py-2 rounded-full text-gray-700 dark:text-black hover:bg-syncPurpleLight">Home</Link>
        <Link href="/about" className="px-4 py-2 rounded-full text-gray-700 dark:text-black hover:bg-syncPurpleLight">About</Link>
        <Link href="/plans" className="px-4 py-2 rounded-full text-gray-700 dark:text-black hover:bg-syncPurpleLight">Plans</Link>
        <Link href="/articles" className="px-4 py-2 rounded-full text-gray-700 dark:text-black hover:bg-syncPurpleLight">Articles</Link>

        {role === 'guest' && (
          <>
            <button onClick={() => setLoginModalOpen(true)} className="px-4 py-2 rounded-full text-gray-700 dark:text-black hover:bg-syncPurpleLight">
              Login
            </button>
            <LoginSelectorModal
              open={loginModalOpen}
              onClose={() => setLoginModalOpen(false)}
            />
          </>
        )}
      </nav>

      <div className="flex items-center space-x-4">
        {role !== 'guest' && avatarUrl && (
          <Image
            src={avatarUrl}
            alt="User Avatar"
            width={40}
            height={40}
            onClick={handleAvatarClick}
            className="rounded-full border border-gray-300 shadow-sm cursor-pointer"
          />
        )}

        <button onClick={toggleTheme} className="p-4 py-3 rounded-full text-lg">
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <ExpandAltOutlined
          onClick={() => setIsOpen(true)}
          className="md:hidden p-2 py-2 px-2 rounded-full bg-syncPurple hover:bg-syncPurpleLight text-medium"
        />

        <HeaderModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </header>
  );
};

export default Header;
