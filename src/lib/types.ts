export interface Course {
  id: string;
  name: string;
  heading: string;
  image_url: string;
  totalEnrollments: number;
  newEnrollmentsThisMonth: number;
  is_published?: boolean;
  students: Student[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  enrolledAt: string;
  isActive: boolean;
  percentComplete: number;
}
