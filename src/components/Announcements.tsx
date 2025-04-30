"use client"


const Announcements = () => {
   return (
      <div className='bg-gray-100 dark:bg-gray-900 p-4 rounded-md'>
         <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Announcements</h1>
            <span className="text-xs text-gray-300">View all</span>
         </div>
         <div className="flex flex-col gap-4 mt-4">

            <div className="bg-syncSkyLight rounded-md p-4">
               <div className="flex items-center justify-between">
                  <h2 className="font-medium">Lorem ipsum dolor.</h2>
                  <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-01-01</span>
               </div>
               <p className="text-gray-400 text-sm mt-1">
                  Lorem ipsum dolor Lorem ipsum dolor Lorem
                  ipsum dolor Lorem ipsum dolor Lorem ipsum dolor
               </p>
            </div>

            <div className="bg-syncPurpleLight rounded-md p-4">
               <div className="flex items-center justify-between">
                  <h2 className="font-medium">Lorem ipsum dolor.</h2>
                  <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-01-01</span>
               </div>
               <p className="text-gray-400 text-sm mt-1">
                  Lorem ipsum dolor Lorem ipsum dolor Lorem
                  ipsum dolor Lorem ipsum dolor Lorem ipsum dolor
               </p>
            </div>

            <div className="bg-syncOrangeLight rounded-md p-4">
               <div className="flex items-center justify-between">
                  <h2 className="font-medium">Lorem ipsum dolor.</h2>
                  <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-01-01</span>
               </div>
               <p className="text-gray-400 text-sm mt-1">
                  Lorem ipsum dolor Lorem ipsum dolor Lorem
                  ipsum dolor Lorem ipsum dolor Lorem ipsum dolor
               </p>
            </div>

         </div>
      </div>
   )
}

export default Announcements;