
// Define the Avatar type
export interface Avatar {
   public_id: string;
   url: string;
 }

// Define the Teacher type
export interface Teacher {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  password?: string;
  bloodType?: string;
  sex: 'MALE' | 'FEMALE';
  avatar: Avatar;
  createdAt: string;
  subjects: string[];
  lessons: string[];
  classes: string[];
  role: 'teacher';
}