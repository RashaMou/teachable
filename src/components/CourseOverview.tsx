import { Course } from "../lib/types";

interface CourseOverviewProps {
  course: Course;
  enrolledStudentCount: number;
}

const CourseOverview: React.FC<CourseOverviewProps> = ({
  course,
  enrolledStudentCount,
}) => {
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
          <p className="mt-1 text-xl font-semibold">{enrolledStudentCount}</p>
        </div>
        <div className="rounded-md bg-gray-50 p-4">
          <p className="text-sm text-gray-500">New This Month</p>
          <p className="mt-1 text-xl font-semibold">
            {
              (
                course.students?.filter((s) => {
                  const enrollmentDate = new Date(s.enrolledAt);
                  const currentDate = new Date();
                  return (
                    enrollmentDate.getMonth() === currentDate.getMonth() &&
                    enrollmentDate.getFullYear() === currentDate.getFullYear()
                  );
                }) || []
              ).length
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
