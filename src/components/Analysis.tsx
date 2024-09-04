"use client";

// import React, { useEffect, useState } from 'react';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
// import { createClient } from '@/lib/supabase/client';
// import Link from 'next/link';
// import { ThreeDots } from 'react-loader-spinner';

// ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

// const supabase = createClient();

// const AnalysisPage: React.FC = () => {
//   const [data, setData] = useState<any[]>([]);
//   const [filteredData, setFilteredData] = useState<any[]>([]);
//   const [colleges, setColleges] = useState<string[]>(['All']);
//   const [years, setYears] = useState<string[]>(['All']);
//   const [departments, setDepartments] = useState<string[]>(['All']);
//   const [sections, setSections] = useState<string[]>(['All']);
//   const [contests, setContests] = useState<string[]>([]);
//   const [selectedCollege, setSelectedCollege] = useState<string>('All');
//   const [selectedYear, setSelectedYear] = useState<string>('All');
//   const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
//   const [selectedSection, setSelectedSection] = useState<string>('All');
//   const [selectedContest, setSelectedContest] = useState<string>('');
//   const [loading, setLoading] = useState(true);

//   const toTitleCase = (str: string) => {
//     return str
//       .toLowerCase()
//       .split(' ')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');
//   };

//   useEffect(() => {
//     const fetchContests = async () => {
//       try {
//         setLoading(true);
//       const { data: contestsData, error } = await supabase
//         .from('contests')
//         .select('contest_name')
//         .order('created_at', { ascending: false });  // Ensure 'created_at' is in your table

//       if (error) {
//         throw error;
//       }

//       const contestNames = contestsData.map(contest => contest.contest_name);
//       setContests(contestNames);
//       if (contestNames.length > 0) {
//         setSelectedContest(contestNames[0]);  // Set the default contest to the most recent one
//       }
//       } catch (error) {
//         console.error('Error fetching contests:', error);
//         return;
//       }finally {
//         setLoading(false);
//       }
//     };

//     fetchContests();
    
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!selectedContest) return;

//       const { data, error } = await supabase
//         .from(selectedContest)
//         .select('*');

//       if (error) {
//         console.error('Error fetching data:', error);
//         return;
//       }

//       setData(data || []);

//       // Populate dropdowns
//       setColleges(['All', ...new Set(data.map((item: any) => item.college))]);
//       setYears(['All', ...new Set(data.map((item: any) => item.year))]);
//       setDepartments(['All', ...new Set(data.map((item: any) => item.dept))]);
//       setSections(['All', ...new Set(data.map((item: any) => item.section))]);
//     };

//     fetchData();
//   }, [selectedContest]);

  

//   useEffect(() => {
//     const filtered = data.filter(item => {
//       const collegeMatch = selectedCollege === 'All' || item.college === selectedCollege;
//       const yearMatch = selectedYear === 'All' || item.year === selectedYear;
//       const deptMatch = selectedDepartment === 'All' || item.dept === selectedDepartment;
//       const sectionMatch = selectedSection === 'All' || item.section === selectedSection;
//       return collegeMatch && yearMatch && deptMatch && sectionMatch;
//     });

//     setFilteredData(filtered);
//   }, [selectedCollege, selectedYear, selectedDepartment, selectedSection, data]);

//   const questionCounts = {
//     notAttended: filteredData.filter(item => item.no_of_questions === null).length,
//     0: filteredData.filter(item => item.no_of_questions === 0).length,
//     1: filteredData.filter(item => item.no_of_questions === 1).length,
//     2: filteredData.filter(item => item.no_of_questions === 2).length,
//     3: filteredData.filter(item => item.no_of_questions === 3).length,
//     4: filteredData.filter(item => item.no_of_questions === 4).length,
//   };

//   const chartData = {
//     labels: ['Not Attended', '0 Questions', '1 Question', '2 Questions', '3 Questions', '4 Questions'],
//     datasets: [
//       {
//         label: 'Number of Students',
//         data: [
//           questionCounts.notAttended,
//           questionCounts[0],
//           questionCounts[1],
//           questionCounts[2],
//           questionCounts[3],
//           questionCounts[4]
//         ],
//         backgroundColor: [
//           'rgb(128, 128, 128)',  // Grey for Not Attended
//           'rgb(255, 99, 132)',
//           'rgb(255, 159, 64)',
//           'rgb(255, 205, 86)',
//           'rgb(75, 192, 192)',
//           'rgb(54, 162, 235)',
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };
//   if (loading) {
//     return <div className='flex justify-items-center justify-center pt-[400px]'> <ThreeDots
//       visible={true}
//       height="80"
//       width="80"
//       color="#4fa94d"
//       radius="9"
//       ariaLabel="three-dots-loading"
//       wrapperStyle={{}}
//       wrapperClass=""
//       />
//     </div>;
//   }

