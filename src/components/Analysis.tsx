import React, { useEffect, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ThreeDots } from 'react-loader-spinner';

ChartJS.register(Title, Tooltip, Legend, ArcElement, LineElement, PointElement, CategoryScale, LinearScale, ChartDataLabels);

const supabase = createClient();

const AnalysisPage: React.FC = () => {
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
  const [previousContestData, setPreviousContestData] = useState<any[]>([]);
  const [selectedContestData, setSelectedContestData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const toTitleCase = (str: string) => {
    if (!str) return ''; // Return an empty string if str is null or undefined
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };  

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const { data: contestsData, error } = await supabase
          .from('contests')
          .select('contest_name')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        const contestNames = contestsData.map(contest => contest.contest_name);
        setContests(contestNames);
        if (contestNames.length > 0) {
          setSelectedContest(contestNames[0]);
        }
      } catch (error) {
        console.error('Error fetching contests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const { data: filterData, error } = await supabase
          .from('students')
          .select('college, year, dept, section');

        if (error) {
          throw error;
        }

        const colleges = ['All', ...new Set(filterData.map(item => item.college))];
        const years = ['All', ...new Set(filterData.map(item => item.year))];
        const departments = ['All', ...new Set(filterData.map(item => item.dept))];
        const sections = ['All', ...new Set(filterData.map(item => item.section))];

        setColleges(colleges);
        setYears(years);
        setDepartments(departments);
        setSections(sections);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedContest) return;

      const { data: selectedData, error: selectedError } = await supabase
        .from(selectedContest)
        .select('*');

      if (selectedError) {
        console.error('Error fetching selected contest data:', selectedError);
        return;
      }

      setSelectedContestData(selectedData || []);

      const previousContestName = contests.find(contest => contest !== selectedContest) || '';
      const { data: previousData, error: previousError } = await supabase
        .from(previousContestName)
        .select('*');

      if (previousError) {
        console.error('Error fetching previous contest data:', previousError);
        return;
      }

      setPreviousContestData(previousData || []);
    };

    fetchData();
  }, [selectedContest, contests]);

  useEffect(() => {
    const filtered = selectedContestData.filter(item => {
      const collegeMatch = selectedCollege === 'All' || item.college === selectedCollege;
      const yearMatch = selectedYear === 'All' || item.year === selectedYear;
      const deptMatch = selectedDepartment === 'All' || item.dept === selectedDepartment;
      const sectionMatch = selectedSection === 'All' || item.section === selectedSection;
      return collegeMatch && yearMatch && deptMatch && sectionMatch;
    });

    setFilteredData(filtered);
  }, [selectedCollege, selectedYear, selectedDepartment, selectedSection, selectedContestData]);

  const questionCounts = {
    notAttended: filteredData.filter(item => item.no_of_questions === null).length,
    0: filteredData.filter(item => item.no_of_questions === 0).length,
    1: filteredData.filter(item => item.no_of_questions === 1).length,
    2: filteredData.filter(item => item.no_of_questions === 2).length,
    3: filteredData.filter(item => item.no_of_questions === 3).length,
    4: filteredData.filter(item => item.no_of_questions === 4).length,
  };

  const totalStudents = filteredData.length;
  const attendingPercentage = totalStudents > 0 ? ((totalStudents - questionCounts.notAttended) / totalStudents) * 100 : 0;
  const notAttendingPercentage = totalStudents > 0 ? (questionCounts.notAttended / totalStudents) * 100 : 0;

  const previousContestNotAttended = previousContestData.filter(item => item.no_of_questions === null).length;
  const previousContestTotal = previousContestData.length;
  const previousContestAttendingPercentage = previousContestTotal > 0 ? ((previousContestTotal - previousContestNotAttended) / previousContestTotal) * 100 : attendingPercentage;
  const previousContestNotAttendingPercentage = previousContestTotal > 0 ? (previousContestNotAttended / previousContestTotal) * 100 : notAttendingPercentage;

  const chartData = {
    pie: {
      labels: ['Not Attended', '0 Questions', '1 Question', '2 Questions', '3 Questions', '4 Questions'],
      datasets: [
        {
          label: 'Number of Students',
          data: [
            questionCounts.notAttended,
            questionCounts[0] === 0 ? null : questionCounts[0],
            questionCounts[1] === 0 ? null : questionCounts[1],
            questionCounts[2] === 0 ? null : questionCounts[2],
            questionCounts[3] === 0 ? null : questionCounts[3],
            questionCounts[4] === 0 ? null : questionCounts[4]
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
    },
    line: {
      labels: contests,
      datasets: [
        {
          label: 'Attending Percentage',
          data: [attendingPercentage, previousContestTotal === 0 ? attendingPercentage : previousContestAttendingPercentage],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 2,
          fill: true,
          pointBackgroundColor: 'rgb(75, 192, 192)',
        },
        {
          label: 'Not Attending Percentage',
          data: [notAttendingPercentage, previousContestTotal === 0 ? notAttendingPercentage : previousContestNotAttendingPercentage],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 2,
          fill: true,
          pointBackgroundColor: 'rgb(255, 99, 132)',
        },
      ],
    },
  };

  const pieOptions = {
    plugins: {
      datalabels: {
        color: '#000',
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          return value != null ? `${label}: ${value}`: ``;
        },
        font: {
          weight: 'bold',
          size: 12,
          family: 'Poppins',
        },
      },
    },
  };

  const lineOptions = {
    plugins: {
      datalabels: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="container mx-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <ThreeDots height="80" width="80" radius="9" color="#4fa94d" ariaLabel="three-dots-loading" visible={true} />
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col items-center justify-center space-y-4">
              <div className="flex flex-wrap gap-4 justify-center">
              <label htmlFor="college" className="block text-lg font-medium text-gray-700 mb-2">Select College:</label>
                <select value={selectedCollege} onChange={(e) => setSelectedCollege(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  {colleges.map((college) => (
                    <option key={college} value={college}>
                      {toTitleCase(college)}
                    </option>
                  ))}
                </select>
                <label htmlFor="year" className="block text-lg font-medium text-gray-700 mb-2">Select Year:</label>

                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <label htmlFor="department" className="block text-lg font-medium text-gray-700 mb-2">Select Department:</label>
                <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {toTitleCase(dept)}
                    </option>
                  ))}
                </select>
                <label htmlFor="section" className="block text-lg font-medium text-gray-700 mb-2">Select Section:</label>

                <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  {sections.map((section) => (
                    <option key={section} value={section}>
                      {toTitleCase(section)}
                    </option>
                  ))}
                </select>
              </div>
              <label htmlFor="contest" className="block text-lg font-medium text-gray-700 mb-2">Select Contest:</label>

              <select value={selectedContest} onChange={(e) => setSelectedContest(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                {contests.map((contest) => (
                  <option key={contest} value={contest}>
                    {toTitleCase(contest.replace(/_/g, ' '))}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-bold mb-4 text-center">Participation Summary</h2>
                <Pie data={chartData.pie} options={pieOptions} />
              </div>
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-bold mb-4 text-center">Contest Trend</h2>
                <Line data={chartData.line} options={lineOptions} />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link href="/">
          <button className="px-8 py-4 text-2xl font-semibold border-2 border-black rounded-lg shadow-md bg-gray-800 text-white hover:bg-gray-500">
            Go to Home
          </button>
        </Link>
              
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
