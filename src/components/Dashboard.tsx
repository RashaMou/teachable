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

  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  const selectedCourse =
    courses.find((course) => course.id === selectedCourseId) || courses[0];

  useEffect(() => {
    if (selectedCourseId) {
      setIsLoadingStudents(true);
      fetch(`/api/courses/${selectedCourseId}/students`)
        .then((res) => res.json())
        .then((data) => {
          setStudents(data);
          setIsLoadingStudents(false);
        })
        .catch((error) => {
          console.error(`Error fetching students: ${error}`);
          setIsLoadingStudents(false);
        });
    }
  }, [selectedCourseId]);

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
            <CourseOverview course={selectedCourse} students={students} />
            <StudentTable
              students={students}
              isLoadingStudents={isLoadingStudents}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
