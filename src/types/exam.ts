// types/exam.ts
export interface Exam {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  subjectId: {
    _id: string;
    name: string;
  };
}
