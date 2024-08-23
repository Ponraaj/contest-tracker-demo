"use client";

import React, { useState, useEffect } from 'react';
import Filter from './FilterComponent';
import Pagination from './Pagination';
import { Student, Filters } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ThreeDots } from 'react-loader-spinner';

const LineChart = dynamic(() => import('./Chart'), { ssr: false });
const DoughnutChart= dynamic(() => import('./CountChart'), { ssr: false });

const StudentsTable: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [filters, setFilters] = useState<Filters>({
    no_of_questions: null,
    status: null,
    dept: null,
    section: null,
    year: null,
    college: null,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [contests, setContests] = useState<string[]>([]);
  const [selectedContest, setSelectedContest] = useState<string>('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(25);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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

  const fetchContests = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('contests')
      .select('contest_name')
      .order('created_at', { ascending: false }); // Sorting to get the most recent contest

    if (error) {
      console.error('Error fetching contests:', error.message);
      setError('Failed to fetch contest data');
      return;
    }

    if (data && data.length > 0) {
      const contestNames = data.map(item => item.contest_name);
      setContests(contestNames);
      setSelectedContest(contestNames[0]); // Set the most recent contest as default
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from(selectedContest)
        .select('leetcode_id,username, no_of_questions, question_ids, finish_time, status, dept, year, section, rank, college');

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
    fetchContests(); // Fetch contests on component mount
  }, []);

  useEffect(() => {
    if (selectedContest) {
      fetchData(); // Fetch data whenever the selected contest changes
    }
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

    if (filters.college !== null) {
      filtered = filtered.filter((student) => student.college === filters.college);
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
    return <div className='flex justify-center justify-items-center pt-[410px]'><ThreeDots
    visible={true}
    height="80"
    width="80"
    color="#4fa94d"
    radius="9"
    ariaLabel="three-dots-loading"
    wrapperStyle={{}}
    wrapperClass=""
    /></div>;
  }

  if (error) {
    return <p className="text-center text-xl font-semibold text-red-500">Error: {error}</p>;
  }

  return (
    <div className="px-10">
      <div className="flex justify-center my-6">
        <select
          className="border border-gray-300 rounded-lg p-2 text-lg bg-white shadow-md shadow-black focus:outline-none focus:ring focus:border-blue-300"
          onChange={handleContestChange}
          value={selectedContest}
        >
          {contests.map((contest, index) => (
            <option key={index} value={contest}>
              {toTitleCase(contest.replace(/_/g, ' '))}
            </option>
          ))}
        </select>
      </div>
      <h2 className="text-center text-5xl font-bold mb-6">{toTitleCase(selectedContest.replace(/_/g, ' '))}</h2>
      <div className="flex justify-center mb-10">
        <button className="px-8 py-4 text-2xl font-semibold border-2 border-black rounded-lg shadow-md bg-gray-100 hover:bg-gray-200 shadow-black"
          onClick={toggleFilters}
        >
          Filter
        </button>
      </div>
      {showFilters && <Filter filters={filters} onFilterChange={handleFilterChange} />}
     <table className="w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden shadow-left-right">
  <thead className="bg-gray-800 text-white">
    <tr>
      <th className="py-3 px-4">Rank</th>
      <th className="py-3 px-4">Username</th>
      <th className="py-3 px-4">Department</th>
      <th className="py-3 px-4">Section</th>
      <th className="py-3 px-4">Year</th>
      <th className="py-3 px-4">No. of Questions</th>
      <th className="py-3 px-4">Question ID</th>
      <th className="py-3 px-4">Finish Time</th>
      <th className="py-3 px-4">Status</th>
      
    </tr>
  </thead>
  <tbody>
    {filteredStudents.length > 0 ? (
      currentStudents.map((student, index) => (
        <React.Fragment key={index}>
          <tr
            className={`cursor-pointer text-center transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg hover:border-solid hover:bg-gray-300 ${
              expandedRow === index ? 'bg-gray-100' : 'bg-white'
            } ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
            onClick={() => toggleExpandRow(index)}
          >
            <td className="py-3 px-4">{student.rank}</td>
            <td className="py-3 px-4">{student.username}</td>
            <td className="py-3 px-4">{student.dept}</td>
            <td className="py-3 px-4">{student.section}</td>
            <td className="py-3 px-4">{student.year}</td>
            <td className="py-3 px-4">{student.no_of_questions}</td>
            <td className="py-3 px-4">{student.question_ids?.join(', ')}</td>
            <td className="py-3 px-4">{student.finish_time}</td>
            <td className="py-3 px-4">{student.status}</td>
          </tr>
          {expandedRow === index && (
            <tr>
              <td colSpan={9} className="bg-gray-100">
                <div className='flex justify-center'>
                  <div className='flex flex-row justify-center'>
                    <LineChart username={student.leetcode_id} />
                    <DoughnutChart username={student.leetcode_id} />
                  </div>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      ))
    ) : (
      <tr>
        <td colSpan={9} className="text-center py-4">
          No students match the current filters.
        </td>
      </tr>
    )}
  </tbody>
</table>
      {filteredStudents.length > 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
      <div className="flex justify-center my-6">
        <Link href="/analytics">
          <button className="px-8 py-4 text-2xl font-semibold border-2 border-black rounded-lg shadow-md bg-gray-800 text-white hover:bg-gray-500">
            Go to Analysis
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StudentsTable;
