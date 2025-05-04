"use client";

import dynamic from "next/dynamic";
import UserCard from "@/components/UserCard";
import EventCalendar from "@/components/EventCalendar";
import Announcements from "@/components/Announcements";
import { getAllEvents, getAllParents, getAllStudents, getAllTeachers, getAllAttendances, getAllLessons, getAllExams, getAllAssignments, getAllTests } from "@/utils/api";
import { useEffect, useState } from "react";
import { Checkbox, Select } from "antd";
import { Exam } from "@/types/exam";
import { Assignment } from "@/types/assignment";
import { Test } from "@/types/test";
import { Lesson } from "@/types/lesson";
import ScheduleCalendar from "@/components/ScheduleCalendar";

const CountChart = dynamic(() => import("@/components/CountChart"), { ssr: false });
const AttendanceChart = dynamic(() => import("@/components/AttendanceChart"), { ssr: false });
const FinanceChart = dynamic(() => import("@/components/FinanceChart"), { ssr: false });

const { Option } = Select;

type EventType = "lesson" | "exam" | "assignment" | "test";

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  backgroundColor: string;
  resource: {
    type: EventType;
    subject?: string;
  };
};


const AdminPage = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [parentCount, setParentCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [boysCount, setBoysCount] = useState(0);
  const [girlsCount, setGirlsCount] = useState(0);
  const [attendanceChartData, setAttendanceChartData] = useState<{ name: string; present: number; absent: number }[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [filters, setFilters] = useState<Record<EventType, boolean>>({
    lesson: true,
    exam: true,
    assignment: true,
    test: true,
  });
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const filteredEvents = calendarEvents.filter((event) => {
    const isTypeVisible = filters[event.resource.type];
    const isSubjectVisible = !selectedSubject || event.resource.subject === selectedSubject;
    return isTypeVisible && isSubjectVisible;
  });

  console.log("🎛️ Active Type Filters:", filters);
  console.log("🎛️ Selected Subject Filter:", selectedSubject);
  console.log("📅 Filtered Events after applying filters:", filteredEvents);


  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [lessonsRes, examsRes, assignmentsRes, testsRes] = await Promise.all([
          getAllLessons(token),
          getAllExams(token).then(res => res.data),
          getAllAssignments(token).then(res => res.data),
          getAllTests(token).then(res => res.data),
        ]);

        const subjectsSet = new Set<string>();
        const allEvents: CalendarEvent[] = [];

        // Lessons
        lessonsRes.lessons.forEach((lesson: Lesson) => {
          const subjectName = lesson.subjectId?.name;
          if (subjectName) subjectsSet.add(subjectName);

          allEvents.push({
            title: `Lesson: ${lesson.name} | ${subjectName}`,
            start: new Date(lesson.startTime),
            end: new Date(lesson.endTime),
            backgroundColor: "#D4BEE4",
            resource: {
              type: "lesson",
              subject: subjectName,
            },
          });
        });

        // Exams
        examsRes.exams.forEach((exam: Exam) => {
          const subjectName = exam.subjectId?.name;
          if (subjectName) subjectsSet.add(subjectName);

          allEvents.push({
            title: `Exam: ${exam.title} | ${subjectName}`,
            start: new Date(exam.startTime),
            end: new Date(exam.endTime),
            backgroundColor: "#4CC9FE",
            resource: {
              type: "exam",
              subject: subjectName,
            },
          });
        });

        // Assignments
        assignmentsRes.assignments.forEach((assignment: Assignment) => {
          const subjectName = assignment.lessonId?.subjectId?.name;
          if (subjectName) subjectsSet.add(subjectName);

          allEvents.push({
            title: `Assignment: ${assignment.title} | ${subjectName}`,
            start: new Date(assignment.startDate),
            end: new Date(assignment.endDate),
            backgroundColor: "#FFBD73",
            resource: {
              type: "assignment",
              subject: subjectName,
            },
          });
        });

        // Tests
        testsRes.tests.forEach((test: Test) => {
          const subjectName = test.lessonId?.subjectId?.name;
          if (subjectName) subjectsSet.add(subjectName);

          allEvents.push({
            title: `Test: ${test.title} | ${subjectName}`,
            start: new Date(test.startDate),
            end: new Date(test.endDate),
            backgroundColor: "#10b981",
            resource: {
              type: "test",
              subject: subjectName,
            },
          });
        });

        setCalendarEvents(allEvents);
        setSubjects(Array.from(subjectsSet));
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const [students, teachersRes, parentsRes, eventsRes, attendancesRes] = await Promise.all([
        getAllStudents(token),
        getAllTeachers(token),
        getAllParents(token),
        getAllEvents(token),
        getAllAttendances(token),
      ]);

      setStudentCount(students.length);
      setTeacherCount(teachersRes.data.teachers.length);
      setParentCount(parentsRes.data.parents.length);
      setEventCount(eventsRes.data.events.length);

      const boys = students.filter((student: any) => student.sex === "MALE").length;
      const girls = students.filter((student: any) => student.sex === "FEMALE").length;
      setBoysCount(boys);
      setGirlsCount(girls);

      // Process attendance data into chart format
      const attendances = attendancesRes.data.attendances;
      const dayMap: { [key: string]: { present: number; absent: number } } = {
        Mon: { present: 0, absent: 0 },
        Tue: { present: 0, absent: 0 },
        Wed: { present: 0, absent: 0 },
        Thur: { present: 0, absent: 0 },
        Fri: { present: 0, absent: 0 },
      };

      attendances.forEach((attendance: any) => {
        const date = new Date(attendance.date);
        const dayIndex = date.getDay(); // 0=Sun, 1=Mon,...6=Sat
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
        const dayName = dayNames[dayIndex];
        if (dayMap[dayName]) {
          if (attendance.present) {
            dayMap[dayName].present += 1;
          } else {
            dayMap[dayName].absent += 1;
          }
        }
      });

      const chartData = Object.keys(dayMap).map((day) => ({
        name: day,
        present: dayMap[day].present,
        absent: dayMap[day].absent,
      }));

      setAttendanceChartData(chartData);
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="Student" count={studentCount} />
          <UserCard type="Teacher" count={teacherCount} />
          <UserCard type="Parent" count={parentCount} />
          <UserCard type="Event" count={eventCount} />
        </div>

        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:1/3 h-[450px]">
            <CountChart boysCount={boysCount} girlsCount={girlsCount} />
          </div>

          <div className="w-full lg:2/3 h-[450px]">
            <AttendanceChart attendanceData={attendanceChartData} />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-4 flex-wrap">
          {["lesson", "exam", "assignment", "test"].map((type) => (
            <label key={type} className="flex items-center gap-2">
              <Checkbox
                checked={filters[type as EventType]}
                onChange={(e) =>
                  setFilters({ ...filters, [type]: e.target.checked })
                }
              />
              <span className="capitalize">{type}s</span>
            </label>
          ))}

          {/* Subject Filter */}
          <Select
            allowClear
            placeholder="Filter by Subject"
            onChange={(value) => setSelectedSubject(value)}
            className="w-52"
          >
            {subjects.map((subject) => (
              <Option key={subject} value={subject}>
                {subject}
              </Option>
            ))}
          </Select>
        </div>
        <div className="h-[500px] sm:h-[600px] md:h-[700px] xl:h-[calc(100vh-260px)]">
          <ScheduleCalendar calendarEvents={filteredEvents} />
        </div>
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>

      <div className="w-full lg:w-1/3 flex flex-col gap-8 bg-gray-100 dark:bg-gray-900">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
