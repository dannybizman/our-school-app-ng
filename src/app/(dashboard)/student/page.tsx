
import EventCalendar from "@/components/EventCalendar";
import Announcements from "@/components/Announcements";
import ScheduleCalendar from "@/components/ScheduleCalendar";


const StudentPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* Left*/}
      <div className="w-full xl:w-2/3">
        {/* Student Activities */}
      <div className="h-full  bg-white dark:bg-black text-black dark:text-white transition-all duration-300 p-4 rounded-md">
      <h1 className="text-xl font-semibold">Schedule (Elementary 1)</h1>
        <ScheduleCalendar />
      </div>
      </div>  
      {/*Right*/}

      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        {/* Calendar */}
        <EventCalendar />
        <Announcements />
      </div>

    </div>
  )
}

export default StudentPage;