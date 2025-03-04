export interface Course {
  id: number;
  name: string;
  heading: string;
  imageUrl: string;
  totalEnrollments: number;
  enrollmentsThisMonth: number;
  students: Student[];
}

export interface Student {
  id: number;
  name: string;
  email: string;
  enrolledAt: string;
  percentComplete: number;
}

export interface Enrollment {
  user_id: number;
  enrolled_at: string;
  completed_at: string | null;
  percent_complete: number;
  expires_at: string | null;
}

export interface PaginatedStudents {
  students: Student[];
  meta: Meta;
}

export interface User {
  email: string;
  name: string;
  id: number;
}

interface Meta {
  page: number;
  total: number;
  number_of_pages: number;
  from: number;
  to: number;
  per_page: number;
}

export interface Users {
  users: User[];
  meta: Meta;
}

export interface TeachableUserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  last_sign_in_ip: string | null;
  courses: Array<{
    course_id: number;
    course_name: string;
    enrolled_at: string;
    is_active_enrollment: boolean;
    completed_at: string | null;
    percent_complete: number;
  }>;
}
