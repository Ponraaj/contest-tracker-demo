"use client";

import React, { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import PieChart from './PieChart';
import { Bar } from 'react-chartjs-2';
import { ThreeDots } from 'react-loader-spinner';
import { createClient } from '@/lib/supabase/client';

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
        // Fetch contest names
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

        // Fetch filter options
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

        // Fetch data for all contests
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

  const sectionCounts = filters.sections.reduce((acc: any, section: string) => {
    const attendedCount = filteredData.filter(item => 
      item.section === section && item.no_of_questions !== null
    ).length;

    acc[section] = attendedCount;
    return acc;
  }, {});

  const sectionBarChartData = {
    labels: Object.keys(sectionCounts),
    datasets: [
      {
        label: 'Attended Count',
        data: Object.values(sectionCounts),
        backgroundColor: 'rgb(162, 162, 162)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: 'black',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: 'black',
        },
      },
    },
    plugins: {
      datalabels: {
        color: 'black',
        anchor: 'center',
        align: 'top',
      },
    },
  };

  return (
    <div className='p-4'>
      {loading ? (
        <div className='flex justify-center items-center'>
          <ThreeDots height="100" width="100" radius="9" color="blue" ariaLabel="three-dots-loading" />
        </div>
      ) : (
        <>
          <div className='mb-4'>
            <label htmlFor='contest' className='mr-2'>Select Contest:</label>
            <select
              id='contest'
              value={selectedContest}
              onChange={(e) => setSelectedContest(e.target.value)}
            >
              {contests.map((contest, index) => (
                <option key={index} value={contest}>{toTitleCase(contest)}</option>
              ))}
            </select>
          </div>

          <div className='mb-4'>
            <label htmlFor='college' className='mr-2'>College:</label>
            <select
              id='college'
              value={selectedFilter.college}
              onChange={(e) => setSelectedFilter({ ...selectedFilter, college: e.target.value })}
            >
              <option value=''>All</option>
              {filters.colleges.map((college, index) => (
                <option key={index} value={college}>{toTitleCase(college)}</option>
              ))}
            </select>
          </div>

          <div className='mb-4'>
            <label htmlFor='year' className='mr-2'>Year:</label>
            <select
              id='year'
              value={selectedFilter.year}
              onChange={(e) => setSelectedFilter({ ...selectedFilter, year: e.target.value })}
            >
              <option value=''>All</option>
              {filters.years.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className='mb-4'>
            <label htmlFor='dept' className='mr-2'>Department:</label>
            <select
              id='dept'
              value={selectedFilter.dept}
              onChange={(e) => setSelectedFilter({ ...selectedFilter, dept: e.target.value })}
            >
              <option value=''>All</option>
              {filters.depts.map((dept, index) => (
                <option key={index} value={dept}>{toTitleCase(dept)}</option>
              ))}
            </select>
          </div>

          <div className='mb-4'>
            <label htmlFor='section' className='mr-2'>Section:</label>
            <select
              id='section'
              value={selectedFilter.section}
              onChange={(e) => setSelectedFilter({ ...selectedFilter, section: e.target.value })}
            >
              <option value=''>All</option>
              {filters.sections.map((section, index) => (
                <option key={index} value={section}>{toTitleCase(section)}</option>
              ))}
            </select>
          </div>

          {showPieChart && (
            <div className='mb-4'>
              <PieChart data={pieChartData} />
            </div>
          )}

          <div className='mb-4'>
            <Bar data={sectionBarChartData} options={chartOptions} />
          </div>

          <button
            className='px-4 py-2 bg-blue-500 text-white rounded'
            onClick={() => setShowPieChart(prev => !prev)}
          >
            Toggle Pie Chart
          </button>
        </>
      )}
    </div>
  );
};

export default AnalysisPage;
