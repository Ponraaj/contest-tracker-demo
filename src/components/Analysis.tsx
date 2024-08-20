"use client";
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { createClient } from '@/lib/supabase/client';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const supabase = createClient();

const MyDoughnutChart: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [colleges, setColleges] = useState<string[]>(['All']);
  const [years, setYears] = useState<string[]>(['All']);
  const [departments, setDepartments] = useState<string[]>(['All']);
  const [sections, setSections] = useState<string[]>(['All']);
  const [contests, setContests] = useState<string[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [selectedContest, setSelectedContest] = useState<string>('');

  useEffect(() => {
    const fetchContests = async () => {
      const { data: contestsData, error } = await supabase
        .from('contests')
        .select('contest_name');

      if (error) {
        console.error('Error fetching contests:', error);
        return;
      }

      const contestNames = contestsData.map(contest => contest.contest_name);
      setContests(contestNames);
      if (contestNames.length > 0) {
        setSelectedContest(contestNames[0]);
      }
    };

    fetchContests();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedContest) return;

      const { data, error } = await supabase
        .from(selectedContest)
        .select('*');

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }
      
      setData(data || []);

      // Populate dropdowns
      setColleges(['All', ...new Set(data.map((item: any) => item.college))]);
      setYears(['All', ...new Set(data.map((item: any) => item.year))]);
      setDepartments(['All', ...new Set(data.map((item: any) => item.dept))]);
      setSections(['All', ...new Set(data.map((item: any) => item.section))]);
    };

    fetchData();
  }, [selectedContest]);

  useEffect(() => {
    const filtered = data.filter(item => {
      const collegeMatch = selectedCollege === 'All' || item.college === selectedCollege;
      const yearMatch = selectedYear === 'All' || item.year === selectedYear;
      const deptMatch = selectedDepartment === 'All' || item.dept === selectedDepartment;
      const sectionMatch = selectedSection === 'All' || item.section === selectedSection;
      return collegeMatch && yearMatch && deptMatch && sectionMatch;
    });

    setFilteredData(filtered);
  }, [selectedCollege, selectedYear, selectedDepartment, selectedSection, data]);

  const questionCounts = {
    notAttended: filteredData.filter(item => item.no_of_questions === null).length,
    0: filteredData.filter(item => item.no_of_questions === 0).length,
    1: filteredData.filter(item => item.no_of_questions === 1).length,
    2: filteredData.filter(item => item.no_of_questions === 2).length,
    3: filteredData.filter(item => item.no_of_questions === 3).length,
    4: filteredData.filter(item => item.no_of_questions === 4).length,
  };

  const chartData = {
    labels: ['Not Attended', '0 Questions', '1 Question', '2 Questions', '3 Questions', '4 Questions'],
    datasets: [
      {
        label: 'Number of Students',
        data: [
          questionCounts.notAttended,
          questionCounts[0],
          questionCounts[1],
          questionCounts[2],
          questionCounts[3],
          questionCounts[4]
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

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="flex flex-row items-start pt-[100px] pl-[50px] mx-[300px]">
      <div className='text-2xl'>
        <h1 className='text-6xl pb-[30px]'>{capitalizeFirstLetter(selectedContest)}</h1>
        
        <div className="mb-4">
          <label htmlFor="contest">Select Contest:</label>
          <select
            id="contest"
            value={selectedContest}
            onChange={(e) => setSelectedContest(e.target.value)}
            className="ml-2 p-2 border rounded"
          >
            {contests.map(contest => (
              <option key={contest} value={contest}>{contest}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="college">Select College:</label>
          <select
            id="college"
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="ml-2 p-2 border rounded"
          >
            {colleges.map(college => (
              <option key={college} value={college}>{college}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="year">Select Year:</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="ml-2 p-2 border rounded"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="department">Select Department:</label>
          <select
            id="department"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="ml-2 p-2 border rounded"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="section">Select Section:</label>
          <select
            id="section"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="ml-2 p-2 border rounded"
          >
            {sections.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredData.length > 0 ? (
        <div className="w-[600px] h-[600px]">
          <Pie data={chartData} />
        </div>
      ) : (
        <p>No data available for the selected filters.</p>
      )}
    </div>
  );
};

export default MyDoughnutChart;
