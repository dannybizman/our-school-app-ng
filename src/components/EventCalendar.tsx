"use client"
import Image from "next/image";
import { useState } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";



type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];


const events = [
   {
      id: 1,
      title: "Lorem ipsum dolor",
      time: "12:00 PM - 2:00PM",
      description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor",
   },

   {
      id: 2,
      title: "Lorem ipsum dolor",
      time: "12:00 PM - 2:00PM",
      description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor",
   },


   {
      id: 3,
      title: "Lorem ipsum dolor",
      time: "12:00 PM - 2:00PM",
      description: "Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor",
   }
]

const EventCalendar = () => {
   const [value, onChange] = useState<Value>(new Date());
   return (
      <div className='bg-gray-100 dark:bg-gray-900 p-4 rounded-md'>
         <Calendar onChange={onChange} value={value} />

         <div className="flex items-center justify-between mt-4">
            <h1 className="text-xl font-semibold my-4">Events</h1>
            <Image src="/moreDark.png" alt="" width={20} height={20} />
         </div>
         <div className="flex flex-col gap-4">
            {events.map(event =>
               <div className="p-5 rounded-md border-2 border-gray-200 border-t-4 odd:border-t-syncPurpleLight even:border-t-syncSkyLight" key={event.id}>
                  <div className="flex items-center justify-between">

                     <h1 className="font-semibold text-gray-600">{event.title}</h1>
                     <span className="text-gray-400 text-sx">{event.time}</span>
                  </div>
                  <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
               </div>
            )}
         </div>

      </div>
   )
}

export default EventCalendar; 