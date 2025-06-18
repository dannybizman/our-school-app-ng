// Define the Avatar type
export interface Avatar {
  public_id: string; 
  url: string;
}

// Define the Parent type
export interface Parent {
 _id: string;
 username: string;
 firstName: string;
 lastName: string;
 email?: string;
 phoneNumber?: string;
 address?: string;
 password?: string; 
 sex: 'MALE' | 'FEMALE';
 avatar: Avatar;
 createdAt: string;
 birthday?: string;
 students: string[];
 role: 'parent';
 school?: string; 
} 