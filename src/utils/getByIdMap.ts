import {
   getSubjectById,
   getClassById,
   getLessonById,
   getResultById,
   getStudentById,
   getTeacherById,
   getExamById,
   getEventById,
   getAttendanceById,
   getTestById,
   getAssignmentById,
   getAnnouncementById,
 } from "@/utils/api";
 
 export const getByIdMap: Record<string, Function> = {
   subject: getSubjectById,
   class: getClassById,
   lesson: getLessonById,
   result: getResultById,
   student: getStudentById,
   teacher: getTeacherById,
   exam: getExamById,
   event: getEventById,
   attendance: getAttendanceById,
   test: getTestById,
   assignment: getAssignmentById,
   announcement: getAnnouncementById,
 };
 