"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Search, Filter } from "lucide-react";
import Pagination from "./Pagination";
import Navbar from "./Navbar";
import { Contest, Student, Filters, FilterOptions } from "@/lib/types";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ThreeDots } from "react-loader-spinner";
import { createClient } from "@/lib/supabase/client";

const LineChart = dynamic(() => import("./Chart"), { ssr: false });
const DoughnutChart = dynamic(() => import("./CountChart"), { ssr: false });

interface TableProps {
  initialContests: Contest[];
  initialStudents: Student[];
  initialContest: string;
}

export default function Table({
  initialContests,
  initialStudents,
  initialContest,
}: TableProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [filteredStudents, setFilteredStudents] =
    useState<Student[]>(initialStudents);
  const [filters, setFilters] = useState<Filters>({
    no_of_questions: null,
    status: null,
    dept: null,
    section: null,
    year: null,
    college: null,
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    no_of_questions: [],
    status: [],
    dept: [],
    section: [],
    year: [],
    college: [],
  });
  console.log(initialContests);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [contests, setContests] = useState<Contest[]>(initialContests);
  const [selectedContest, setSelectedContest] =
    useState<string>(initialContest);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(25);
  const [open, setOpen] = useState(false);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const sortOptions = (options: (string | number | null)[]) => {
    return options
      .filter((option) => option !== null)
      .sort((a, b) => {
        if (typeof a === "number" && typeof b === "number") {
          return a - b;
        }
        return String(a).localeCompare(String(b));
      });
  };

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    const newValue =
      name === "no_of_questions"
        ? value === ""
          ? null
          : parseInt(value)
        : value || null;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: newValue,
    }));
  };

  const fetchFilterOptions = async (contestName: string) => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from(contestName)
        .select("no_of_questions, status, dept, section, year, college");

      if (error) throw error;

      if (data) {
        const options: FilterOptions = {
          no_of_questions: [
            ...new Set(data.map((item) => item.no_of_questions)),
          ],
          status: [...new Set(data.map((item) => item.status))],
          dept: [...new Set(data.map((item) => item.dept))],
          section: [...new Set(data.map((item) => item.section))],
          year: [...new Set(data.map((item) => item.year))],
          college: [...new Set(data.map((item) => item.college))],
        };

        setFilterOptions(options);
      }
    } catch (error) {
      console.error("Error fetching filter options:", error.message);
      setError("Failed to fetch filter options");
    }
  };

  const handleContestChange = async (contest: string) => {
    setSelectedContest(contest);
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from(contest)
        .select(
          "leetcode_id,username, no_of_questions, question_ids, finish_time, status, dept, year, section, rank, college"
        );

      if (error) throw error;

      setStudents(data || []);
      setFilteredStudents(data || []);
      setCurrentPage(1);

      // Fetch filter options for the new contest
      await fetchFilterOptions(contest);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilterOptions(initialContest);
  }, [initialContest]);

  useEffect(() => {
    let filtered = students;

    // Filter by the search query (name)
    if (searchQuery) {
      filtered = filtered.filter((student) =>
        student.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.no_of_questions !== null) {
      filtered = filtered.filter(
        (student) => student.no_of_questions === filters.no_of_questions!
      );
    }

    if (filters.status !== null) {
      filtered = filtered.filter(
        (student) => student.status === filters.status
      );
    }

    if (filters.dept !== null) {
      filtered = filtered.filter((student) => student.dept === filters.dept);
    }

    if (filters.college !== null) {
      filtered = filtered.filter(
        (student) => student.college === filters.college
      );
    }

    if (filters.year !== null) {
      filtered = filtered.filter((student) => student.year === filters.year);
    }

    if (filters.section !== null) {
      filtered = filtered.filter(
        (student) => student.section === filters.section
      );
    }

    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [filters, students, searchQuery]);

  const toggleFilters = () => {
    console.log("Filter button clicked");
    setShowFilters((prev) => !prev);
  };

  const toggleExpandRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  if (loading) {
    return (
      <div className='flex justify-center justify-items-center pt-[410px]'>
        <ThreeDots
          visible={true}
          height='80'
          width='80'
          color='#4fa94d'
          radius='9'
          ariaLabel='three-dots-loading'
        />
      </div>
    );
  }

  if (error) {
    return (
      <p className='text-center text-xl font-semibold text-red-500'>
        Error: {error}
      </p>
    );
  }

  return (
    <div className=''>
      <Navbar
        contests={initialContests}
        selectedContest={selectedContest}
        setSelectedContest={setSelectedContest}
        handleContestChange={handleContestChange}
        toTitleCase={toTitleCase}
      />
      <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 md:p-10'>
        {/* Contest Selector */}
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col items-center space-y-8'>
            <h1 className='text-4xl md:text-6xl font-bold text-gray-800 tracking-tight'>
              {selectedContest &&
              selectedContest !== "" &&
              selectedContest !== null &&
              selectedContest !== undefined
                ? toTitleCase(selectedContest.replace(/_/g, " "))
                : ""}
            </h1>
          </div>
          {/* Search Bar */}
          <div className='mt-8 mb-12'>
            <div className='max-w-md mx-auto'>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='Search participants...'
                  className='w-full pl-12 pr-4 py-3 bg-white rounded-full shadow-lg border-0 focus:ring-2 focus:ring-blue-500 transition-all'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              </div>
            </div>
          </div>
          <Card className='overflow-hidden bg-white rounded-2xl shadow-xl'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='bg-gray-900'>
                    <th className='py-4 px-6 text-centre text-sm font-medium text-gray-100'>
                      Rank
                    </th>
                    <th className='py-4 px-6 text-centre text-sm font-medium text-gray-100'>
                      Username
                    </th>
                    <th className='py-4 px-6 text-left text-sm font-medium text-gray-100'>
                      <div className='flex items-center justify-between w-full'>
                        <div className='flex items-center'>
                          <span className='pr-1'>Department</span>
                        </div>
                        <select
                          className='bg-gray-800 text-gray-100 border-0 rounded-lg text-sm w-3 pl-4 hover:cursor-pointer'
                          name='dept'
                          value={filters.dept || ""}
                          onChange={handleFilterChange}>
                          <option value=''>All Departments</option>
                          {filterOptions.dept.map((dept, index) => (
                            <option key={index} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                    <th className='py-4 px-6 text-centre text-sm font-medium text-gray-100'>
                      <div className='flex items-center justify-between w-full'>
                        <span className='pr-1'>Section</span>
                        <select
                          className='bg-gray-800 text-gray-100 border-0 rounded-lg text-sm w-3 pl-4 hover:cursor-pointer'
                          name='section'
                          value={filters.section || ""}
                          onChange={handleFilterChange}>
                          <option value=''>All</option>
                          {filterOptions.section.map((section, index) => (
                            <option key={index} value={section}>
                              {section}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                    <th className='py-4 px-6 text-centre text-sm font-medium text-gray-100'>
                      <div className='flex items-center justify-between w-full'>
                        <span className='pr-1'>Year</span>
                        <select
                          className='bg-gray-800 text-gray-100 border-0 rounded-lg text-sm w-3 pl-4 hover:cursor-pointer'
                          name='year'
                          value={filters.year || ""}
                          onChange={handleFilterChange}>
                          <option value=''>All</option>
                          {filterOptions.year.map((year, index) => (
                            <option key={index} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                    <th className='py-4 px-6 text-centre text-sm font-medium text-gray-100'>
                      <div className='flex items-center justify-between w-full'>
                        <span className='w-full'>No. of Questions</span>
                        <select
                          className='bg-gray-800 text-gray-100 border-0 rounded-lg text-sm w-3 pl-4 hover:cursor-pointer'
                          name='no_of_questions'
                          value={filters.no_of_questions}
                          onChange={handleFilterChange}>
                          <option value=''>All</option>
                          {sortOptions(filterOptions.no_of_questions).map(
                            (option, index) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </th>
                    <th className='py-4 px-6 text-centre text-sm font-medium text-gray-100'>
                      Question ID
                    </th>
                    <th className='py-4 px-6 text-centre text-sm font-medium text-gray-100'>
                      Finish Time
                    </th>
                    <th className='py-4 px-6 text-centre text-sm font-medium text-gray-100'>
                      <div className='flex items-center justify-between w-full'>
                        <span className=''>Status</span>
                        <select
                          className='bg-gray-800 text-gray-100 border-0 rounded-lg text-sm w-3 pl-4 hover:cursor-pointer'
                          name='status'
                          value={filters.status || ""}
                          onChange={handleFilterChange}>
                          <option value=''>All</option>
                          {filterOptions.status.map((status, index) => (
                            <option key={index} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    currentStudents.map((student, index) => (
                      <React.Fragment key={index}>
                        <tr
                          className={`group cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                            expandedRow === index ? "bg-blue-50" : ""
                          }`}
                          onClick={() => toggleExpandRow(index)}>
                          <td className='py-4 px-6'>
                            <span className='inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-semibold group-hover:bg-blue-100'>
                              {student.rank}
                            </span>
                          </td>
                          <td className='py-4 px-6 font-medium text-gray-900'>
                            {student.username}
                          </td>
                          <td className='py-4 px-6 text-gray-600'>
                            {student.dept}
                          </td>
                          <td className='py-4 px-6 text-gray-600'>
                            {student.section}
                          </td>
                          <td className='py-4 px-6 text-gray-600'>
                            {student.year}
                          </td>
                          <td className='py-4 px-6'>
                            <span className='inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium'>
                              {student.no_of_questions}
                            </span>
                          </td>
                          <td className='py-4 px-6 text-gray-600'>
                            {student.question_ids?.join(", ")}
                          </td>
                          <td className='py-4 px-6 text-gray-600'>
                            {student.finish_time}
                          </td>
                          <td className='py-4 px-6'>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                student.status === "attended"
                                  ? "bg-green-100 text-green-800"
                                  : student.status === "not attended"
                                  ? "bg-red-100 text-red-800"
                                  : ""
                              }`}>
                              {student.status}
                            </span>
                          </td>
                        </tr>
                        {expandedRow === index && (
                          <tr>
                            <td colSpan={9} className='bg-blue-50 p-6'>
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='bg-white rounded-xl shadow-lg p-4'>
                                  <LineChart username={student.leetcode_id} />
                                </div>
                                <div className='bg-white rounded-xl shadow-lg p-4'>
                                  <DoughnutChart
                                    username={student.leetcode_id}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className='py-8 text-center text-gray-500'>
                        No participants match your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {filteredStudents.length > 0 && (
            <div className='mt-6'>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

          {/* Analytics Button */}
          <div className='flex justify-center mt-12'>
            <Link href='/analytics'>
              <button className='group relative px-8 py-4 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-gray-800 transition-all duration-200 hover:shadow-xl'>
                <span className='relative z-10 text-xl font-semibold'>
                  View Analysis
                </span>
                <div className='absolute inset-0 h-full w-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-200'></div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}