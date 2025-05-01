
// Define the Avatar type
export interface Avatar {
   public_id: string;
   url: string;
 }

// Define the Student type
export interface Student {
   _id: string;
   username: string;
   firstName: string;
   lastName: string;
   address?: string;
   password?: string;
   bloodType?: string;
   school?: string;
   sex: 'MALE' | 'FEMALE';
   avatar: Avatar;
   createdAt: string;
   classId: {
    _id: string;
    name: string;
    gradeLevel: number;
  };
   role: 'student';
 }