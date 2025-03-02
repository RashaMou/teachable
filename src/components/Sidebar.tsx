import { Course } from "../lib/types";

interface SidebarProps {
  courses: Course[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  courses,
  selectedCourseId,
  onSelectCourse,
}) => {
  return (
    <div className="h-screen w-64 overflow-y-auto border-r border-gray-200 bg-gray-50 p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Course Dashboard</h2>
        <p className="text-sm text-gray-500">Select a course to view details</p>
      </div>

      <div className="space-y-1">
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => onSelectCourse(course.id)}
            className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
              selectedCourseId === course.id
                ? "bg-blue-100 font-medium text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {course.name}
            <span className="ml-2 rounded-full bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600">
              {course.totalEnrollments}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
