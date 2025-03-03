"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import CourseOverview from "./CourseOverview";
import StudentTable from "./StudentTable";
import { Course } from "../lib/types";

interface DashboardProps {
  courses: Course[];
}

const Dashboard: React.FC<DashboardProps> = ({ courses }) => {
  if (!courses || courses.length === 0) {
    return <div className="flex-1 p-6 text-center">No courses found</div>;
  }

  const [selectedCourseId, setSelectedCourseId] = useState<number>(
    courses[0].id
  );

  const selectedCourse =
    courses.find((course) => course.id === selectedCourseId) || courses[0];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        courses={courses}
        selectedCourseId={selectedCourseId}
        onSelectCourse={setSelectedCourseId}
      />

      <div className="flex-1 overflow-auto p-6">
        {selectedCourse && (
          <>
            <CourseOverview
              course={selectedCourse}
              enrolledStudentCount={selectedCourse.totalEnrollments}
            />
            <StudentTable
              students={selectedCourse.students || []}
              courseId={selectedCourse.id}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
