export interface User {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    userType: 'Job Seeker' | 'Agency';
    hobbies: string[];
    profileImage?: File;
    resume?: File;
  }
  
  export interface LoginFormValues {
    email: string;
    password: string;
  }
  