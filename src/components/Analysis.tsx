"use client";

import React, { useState, useEffect } from 'react';
import DataFetcher from './DataFetcher';
import PieChart from './PieChart';
import LineChart from './LineChart';
import { ThreeDots } from 'react-loader-spinner';

const AnalysisPage: React.FC = () => {
  const [data, setData] = useState<any>({ filterData: [], contestDataMap: {} });
  const [contests, setContests] = useState<string[]>([]);
  const [selectedContest, setSelectedContest] = useState<string>('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({ colleges: [], years: [], depts: [], sections: [] });
  const [selectedFilter, setSelectedFilter] = useState<any>({ college: '', year: '', dept: '', section: '' });

  useEffect(() => {
    if (selectedContest) {
      const fetchFilteredData = () => {
        let contestData = data.contestDataMap[selectedContest] || [];
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
      };
      fetchFilteredData();
    }
  }, [selectedContest, selectedFilter, data.contestDataMap]);

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
          questionCounts[0] === 0 ? null : questionCounts[0],
          questionCounts[1] === 0 ? null : questionCounts[1],
          questionCounts[2] === 0 ? null : questionCounts[2],
          questionCounts[3] === 0 ? null : questionCounts[3],
          questionCounts[4] === 0 ? null : questionCounts[4],
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

  const previousContests = Object.keys(data.contestDataMap).filter(contest => contest !== selectedContest);
  const allContests = [selectedContest, ...previousContests.slice(-4)];

  const attendingData = allContests.map(contest => {
    const contestData = data.contestDataMap[contest] || [];
    const totalStudents = contestData.length;
    const notAttended = contestData.filter(item => item.no_of_questions === null).length;
    return totalStudents > 0 ? ((totalStudents - notAttended) / totalStudents) * 100 : 0;
  });

  const lineChartData = {
    labels: allContests,
    datasets: [
      {
        label: 'Attending Percentage',
        data: attendingData,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 2,
        fill: true,
        pointBackgroundColor: 'rgb(75, 192, 192)',
      },
    ],
  };

  return (
    <div className="p-4 space-y-4">
      <DataFetcher
        onDataFetched={(fetchedData) => {
          setData(fetchedData);
          setLoading(false);
        }}
        onContestsFetched={(fetchedContests) => {
          setContests(fetchedContests);
          // Only set selectedContest if it's not already set
          if (!selectedContest && fetchedContests.length > 0) {
            setSelectedContest(fetchedContests[0]);
          }
        }}
        onFiltersFetched={(filterOptions) => setFilters(filterOptions)}
      />

      {loading ? (
        <div className="flex justify-center items-center ">
          <ThreeDots color="#4fa94d" height={80} width={80} />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:justify-between mb-4">
            <h2 className="text-lg font-semibold">Analysis of Contest Data</h2>
            <div>
              <label htmlFor="contest-select" className="block text-sm font-medium text-gray-700">Select Contest</label>
              <select
                id="contest-select"
                value={selectedContest}
                onChange={(e) => {
                  setSelectedContest(e.target.value);
                }}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                {contests.map(contest => (
                  <option key={contest} value={contest}>
                    {contest}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="college-filter" className="block text-sm font-medium text-gray-700">Select College</label>
              <select
                id="college-filter"
                value={selectedFilter.college}
                onChange={(e) => setSelectedFilter({ ...selectedFilter, college: e.target.value })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Colleges</option>
                {filters.colleges.map(college => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700">Select Year</label>
              <select
                id="year-filter"
                value={selectedFilter.year}
                onChange={(e) => setSelectedFilter({ ...selectedFilter, year: e.target.value })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Years</option>
                {filters.years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="dept-filter" className="block text-sm font-medium text-gray-700">Select Department</label>
              <select
                id="dept-filter"
                value={selectedFilter.dept}
                onChange={(e) => setSelectedFilter({ ...selectedFilter, dept: e.target.value })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Departments</option>
                {filters.depts.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="section-filter" className="block text-sm font-medium text-gray-700">Select Section</label>
              <select
                id="section-filter"
                value={selectedFilter.section}
                onChange={(e) => setSelectedFilter({ ...selectedFilter, section: e.target.value })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Sections</option>
                {filters.sections.map(section => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PieChart data={pieChartData} />
            <LineChart data={lineChartData} />
          </div>
        </>
      )}
    </div>
  );
};
export default AnalysisPage;
