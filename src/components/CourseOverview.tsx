import { Course } from "../lib/types";

interface CourseOverviewProps {
  course: Course;
}

const CourseOverview: React.FC<CourseOverviewProps> = ({ course }) => {
  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
          <p className="mt-1 text-gray-600">{course.heading}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-md bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Enrolled Students</p>
          <p className="mt-1 text-xl font-semibold text-gray-500">
            {course.totalEnrollments}
          </p>
        </div>
        <div className="rounded-md bg-gray-50 p-4">
          <p className="text-sm text-gray-500">New This Month</p>
          <p className="mt-1 text-xl font-semibold text-gray-500">
            {course.enrollmentsThisMonth}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