//   return (
//     <div className="pb-6 px-10">
//       <div className="text-2xl mb-4">
//         <h1 className="text-5xl font-bold mb-6 text-center pt-5">{toTitleCase(selectedContest.replace(/_/g, ' '))}</h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//           <div>
//             <label htmlFor="contest" className="block text-lg font-medium text-gray-700 mb-2">Select Contest:</label>
//             <select
//               id="contest"
//               value={selectedContest}
//               onChange={(e) => setSelectedContest(e.target.value)}
//               className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             >
//               {contests.map(contest => (
//                 <option key={contest} value={contest}>{toTitleCase(contest.replace(/_/g, ' '))}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label htmlFor="college" className="block text-lg font-medium text-gray-700 mb-2">Select College:</label>
//             <select
//               id="college"
//               value={selectedCollege}
//               onChange={(e) => setSelectedCollege(e.target.value)}
//               className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             >
//               {colleges.map(college => (
//                 <option key={college} value={college}>{college}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label htmlFor="year" className="block text-lg font-medium text-gray-700 mb-2">Select Year:</label>
//             <select
//               id="year"
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(e.target.value)}
//               className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             >
//               {years.map(year => (
//                 <option key={year} value={year}>{year}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label htmlFor="department" className="block text-lg font-medium text-gray-700 mb-2">Select Department:</label>
//             <select
//               id="department"
//               value={selectedDepartment}
//               onChange={(e) => setSelectedDepartment(e.target.value)}
//               className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             >
//               {departments.map(dept => (
//                 <option key={dept} value={dept}>{dept}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label htmlFor="section" className="block text-lg font-medium text-gray-700 mb-2">Select Section:</label>
//             <select
//               id="section"
//               value={selectedSection}
//               onChange={(e) => setSelectedSection(e.target.value)}
//               className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
            
