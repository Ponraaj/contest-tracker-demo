"use client";

import React, { useState, useEffect } from 'react';
import Filter from './FilterComponent';
import Pagination from './Pagination';
import { Student, Filters } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import dynamic from 'next/dynamic';
// Import LineChart dynamically
const LineChart = dynamic(() => import('./Chart'), { ssr: false });

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
  const [selectedContest, setSelectedContest] = useState('weekly_contest_410');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(25);

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
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from(selectedContest)
        .select('leetcode_id,username, no_of_questions, question_ids, finish_time, status, dept, year, section, rank');

      if (error) throw error;

      setStudents(data || []);
      setFilteredStudents(data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
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
    setCurrentPage(1);
  }, [filters, students]);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const toggleExpandRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (filteredStudents.length === 0) {
    return <p>No students match the current filters.</p>;
  }

  return (
    <div>
      <select className='border-solid border-[1px] border-black w-[184px] h-[40px] bg-white' onChange={handleContestChange} value={selectedContest}>
        <option value="weekly_contest_410">Weekly Contest 410</option>
        <option value="weekly_contest_411">Weekly Contest 411</option>
        <option value="biweekly_contest_137">Biweekly Contest 137</option>
        {/* Add more contests as needed */}
      </select>
      <h2 className="text-center pt-5 text-6xl">{selectedContest.replace(/_/g, ' ').toUpperCase()}</h2>
      <center>
        <button className='border-black border-2 pl-5 pr-5 mt-10 w-30 rounded h-[70px] text-3xl' onClick={toggleFilters}>
          Filter
        </button>
      </center>
      {showFilters && <Filter filters={filters} onFilterChange={handleFilterChange} />}
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
            <React.Fragment key={index}>
              <tr className={`hover:bg-gray-300 ease-out ${expandedRow === index ? 'bg-gray-100' : ''}`} onClick={() => toggleExpandRow(index)}>
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

              {expandedRow === index && (
                <tr>
                  <td colSpan={9}>
                    <LineChart username={student.leetcode_id} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default StudentsTable;
