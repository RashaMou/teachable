export interface Course {
  id: number;
  name: string;
  heading: string;
  image_url: string;
  totalEnrollments: number;
  newEnrollmentsThisMonth: number;
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