//               {sections.map(section => (
//                 <option key={section} value={section}>{section}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-center">
//         {filteredData.length > 0 ? (
//           <div className="w-full max-w-xl">
//             <Pie data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
//           </div>
//         ) : (
//           <p className="text-center text-lg text-gray-500">No data available for the selected filters.</p>
//         )}
//       </div>
//       <div className="flex justify-center pt-[60px]">
//         <Link href="/">
//           <button className="px-8 py-4 text-2xl font-semibold border-2 border-black rounded-lg shadow-md bg-gray-800 text-white hover:bg-gray-500">
//           Back to Home
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// };
// export default AnalysisPage;
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
  const [previousContestData, setPreviousContestData] = useState<{ [key: string]: any[] }>({});
  const [selectedContestData, setSelectedContestData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const toTitleCase = (str: any) => {
    if (typeof str !== 'string') return '';  // Ensure str is a string
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

      const previousContestNames = contests.filter(contest => contest !== selectedContest);
      const previousContestData: { [key: string]: any[] } = {};

      for (const contestName of previousContestNames) {
        const { data: prevData, error: prevError } = await supabase
          .from(contestName)
          .select('*');

        if (prevError) {
          console.error(`Error fetching data for previous contest ${contestName}:`, prevError);
          continue;
        }

        previousContestData[contestName] = prevData || [];
      }

      setPreviousContestData(previousContestData);
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

  const previousContests = Object.keys(previousContestData);

const limitedPreviousContests = previousContests.slice(-4);

// Ensure the selected contest is first and followed by the limited previous contests in correct order
const allContests = [selectedContest, ...limitedPreviousContests];

// Prepare the data for attending and not attending percentages
const attendingData = [
  attendingPercentage,
  ...limitedPreviousContests.map(contest => {
    const prevData = previousContestData[contest] || [];
    const prevQuestionCounts = {
      notAttended: prevData.filter(item => item.no_of_questions === null).length,
      0: prevData.filter(item => item.no_of_questions === 0).length,
      1: prevData.filter(item => item.no_of_questions === 1).length,
      2: prevData.filter(item => item.no_of_questions === 2).length,
      3: prevData.filter(item => item.no_of_questions === 3).length,
      4: prevData.filter(item => item.no_of_questions === 4).length,
    };
    const prevTotalStudents = prevData.length;
    return prevTotalStudents > 0 ? ((prevTotalStudents - prevQuestionCounts.notAttended) / prevTotalStudents) * 100 : 0;
  }),
];

const notAttendingData = [
  notAttendingPercentage,
  ...limitedPreviousContests.map(contest => {
    const prevData = previousContestData[contest] || [];
    const prevQuestionCounts = {
      notAttended: prevData.filter(item => item.no_of_questions === null).length,
      0: prevData.filter(item => item.no_of_questions === 0).length,
      1: prevData.filter(item => item.no_of_questions === 1).length,
      2: prevData.filter(item => item.no_of_questions === 2).length,
      3: prevData.filter(item => item.no_of_questions === 3).length,
      4: prevData.filter(item => item.no_of_questions === 4).length,
    };
    const prevTotalStudents = prevData.length;
    return prevTotalStudents > 0 ? (prevQuestionCounts.notAttended / prevTotalStudents) * 100 : 0;
  }),
];

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
      datalabels: {
        display: false, // This hides the data labels
      },
    },
    // {
    //   label: 'Not Attending Percentage',
    //   data: notAttendingData,
    //   backgroundColor: 'rgba(255, 99, 132, 0.2)',
    //   borderColor: 'rgb(255, 99, 132)',
    //   borderWidth: 2,
    //   fill: true,
    //   pointBackgroundColor: 'rgb(255, 99, 132)',
    //   datalabels: {
    //     display: false, // This hides the data labels
    //   },
    // },
  ],
};

  const chartData = {
    pie: {
      labels: ['Not Attended','0 solved', '1 solved', '2 solved', '3 solved', '4 solved'],
      datasets: [
        {
          label: 'Question Distribution',
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
    line: lineChartData,
  };

  const pieOptions = {
    plugins: {
      datalabels: {
        color: '#000',
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          return value != null ? `${label}: ${value}` : '';
        },
        font: {
          weight: 'bold',
          size: 25,
          family: 'Poppins, sans-serif',
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
    <div className="p-4 space-y-4">
      <div className="flex justify-between space-x-4">
        <div className="w-1/4 p-4 bg-gray-100 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Filter by College</h2>
          <select value={selectedCollege} onChange={(e) => setSelectedCollege(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
            {colleges.map(college => (
              <option key={college} value={college}>{toTitleCase(college)}</option>
            ))}
          </select>
        </div>
        <div className="w-1/4 p-4 bg-gray-100 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Filter by Year</h2>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
        </div>
        <div className="w-1/4 p-4 bg-gray-100 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Filter by Department</h2>
          <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
            {departments.map(dept => (
              <option key={dept} value={dept}>{toTitleCase(dept)}</option>
            ))}
          </select>
        </div>
        <div className="w-1/4 p-4 bg-gray-100 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Filter by Section</h2>
          <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
            {sections.map(section => (
              <option key={section} value={section}>{toTitleCase(section)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-4 bg-gray-100 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-2">Select Contest</h2>
        {loading ? (
          <div className="flex justify-center items-center">
            <ThreeDots color="#00BFFF" height={80} width={80} />
          </div>
        ) : (
          <select value={selectedContest} onChange={(e) => setSelectedContest(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
            {contests.map(contest => (
              <option key={contest} value={contest}>{toTitleCase(contest)}</option>
            ))}
          </select>
        )}
      </div>

      {/* <div className=" grid-rows md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 p-4 bg-gray-100 rounded-md shadow-md">
        <div className='w-[1200px] grid justify-center'>
          <h2 className="text-lg font-semibold mb-2 pr-2">Question Distribution</h2>
          <Pie data={chartData.pie} options={pieOptions} />
        </div>
        <div></div>
        </div>
        <div className="flex-1 p-4 bg-gray-100 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Attending vs Not Attending</h2>
          <Line data={chartData.line} options={lineOptions} />
        </div>
      </div> */}
      <div className="grid grid-rows-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 shadow-md rounded-lg p-6">
                <div className='w-full grid justify-center'>
          <h2 className="text-lg font-semibold mb-2 pr-2">Question Distribution</h2>
          <Pie data={chartData.pie} options={pieOptions} />
        </div>
              </div>
              <div className="bg-gray-100 shadow-md rounded-lg p-6">
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

    </div>
    
  );
};

export default AnalysisPage;