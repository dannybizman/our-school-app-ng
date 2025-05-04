
import { Inter } from "next/font/google";
import "./globals.css";
import NotificationProvider from "@/components/NotificationProvider";
import Providers from "@/components/Providers";
import GlobalLoader from "@/components/common/GlobalLoader"; 
import "@/utils/dayjs-setup"; 
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Our School App",
  description: "SYNCAT School Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          <NotificationProvider>
          <GlobalLoader />
            {children}
            </NotificationProvider>
        </Providers>
      </body>
    </html>
  );
}
