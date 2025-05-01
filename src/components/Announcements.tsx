"use client"

import { useEffect, useState } from 'react'
import { getAllAnnouncements } from '@/utils/api'
import { Announcement } from '@/types/announcement'
import { useSnackbar } from "notistack"
import CustomSnackbar from "@/components/CustomSnackbar"
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import Link from 'next/link'
import dayjs from "dayjs";


const Announcements = () => {
   const [announcements, setAnnouncements] = useState<Announcement[]>([])
   const { enqueueSnackbar } = useSnackbar()
   const loading = useSelector((state: RootState) => state.loading.isLoading);
   const dispatch = useDispatch();

   useEffect(() => {
      const fetchAnnouncements = async () => {
         const token = localStorage.getItem("token")
         if (!token) return
         try {
            dispatch(startLoading());
            const response = await getAllAnnouncements(token)
            if (response.data.success) {
               setAnnouncements(response.data.announcements)
            } else {
               enqueueSnackbar("Failed to fetch announcements.", {
                  variant: "error",
                  content: (key) => (
                     <CustomSnackbar id={key} message="Failed to fetch announcements." variant="error" />
                  ),
               })
            }
         } catch (error) {
            enqueueSnackbar("Failed to fetch announcements.", {
               variant: "error",
               content: (key) => (
                  <CustomSnackbar id={key} message="Failed to fetch announcements." variant="error" />
               ),
            })
         } finally {
            dispatch(stopLoading());
         }
      }

      fetchAnnouncements()
   }, [])

   return (
      <div className='bg-gray-100 dark:bg-gray-900 p-4 rounded-md'>
         <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Announcements</h1>
            <span className="text-xs text-black dark:text-white"><Link href="/list/announcements">View all</Link></span>
         </div>

         <div className="flex flex-col gap-4 mt-4">
            {announcements.map((announcement, index) => (
               <div
                  key={announcement._id}
                  className={`rounded-md p-4 ${index % 3 === 0
                     ? 'bg-syncSkyLight'
                     : index % 3 === 1
                        ? 'bg-syncPurpleLight'
                        : 'bg-syncOrangeLight'
                     }`}
               >
                  <div className="flex items-center justify-between">
                     <h2 className="font-medium">{announcement.title}</h2>
                     <span className="text-xs text-black dark:text-white bg-gray-100 dark:bg-gray-900 rounded-md px-1 py-1">
                        <span className="text-xs text-black dark:text-white bg-gray-100 dark:bg-gray-900 rounded-md px-1 py-1">
                        {dayjs(announcement.startTime).format("MMM D, YYYY h:mm A")} - {dayjs(announcement.endTime).format("MMM D, YYYY h:mm A")}
                        </span>

                     </span>

                  </div>
                  <p className="text-white dark:text-dark text-sm mt-1">{announcement.description}</p>
               </div>
            ))}

            {/* Optionally handle no announcements */}
            {announcements.length === 0 && (
               <div className="text-center text-white dark:text-dark text-sm py-4">No announcements Yet.</div>
            )}
         </div>
      </div>
   )
}

export default Announcements
