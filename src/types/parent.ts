// Define the Parent type
export interface Parent {
   _id: string;
   username: string;
   name: string;
   surname: string;
   email?: string;
   phone: string;
   address?: string;
   password?: string;
   createdAt: string;
   students: string[];
   role: 'parent';
 }