// "use client";

// import React, { useEffect, useState } from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
// import { createClient } from '@/lib/supabase/client';
// import Link from 'next/link';

// ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

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

//   const toTitleCase = (str: string) => {
//     return str
//       .toLowerCase()
//       .split(' ')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');
//   };

//   useEffect(() => {
//     const fetchContests = async () => {
//       const { data: contestsData, error } = await supabase
//         .from('contests')
//         .select('contest_name');

//       if (error) {
//         console.error('Error fetching contests:', error);
//         return;
//       }

//       const contestNames = contestsData.map(contest => contest.contest_name);
//       setContests(contestNames);
//       if (contestNames.length > 0) {
//         setSelectedContest(contestNames[0]);
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

//   return (
//     <div className="px-6 py-4">
//       <div className="text-2xl mb-4">
//         <h1 className="text-5xl font-bold mb-6 text-center pt-10">{toTitleCase(selectedContest.replace(/_/g, ' '))}</h1>

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
//               className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             >
//               {sections.map(section => (
//                 <option key={section} value={section}>{section}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-center">
//         {filteredData.length > 0 ? (
//           <div className="w-full max-w-4xl">
//             <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
//           </div>
//         ) : (
//           <p className="text-center text-lg text-gray-500">No data available for the selected filters.</p>
//         )}
//       </div>
//       <div className="flex justify-center pt-[60px]">
//       <Link href="/">
//           {/* <a className="px-8 py-4 text-2xl font-semibold border-2 border-black rounded-lg shadow-md bg-blue-500 text-white hover:bg-blue-600"> */}
//           <button className="px-8 py-4 text-2xl font-semibold border-2 border-black rounded-lg shadow-md bg-gray-800 text-white hover:bg-gray-500">
//             Back to Home
//             </button>
//           {/* </a> */}
//         </Link>      
//         </div>
//     </div>
//   );
// };

// export default AnalysisPage;

"use client";

import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

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

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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

  return (
    <div className="pb-6">
      <div className="text-2xl mb-4">
        <h1 className="text-5xl font-bold mb-6 text-center pt-5">{toTitleCase(selectedContest.replace(/_/g, ' '))}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="contest" className="block text-lg font-medium text-gray-700 mb-2">Select Contest:</label>
            <select
              id="contest"
              value={selectedContest}
              onChange={(e) => setSelectedContest(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {contests.map(contest => (
                <option key={contest} value={contest}>{toTitleCase(contest.replace(/_/g, ' '))}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="college" className="block text-lg font-medium text-gray-700 mb-2">Select College:</label>
            <select
              id="college"
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {colleges.map(college => (
                <option key={college} value={college}>{college}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year" className="block text-lg font-medium text-gray-700 mb-2">Select Year:</label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="department" className="block text-lg font-medium text-gray-700 mb-2">Select Department:</label>
            <select
              id="department"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="section" className="block text-lg font-medium text-gray-700 mb-2">Select Section:</label>
            <select
              id="section"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {sections.map(section => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        {filteredData.length > 0 ? (
          <div className="w-full max-w-xl">
            <Pie data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </div>
        ) : (
          <p className="text-center text-lg text-gray-500">No data available for the selected filters.</p>
        )}
      </div>
      <div className="flex justify-center pt-[60px]">
        <Link href="/">
          <button className="px-8 py-4 text-2xl font-semibold border-2 border-black rounded-lg shadow-md bg-gray-800 text-white hover:bg-gray-500">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AnalysisPage;
