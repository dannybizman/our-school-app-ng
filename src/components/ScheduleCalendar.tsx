"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";

interface ScheduleCalendarProps {
  calendarEvents: any[];
  calendarHeight?: string;
}

const ScheduleCalendar = ({ calendarEvents, calendarHeight }: ScheduleCalendarProps) => {
  return (
<div className="w-full overflow-x-auto rounded-lg border p-2 bg-white dark:bg-black">
  <FullCalendar
    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
    initialView="dayGridMonth"
    events={calendarEvents}
    height={calendarHeight || "auto"}
    headerToolbar={{
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridDay",
    }}
    nowIndicator={true}
    selectable={true}
    editable={false}
    eventDisplay="block"
    eventDidMount={(info) => {
      info.el.setAttribute("title", info.event.title);
    }}
    eventContent={(arg) => {
      const start = arg.event.start
        ? dayjs(arg.event.start).format("DD MMM YYYY HH:mm")
        : "N/A";
      const end = arg.event.end
        ? dayjs(arg.event.end).format("DD MMM YYYY HH:mm")
        : "N/A";
    
      return (
        <div className="text-xs sm:text-sm whitespace-normal break-words text-black">
          <div className="font-semibold truncate sm:whitespace-normal">{arg.event.title}</div>
          <div className="mt-1">
            <strong>Start:</strong> {start}
            <br />
            <strong>End:</strong> {end}
          </div>
        </div>
      );
    }}
    
  />
</div>

  );
};

export default ScheduleCalendar;
