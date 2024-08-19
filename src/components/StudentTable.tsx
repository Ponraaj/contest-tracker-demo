"use client";

import React, { useState, useEffect } from 'react';
import Filter from './FilterComponent';
import Table from './TableComponent';
import Pagination from './Pagination';
import { Student, Filters } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

const StudentsTable: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [filters, setFilters] = useState<Filters>({
    no_of_questions: null,
    status: null,
    dept: null,
    section: null,
    year: null,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContest, setSelectedContest] = useState('weekly_contest_409'); // Default contest

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

  const handleContestChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedContest(event.target.value);
  };

  const fetchData = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from(selectedContest)
      .select('username, no_of_questions, question_ids, finish_time, status, dept, year, section, rank');

    if (error) {
      console.error('Error fetching data:', error.message);
    } else {
      setStudents(data || []);
      setFilteredStudents(data || []);
      setCurrentPage(1); // Reset to first page whenever new data is fetched
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedContest]);

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
      <select onChange={handleContestChange} value={selectedContest}>
        <option value="weekly_contest_410">Weekly Contest 410</option>
        <option value="weekly_contest_411">Weekly Contest 411</option>
        <option value="biweekly_contest_137">Biweekly Contest 137</option>
        {/* Add more contests as needed */}
      </select>
      <h2 className="text-center pt-5 text-6xl">{selectedContest.replace(/_/g, ' ')}</h2>
      <center>
        <button className='border-black border-2 pl-5 pr-5 mt-10 w-30 rounded h-[70px] text-3xl' onClick={toggleFilters}>
          Filter
        </button>
      </center>
      {showFilters && (
        <Filter filters={filters} onFilterChange={handleFilterChange} />
      )}
      <Table students={currentStudents} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default StudentsTable;
