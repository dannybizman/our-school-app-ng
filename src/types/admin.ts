// Define the Avatar type
export interface Avatar {
   public_id: string;
   url: string;
 }
 
 // Define the Admin type
 export interface Admin {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  sex: 'MALE' | 'FEMALE';
  bloodType?: string;
  birthday?: string;
  password?: string;
  avatar: Avatar;
  role: 'admin';
  resetPasswordToken?: string;
  resetPasswordExpires?: string;
  createdAt: string;
  updatedAt: string;
}
 