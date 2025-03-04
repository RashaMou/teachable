"use client";

import { useState, useEffect, useMemo } from "react";
import { Student } from "../lib/types";
import ProgressBar from "./ProgressBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface StudentTableProps {
  students: Student[];
  courseId: number;
}

const STUDENTS_PER_PAGE = 10;

const StudentTable: React.FC<StudentTableProps> = ({ students, courseId }) => {
  console.log("students", students);
  const [sortField, setSortField] = useState<keyof Student>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [students, sortField, sortDirection]);

  // Paginate students
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * STUDENTS_PER_PAGE;
    return sortedStudents.slice(startIndex, startIndex + STUDENTS_PER_PAGE);
  }, [sortedStudents, currentPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(students.length / STUDENTS_PER_PAGE)
  );

  const handleSort = (field: keyof Student) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    // Reset to page 1 when sort changes
    setCurrentPage(1);
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Enrolled Students
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Name
                  {sortField === "name" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center">
                  Email
                  {sortField === "email" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                onClick={() => handleSort("enrolledAt")}
              >
                <div className="flex items-center">
                  Enrollment Date
                  {sortField === "enrolledAt" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                Completed
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {student.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{student.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(student.enrolledAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <ProgressBar value={student.percentComplete} max={100} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {students.length > 0
                  ? (currentPage - 1) * STUDENTS_PER_PAGE + 1
                  : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * STUDENTS_PER_PAGE, students.length)}
              </span>{" "}
              of <span className="font-medium">{students.length}</span> results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                className="relative inline-flex cursor-pointer items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button className="relative inline-flex items-center border border-blue-500 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
                {currentPage}
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex cursor-pointer items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;
