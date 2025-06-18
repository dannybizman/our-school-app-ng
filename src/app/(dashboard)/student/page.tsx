"use client";

import { useEffect, useState } from "react";
import EventCalendar from "@/components/EventCalendar";
import Announcements from "@/components/Announcements";
import ScheduleCalendar from "@/components/ScheduleCalendar";
import { Exam } from "@/types/exam";
import { Assignment } from "@/types/assignment";
import { Test } from "@/types/test";
import { Lesson } from "@/types/lesson";
import { getAllLessons, getAllExams, getAllAssignments, getAllTests } from "@/utils/api";
import { Checkbox, Select } from "antd";

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

const StudentPage = () => {

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [filters, setFilters] = useState<Record<EventType, boolean>>({
    lesson: true,
    exam: true,
    assignment: true,
    test: true,
  });
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Filtered Events
  const filteredEvents = calendarEvents.filter((event) => {
    const isTypeVisible = filters[event.resource.type];
    const isSubjectVisible = !selectedSubject || event.resource.subject === selectedSubject;
    return isTypeVisible && isSubjectVisible;
  });

  console.log("🎛️ Active Type Filters:", filters);
  console.log("🎛️ Selected Subject Filter:", selectedSubject);
  console.log("📅 Filtered Events after applying filters:", filteredEvents);


  // Fetch Events
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
            backgroundColor: "#81E7AF",
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

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* Left */}
      <div className="w-full xl:w-2/3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Schedule</h2>
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
      </div>
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        {/* Calendar */}
        <EventCalendar />
        <Announcements />
      </div>

    </div>
  )
}

export default StudentPage;