"use client";

import { Bar, Line } from 'react-chartjs-2';
import React, { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import PieChart from './PieChart';
import LineChart from './LineChart';
import BarChart from './BarChart';
import Link from 'next/link';
import { ThreeDots } from 'react-loader-spinner';
import { createClient } from '@/lib/supabase/client';
import { ChevronDown, Filter, BarChart as BarChartIcon, PieChart as PieChartIcon, Home, Download, RefreshCw } from 'lucide-react';

Chart.register(...registerables, ChartDataLabels);

const supabase = createClient();

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const AnalysisPage: React.FC = () => {
  const [data, setData] = useState<any>({ filterData: [], contestDataMap: {} });
  const [contests, setContests] = useState<string[]>([]);
  const [selectedContest, setSelectedContest] = useState<string>('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any>({});
  const [filters, setFilters] = useState<any>({ colleges: [], years: [], depts: [], sections: [] });
  const [selectedFilter, setSelectedFilter] = useState<any>({ college: '', year: '', dept: '', section: '' });
  const [loading, setLoading] = useState(true);
  const [showPieChart, setShowPieChart] = useState(true);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: contestsData, error: contestsError } = await supabase
          .from('contests')
          .select('contest_name')
          .order('created_at', { ascending: false });

        if (contestsError) throw new Error(`Contests Error: ${contestsError.message}`);

        const contestNames = contestsData.map(contest => contest.contest_name);
        setContests(contestNames);

        if (contestNames.length > 0) {
          setSelectedContest(contestNames[0]);
        }

        const { data: filterData, error: filterError } = await supabase
          .from('students')
          .select('college, year, dept, section');

        if (filterError) throw new Error(`Filter Error: ${filterError.message}`);

        const newFilters = {
          colleges: Array.from(new Set(filterData.map(item => item.college))),
          years: Array.from(new Set(filterData.map(item => item.year))),
          depts: Array.from(new Set(filterData.map(item => item.dept))),
          sections: Array.from(new Set(filterData.map(item => item.section))),
        };

        setFilters(newFilters);

        const allDataPromises = contestNames.map(async contest => {
          const { data: contestData, error: contestError } = await supabase
            .from(contest)
            .select('*');

          if (contestError) throw new Error(`Contest ${contest} Error: ${contestError.message}`);

          return { contest, data: contestData || [] };
        });

        const allDataResults = await Promise.all(allDataPromises);
        const contestDataMap = allDataResults.reduce((acc, { contest, data }) => {
          acc[contest] = data;
          return acc;
        }, {} as { [key: string]: any[] });

        setAllData(contestDataMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedContest && allData[selectedContest]) {
      let contestData = allData[selectedContest] || [];
      if (selectedFilter.college) {
        contestData = contestData.filter(item => item.college === selectedFilter.college);
      }
      if (selectedFilter.year) {
        contestData = contestData.filter(item => item.year === selectedFilter.year);
      }
      if (selectedFilter.dept) {
        contestData = contestData.filter(item => item.dept === selectedFilter.dept);
      }
      if (selectedFilter.section) {
        contestData = contestData.filter(item => item.section === selectedFilter.section);
      }
      setFilteredData(contestData);
    }
  }, [selectedContest, selectedFilter, allData]);

  // Pie Chart Data
  const questionCounts = {
    notAttended: filteredData.filter(item => item.no_of_questions === null).length,
    0: filteredData.filter(item => item.no_of_questions === 0).length,
    1: filteredData.filter(item => item.no_of_questions === 1).length,
    2: filteredData.filter(item => item.no_of_questions === 2).length,
    3: filteredData.filter(item => item.no_of_questions === 3).length,
    4: filteredData.filter(item => item.no_of_questions === 4).length,
  };

  const pieChartData = {
    labels: ['Not Attended', '0 solved', '1 solved', '2 solved', '3 solved', '4 solved'],
    datasets: [
      {
        label: 'Question Distribution',
        data: [
          questionCounts.notAttended,
          questionCounts[0],
          questionCounts[1],
          questionCounts[2],
          questionCounts[3],
          questionCounts[4],
        ],
        backgroundColor: [
          'rgba(107, 114, 128, 0.8)',  // Gray for Not Attended
          'rgba(239, 68, 68, 0.8)',    // Red
          'rgba(249, 115, 22, 0.8)',   // Orange
          'rgba(234, 179, 8, 0.8)',    // Yellow
          'rgba(16, 185, 129, 0.8)',   // Green
          'rgba(59, 130, 246, 0.8)',   // Blue
        ],
        borderWidth: 0,
      },
    ],
  };
  
  const sectionCounts = filters.sections.reduce((acc: any, section: string) => {
    // Filter the data to include only students who have attended at least one question
    const attendedCount = filteredData.filter(item =>
      item.section === section && item.no_of_questions !== null
    ).length;

    acc[section] = attendedCount; // Store the count of attendees for the section
    return acc;
  }, {});

  const sectionBarChartData = {
    labels: Object.keys(sectionCounts), // X-axis labels (section names)
    datasets: [
      {
        label: 'Attended Count', // Y-axis label
        data: Object.values(sectionCounts), // Y-axis data (counts)
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1, // Border width
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false, // Disable aspect ratio for custom height
    responsive: true,           // Make chart responsive
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,       // Ensure Y-axis starts at 0
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        ticks: {
          stepSize: 10,           // Increment of 10 on Y-axis
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: '#4B5563',          // Set the data label color to dark gray
        anchor: 'end',            // Position the labels at the end of the bars
        align: 'top',            // Align the labels at the top of the bars
        offset: 4,
        font: {
          weight: 'bold',
          size: 12,
        },
      },
    },
  };
  
  // Bar Chart Data
  const barChartData = {
    labels: ['Not Attended', '0 solved', '1 solved', '2 solved', '3 solved', '4 solved'],
    datasets: [
      {
        label: 'Question Distribution',
        data: [
          questionCounts.notAttended,
          questionCounts[0],
          questionCounts[1],
          questionCounts[2],
          questionCounts[3],
          questionCounts[4],
        ],
        backgroundColor: [
          'rgba(107, 114, 128, 0.8)',  // Gray for Not Attended
          'rgba(239, 68, 68, 0.8)',    // Red
          'rgba(249, 115, 22, 0.8)',   // Orange
          'rgba(234, 179, 8, 0.8)',    // Yellow
          'rgba(16, 185, 129, 0.8)',   // Green
          'rgba(59, 130, 246, 0.8)',   // Blue
        ],
        borderWidth: 0,
        borderRadius: 8,
        barThickness: 50,
      },
    ],
  };

  // Line Chart Data
  const applyFilters = (contestData: any[]) => {
    let filteredContestData = contestData;
    if (selectedFilter.college) {
      filteredContestData = filteredContestData.filter(item => item.college === selectedFilter.college);
    }
    if (selectedFilter.year) {
      filteredContestData = filteredContestData.filter(item => item.year === selectedFilter.year);
    }
    if (selectedFilter.dept) {
      filteredContestData = filteredContestData.filter(item => item.dept === selectedFilter.dept);
    }
    if (selectedFilter.section) {
      filteredContestData = filteredContestData.filter(item => item.section === selectedFilter.section);
    }
    return filteredContestData;
  };

  const previousContests = Object.keys(allData);
  const allContests = [...previousContests].reverse();

  const attendingData = allContests.map(contest => {
    const contestData = applyFilters(allData[contest] || []); // Apply filters
    const totalStudents = contestData.length;
    const notAttended = contestData.filter(item => item.no_of_questions === null).length;
    return totalStudents > 0 ? ((totalStudents - notAttended) / totalStudents) * 100 : 0;
  });

  const lineChartData = {
    labels: allContests.slice(-5).map(contest => toTitleCase(contest.replace(/_/g, ' '))),
    datasets: [
      {
        label: 'Attending Percentage',
        data: attendingData.slice(-5), // Show last 5 contests
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 3,
        fill: true,
        pointBackgroundColor: 'rgb(255, 255, 255)',
        pointBorderColor: 'rgb(99, 102, 241)',
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.3,
      },
    ],
  };

  const previousContestss = contests.slice(0, 3).reverse(); // Adjust the slicing based on your needs

  const colors = ['#8B5CF6', '#EC4899', '#3B82F6']; // Purple, Pink, Blue

  const maxQuestionsPerContest = 4; // Define the maximum possible questions per contest (adjust as needed)

  const yearlyLineChartData = {
    labels: previousContestss, // X-axis with previous three contests
    datasets: filters.years.map((year: string, yearIndex: number) => {
      const data = previousContestss.map((contest: string) => {
        // Get the section data for the selected year and contest
        const sectionData = allData[contest]?.filter((item: any) => item.year === year) || [];

        // Calculate the number of students who attended the contest
        const totalStudents = sectionData.length;
        // Calculate the number of students who did not provide answers
        const notAttended = sectionData.filter(item => item.no_of_questions === null).length;

        // Calculate the sum of questions answered
        const countSum = sectionData.reduce((acc: number, item: any) => acc + (item.no_of_questions || 0), 0);

        // Calculate the total number of possible questions
        const totalSum = (countSum / ((totalStudents - notAttended) * maxQuestionsPerContest)) * 100;

        return totalSum;
      });

      return {
        label: `Year ${year}`,
        data,
        fill: false,
        borderColor: colors[yearIndex % colors.length],
        backgroundColor: colors[yearIndex % colors.length],
        tension: 0.3,
        pointBackgroundColor: 'rgb(255, 255, 255)',
        pointBorderColor: colors[yearIndex % colors.length],
        pointBorderWidth: 2,
        pointRadius: 4,
      };
    }),
  };

  const yearlyLineChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Contests',
          color: '#4B5563',
          font: {
            weight: 'bold',
            size: 14,
          },
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Percentage of Questions Solved (%)',
          color: '#4B5563',
          font: {
            weight: 'bold',
            size: 14,
          },
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        ticks: {
          stepSize: 10,
          color: '#6B7280',
          font: {
            size: 12,
          },
          callback: function(value) {
            return value + '%'; // Append '%' to the y-axis labels
          }
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 15,
          padding: 15,
          color: '#4B5563',
          font: {
            size: 12,
          },
        },
      },
      datalabels: {
        display: false, // Disable data labels for line chart to avoid clutter
      },
    },
  };

  // Calculate totals for summary
  const totalStudents = filteredData.length;
  const attendedStudents = filteredData.filter(item => item.no_of_questions !== null).length;
  const attendanceRate = totalStudents > 0 ? (attendedStudents / totalStudents) * 100 : 0;
  
  const totalSolvedQuestions = filteredData.reduce((total, item) => total + (item.no_of_questions || 0), 0);
  const solvedRate = attendedStudents > 0 ? (totalSolvedQuestions / (attendedStudents * 4)) * 100 : 0;
  
  const resetFilters = () => {
    setSelectedFilter({ college: '', year: '', dept: '', section: '' });
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <ThreeDots height="80" width="80" radius="9" color="#4F46E5" ariaLabel="three-dots-loading" />
        </div>
      ) : (
        <>
          {/* Top Navigation Bar */}
          <nav className="bg-white shadow-sm p-4 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-4xl font-bold text-indigo-600">Contest Analytics Dashboard</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleFilterMenu}
                  className="flex items-center px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Filter size={18} className="mr-2 text-gray-700" />
                  <span className="text-gray-700 font-medium">Filters</span>
                </button>
                <Link href="/">
                  <button className="flex items-center px-3 py-2 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors">
                    <Home size={18} className="mr-2 text-indigo-600" />
                    <span className="text-indigo-600 font-medium">Home</span>
                  </button>
                </Link>
              </div>
            </div>
          </nav>
          
          <div className="max-w-7xl mx-auto px-4 pt-6 pb-12">
            {/* Filter Panel */}
            {isFilterMenuOpen && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6 transition-all">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Filter Options</h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={resetFilters}
                      className="flex items-center px-3 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <RefreshCw size={16} className="mr-2 text-gray-700" />
                      <span className="text-gray-700">Reset</span>
                    </button>
                    <button
                      onClick={toggleFilterMenu}
                      className="flex items-center px-3 py-2 text-sm bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors"
                    >
                      <ChevronDown size={16} className="mr-2 text-indigo-600" />
                      <span className="text-indigo-600">Close</span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {['college', 'year', 'dept', 'section'].map((filterType) => (
                    <div key={filterType}>
                      <label htmlFor={`${filterType}-filter`} className="block text-sm font-medium text-gray-700 mb-2">
                        {toTitleCase(filterType)}
                      </label>
                      <select
                        id={`${filterType}-filter`}
                        value={selectedFilter[filterType]}
                        onChange={(e) => setSelectedFilter({ ...selectedFilter, [filterType]: e.target.value })}
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">All {toTitleCase(filterType)}s</option>
                        {filters[`${filterType}s`].map((item: string) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <label htmlFor="contest-select" className="block text-sm font-medium text-gray-700 mb-2">Contest</label>
                  <select
                    id="contest-select"
                    value={selectedContest}
                    onChange={(e) => setSelectedContest(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {contests.map(contest => (
                      <option key={contest} value={contest}>
                        {toTitleCase(contest.replace(/_/g, ' '))}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            
            {/* Summary Cards */}
              {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-indigo-500">
                <div className="flex p-5">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-500">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{totalStudents}</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-green-500">
                <div className="flex p-5">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-500">Attendance Rate</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{attendanceRate.toFixed(1)}%</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-500">
                <div className="flex p-5">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-500">Questions Solved Rate</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{solvedRate.toFixed(1)}%</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>*/}
            
            {/* Chart Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="flex justify-between items-center p-5 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">Question Distribution</h2>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setShowPieChart(true)}
                      className={`flex items-center justify-center p-2 rounded ${showPieChart ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      <PieChartIcon size={20} />
                    </button>
                    <button 
                      onClick={() => setShowPieChart(false)}
                      className={`flex items-center justify-center p-2 rounded ${!showPieChart ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      <BarChartIcon size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-5 h-96">
                  {showPieChart ? <PieChart data={pieChartData} /> : <BarChart data={barChartData} options={chartOptions} />}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-5 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">Attendance Over Last 5 Contests</h2>
                </div>
                <div className="p-5 h-96">
                  <LineChart data={lineChartData} />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-5 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">Section Comparison</h2>
                </div>
                <div className="p-5 h-96">
                  <Bar data={sectionBarChartData} options={chartOptions} />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-5 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">Yearly Progression</h2>
                </div>
                <div className="p-5 h-96">
                  <Line data={yearlyLineChartData} options={yearlyLineChartOptions} />
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex justify-between items-center mt-8">
              <button 
                className="px-4 py-2 bg-indigo-100 rounded-lg text-indigo-600 hover:bg-indigo-200 transition-colors flex items-center" 
                onClick={() => window.print()}
              >
                <Download size={18} className="mr-2" />
                Export Data
              </button>
              <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AnalysisPage;
