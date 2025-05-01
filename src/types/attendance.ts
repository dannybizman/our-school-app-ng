import { Student } from "./student";
import { Lesson } from "./lesson";

export interface Attendance {
  _id: string;
  date: string;
  present: boolean;
  studentId: Student | string;
  lessonId: Lesson | string;
  school?: string;
}
