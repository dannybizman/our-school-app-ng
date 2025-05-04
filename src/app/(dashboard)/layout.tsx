"use client";

import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/components/ThemeProvider";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Providers from "@/components/Providers"; 
import GlobalLoader from "@/components/common/GlobalLoader";
import "@/utils/dayjs-setup"; 

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loaded } = useSelector((state: RootState) => state.role);

  if (!loaded) {
    return <GlobalLoader />; 
  }

  return (
    <Providers>
    <ThemeProvider>
      <div className="h-screen flex">
        {/* Left */}
        <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 dark:bg-black bg-white">
          <Link
            href="/"
            className="flex items-center justify-center lg:justify-start gap-2 bg-white dark:bg-black text-black dark:text-white"
          >
            <Image src="/logo.png" alt="logo" width={32} height={32} />
            <span className="hidden lg:block font-bold">Our School NG</span>
          </Link>
          <Menu />
        </div>

        {/* Right */}
        <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#e8edea] overflow-scroll flex flex-col dark:bg-black text-black dark:text-white">
          <Navbar />
          {children}
        </div>
      </div>
    </ThemeProvider>
    </Providers>
  );
}
