export interface Lesson {
  _id: string;
  name: string;
  day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';
  startTime: Date | string;
  endTime: Date | string;
  subjectId: string;
  classId: string;
  teacherId: string;
}

