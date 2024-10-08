//Analysis.tsx

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
import { ChevronDown, Filter } from 'lucide-react';

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
          'rgb(128, 128, 128)',  // Grey for Not Attended
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
        ],
        borderWidth: 1,
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
        backgroundColor: 'rgb(162, 162, 162)', // Bar color
        borderColor: 'rgba(153, 102, 255, 1)', // Border color
        borderWidth: 1, // Border width
        barThickness:100,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false, // Disable aspect ratio for custom height
    responsive: true,           // Make chart responsive
    scales: {
      x: {
        // barPercentage: 0.5,      // Adjust the width of the bars (0.0 - 1.0)
        // categoryPercentage: 0.5, // Adjust the space between the bars (0.0 - 1.0)
        ticks: {
          color: 'black',        // X-axis label color
        },
      },
      y: {
        beginAtZero: true,       // Ensure Y-axis starts at 0
        ticks: {
          stepSize: 10,           // Increment of 1 on Y-axis
          color: 'black',        // Y-axis label color
        },
      },
    },
    plugins: {
      datalabels: {
        color: 'black',          // Set the data label color to black
        anchor: 'center',        // Position the labels inside the bars
        align: 'top',            // Align the labels at the top of the bars
      },
    },
  };
// Calculate the yearly data

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
          'rgb(128, 128, 128)',  // Grey for Not Attended
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
        ],
        borderWidth: 1,
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
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 2,
        fill: false,
        pointBackgroundColor: 'rgb(75, 192, 192)',
      },
    ],
  };
  
  const previousContestss = contests.slice(0, 3).reverse(); // Adjust the slicing based on your needs

const colors = ['#a76b9e', '#e9a6a6','#8b8c89']; // Add more colors as needed

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
      borderColor: colors[yearIndex % colors.length], // Use colors array for different colors
      tension: 0.1,
    };
  }),
};

const yearlyLineChartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Contests',
        color: 'black',
      },
      ticks: {
        color: 'black',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Percentage of Questions Solved (%)',
        color: 'black',
      },
      beginAtZero: true,
      ticks: {
        stepSize: 10,
        color: 'black',
        callback: function(value) {
          return value + '%'; // Append '%' to the y-axis labels
        }
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        color: 'black',
      },
    },
    datalabels: {
      color: '',
      anchor: 'end',
      align: 'top',
      formatter: function(value) {
        return value.toFixed(2) + '%'; // Format data labels as percentage
      },
    },
  },
};


  

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
    <div className="max-w-7xl mx-auto">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <ThreeDots height="80" width="80" radius="9" color="#4F46E5" ariaLabel="three-dots-loading" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Analysis of Contest Data</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {['college', 'year', 'dept', 'section'].map((filterType) => (
                <div key={filterType}>
                  <label htmlFor={`${filterType}-filter`} className="block text-sm font-medium text-gray-700 mb-1">
                    Select {toTitleCase(filterType)}
                  </label>
                  <select
                    id={`${filterType}-filter`}
                    value={selectedFilter[filterType]}
                    onChange={(e) => setSelectedFilter({ ...selectedFilter, [filterType]: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All {toTitleCase(filterType)}s</option>
                    {filters[`${filterType}s`].map((item: string) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <label htmlFor="contest-select" className="block text-sm font-medium text-gray-700 mb-1">Select Contest</label>
              <select
                id="contest-select"
                value={selectedContest}
                onChange={(e) => setSelectedContest(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                {contests.map(contest => (
                  <option key={contest} value={contest}>
                    {toTitleCase(contest.replace(/_/g, ' '))}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end mb-6">
                <span className="mr-3 text-gray-700">{showPieChart ? 'Switch to Bar Chart' : 'Switch to Pie Chart'}</span>
                <label htmlFor="toggleSwitch" className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="toggleSwitch"
                    className="sr-only peer"
                    checked={showPieChart}
                    onChange={() => setShowPieChart(!showPieChart)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Question Distribution</h2>
                <div className="h-[400px]"> {/* Adjusted height to match line chart */}
                  {showPieChart ? <PieChart data={pieChartData} /> : <BarChart data={barChartData} options={chartOptions} />}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Attendance Over Contests</h2>
                <div className="h-[400px]">
                  <LineChart data={lineChartData} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Section Comparison</h2>
                <div className="h-[400px]">
                  <Bar data={sectionBarChartData} options={chartOptions} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Yearly Progression</h2>
                <div className="h-[400px]">
                  <Line data={yearlyLineChartData} options={yearlyLineChartOptions} />
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Link href="/">
                <button className="px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1">
                  Go to Home
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AnalysisPage;