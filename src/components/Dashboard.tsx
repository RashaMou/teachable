"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import CourseOverview from "./CourseOverview";
import StudentTable from "./StudentTable";
import { Course } from "../lib/types";

interface DashboardProps {
  courses: Course[];
}

const Dashboard: React.FC<DashboardProps> = ({ courses }) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courses.length > 0 ? courses[0].id : ""
  );

  const selectedCourse =
    courses.find((course) => course.id === selectedCourseId) || courses[0];

  useEffect(() => {
    console.log("Selected course:", selectedCourse);
    console.log("Students:", selectedCourse?.students);
  }, [selectedCourse]);

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
            <CourseOverview course={selectedCourse} />
            <StudentTable students={selectedCourse.students || []} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
