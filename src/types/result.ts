import { Lesson } from "./lesson";

export interface Result {
  _id: string;
  examScore: number;
  testScore: number;
  assignmentScore: number;

  examId?: {
    _id: string;
    title: string;
    subjectId: {
      _id: string;
      name: string;
    };
  } | null;

  assignmentId?: {
    _id: string;
    lessonId: Lesson;
  } | null;

  testId?: {
    _id: string;
    lessonId: Lesson;
  } | null;

  studentId: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: {
      public_id: string;
      url: string;
    };
  };
}