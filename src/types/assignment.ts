export interface Assignment {
  _id: string;
  title: string;
  startDate
  endDate: string;
  school?: string;
  lessonId: {
    _id: string;
    name: string;
    subjectId: {
      name: string;
    };
    teacherId: {
      firstName: string;
      lastName: string;
      avatar?: {
        public_id: string;
        url: string;
      };
    };    
    classId: {
      name: string;
    };
  };
}
