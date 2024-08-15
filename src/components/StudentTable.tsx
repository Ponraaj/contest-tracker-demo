"use client";

import React, { useState, useEffect } from 'react';
import FilterComponent from './FilterComponent';
import TableComponent from './TableComponent';
import { Student, Filters } from '@/lib/types';
import Pagination from './Pagination';

const StudentsTable: React.FC<{ students: Student[] }> = ({ students }) => {
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);
  const [filters, setFilters] = useState<Filters>({
    no_of_questions: null,
    status: null,
    dept: null,
    section: null,
    year: null,
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(25); // Adjust as needed

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;

    const newValue = name === "no_of_questions" ? (value === "" ? null : parseInt(value)) : value || null;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: newValue,
    }));
  };

  useEffect(() => {
    let filtered = students;

    if (filters.no_of_questions !== null) {
      filtered = filtered.filter((student) => student.no_of_questions === filters.no_of_questions!);
    }

    if (filters.status !== null) {
      filtered = filtered.filter((student) => student.status === filters.status);
    }

    if (filters.dept !== null) {
      filtered = filtered.filter((student) => student.dept === filters.dept);
    }

    if (filters.year !== null) {
      filtered = filtered.filter((student) => student.year === filters.year);
    }

    if (filters.section !== null) {
      filtered = filtered.filter((student) => student.section === filters.section);
    }

    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to first page whenever filters change
  }, [filters, students]);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return (
    <div>
      <h2 className="text-center pt-5 text-6xl">Weekly Contest 410</h2>
      <center>
        <button className='border-black border-2 pl-5 pr-5 mt-10 w-30 rounded h-[70px] text-3xl' onClick={toggleFilters}>
          Filter
        </button>
      </center>
      {showFilters && (
        <div className="flex justify-center pt-10">
          {["status", "year", "dept", "section", "no_of_questions"].map((filter) => (
            <select
              key={filter}
              className="h-[70px] text-2xl mr-10 rounded"
              name={filter}
              onChange={handleFilterChange}
              defaultValue=""
            >
              <option value="" disabled hidden>
                {filter.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
              </option>
              <option value="">All</option>
              {filter === "status" && (
                <>
                  <option value="attended">Attended</option>
                  <option value="not attended">Not Attended</option>
                </>
              )}
              {filter === "year" && (
                <>
                  <option value="2">2nd year</option>
                  <option value="3">3rd year</option>
                </>
              )}
              {filter === "dept" && (
                <>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                </>
              )}
              {filter === "section" && (
                <>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </>
              )}
              {filter === "no_of_questions" && [4, 3, 2, 1, 0].map((val) => <option key={val} value={val}>{val}</option>)}
            </select>
          ))}
        </div>
      )}
      <table className="ml-[110px] mr-[100px]">
        <thead>
          <tr>
            <th className="w-[100px]">Rank</th>
            <th className="w-[239px]">Username</th>
            <th className="w-[150px]">Department</th>
            <th className="w-[150px]">Section</th>
            <th className="w-[100px]">Year</th>
            <th className="w-[150px]">No. of Questions</th>
            <th className="w-[150px]">Question ID</th>
            <th className="w-[60px]">Finish Time</th>
            <th className="w-[60px]">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student, index) => (
            <tr key={index}>
              <td>{student.rank}</td>
              <td>{student.username}</td>
              <td>{student.dept}</td>
              <td>{student.section}</td>
              <td>{student.year}</td>
              <td>{student.no_of_questions}</td>
              <td>{student.question_ids?.join(', ')}</td>
              <td>{student.finish_time}</td>
              <td>{student.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default StudentsTable;