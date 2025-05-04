"use client"
import Image from "next/image";
import { useEffect, useState } from 'react'
import { getAllEvents } from '@/utils/api'
import { Event } from '@/types/event'
import { useSnackbar } from "notistack"
import CustomSnackbar from "@/components/CustomSnackbar"
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slices/loadingSlice";
import Link from 'next/link'
import dayjs from "dayjs";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { RootState } from "@/redux/store";



const EventCalendar = () => {

   const [events, setEvents] = useState<Event[]>([])
   const { enqueueSnackbar } = useSnackbar()
   const loading = useSelector((state: RootState) => state.loading.isLoading);
   const dispatch = useDispatch();
   const [value, onChange] = useState<Value>(new Date());

   useEffect(() => {
      const fetchEvents = async () => {
         const token = localStorage.getItem("token")
         if (!token) return
         try {
            dispatch(startLoading());
            const response = await getAllEvents(token)
            if (response.data.success) {
               setEvents(response.data.events)
            } else {
               enqueueSnackbar("Failed to fetch events.", {
                  variant: "error",
                  content: (key) => (
                     <CustomSnackbar id={key} message="Failed to fetch events." variant="error" />
                  ),
               })
            }
         } catch (error) {
            enqueueSnackbar("Failed to fetch events.", {
               variant: "error",
               content: (key) => (
                  <CustomSnackbar id={key} message="Failed to fetch events." variant="error" />
               ),
            })
         } finally {
            dispatch(stopLoading());
         }
      }

      fetchEvents()
   }, [])


   return (
      <div className='bg-gray-100 dark:bg-gray-900 p-4 rounded-md'>
         <Calendar onChange={onChange} value={value} />

         <div className="flex items-center justify-between mt-4">
            <h1 className="text-xl font-semibold my-4">Events</h1>
            <span className="text-xs text-black dark:text-white"><Link href="/list/events">View all</Link></span>
         </div>
         <div className="flex flex-col gap-4">
            {events.map(event =>
               <div className="p-5 rounded-md border-2 border-gray-200 border-t-4 odd:border-t-syncPurpleLight even:border-t-syncSkyLight" key={event._id}>
                  <div className="flex items-center justify-between">
                     <h1 className="font-semibold text-gray-600">{event.title}</h1>
                     <span className="text-gray-400 text-sx">
                        {dayjs(event.startTime).format("MMM D, YYYY h:mm A")} - {dayjs(event.endTime).format("MMM D, YYYY h:mm A")}
                     </span>
                  </div>
                  <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
               </div>
            )}
         </div>


      </div>
   )
}

export default EventCalendar; 