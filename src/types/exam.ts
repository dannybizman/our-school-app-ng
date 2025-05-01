// types/exam.ts
export interface Exam {
  _id: string;
  title: string;
  school?: string;
  startTime: string;
  endTime: string;
  subjectId: {
    _id: string;
    name: string;
  };
}
