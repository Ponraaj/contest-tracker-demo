// "use client";
// import React, { useEffect, useState } from 'react';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
// import { createClient } from '@/lib/supabase/client';

// // Register Chart.js components
// ChartJS.register(Title, Tooltip, Legend, ArcElement);

// const supabase = createClient();

// interface SectionData {
//   section: string;
//   totalQuestions: number;
// }

// const MyDoughnutChart: React.FC = () => {
//   const [data, setData] = useState<any[]>([]);
//   const [filteredData, setFilteredData] = useState<SectionData[]>([]);
//   const [colleges] = useState<string[]>(['All', 'CIT', 'CITAR']);
//   const [years] = useState<string[]>(['All', '2', '3', '4']);
//   const [selectedCollege, setSelectedCollege] = useState<string>('All');
//   const [selectedYear, setSelectedYear] = useState<string>('All');

//   useEffect(() => {
//     const fetchData = async () => {
//       const { data, error } = await supabase
//         .from('weekly_contest_411')
//         .select('dept, section, no_of_questions, college, year');

//       if (error) {
//         console.error('Error fetching data:', error);
//         return;
//       }
      
//       setData(data || []);
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const filtered = data.filter(item => {
//       const collegeMatch = selectedCollege === 'All' || item.college === selectedCollege;
//       const yearMatch = selectedYear === 'All' || item.year === selectedYear;
//       return collegeMatch && yearMatch;
//     });

//     const groupedSections = filtered.reduce((acc: any, item: any) => {
//       const { section, no_of_questions } = item;
//       if (!acc[section]) {
//         acc[section] = 0;
//       }
//       acc[section] += no_of_questions;
//       return acc;
//     }, {});

//     const formattedSections: SectionData[] = Object.keys(groupedSections).map(section => ({
//       section,
//       totalQuestions: groupedSections[section],
//     }));

//     setFilteredData(formattedSections);
//   }, [selectedCollege, selectedYear, data]);

//   const chartData = {
//     labels: filteredData.map(item => item.section),
//     datasets: [
//       {
//         label: 'Total Questions',
//         data: filteredData.map(item => item.totalQuestions),
//         backgroundColor: [
//           'rgb(255, 99, 132)',
//           'rgb(54, 162, 235)',
//           'rgb(255, 205, 86)',
//           'rgb(75, 192, 192)',
//           'rgb(153, 102, 255)',
//           'rgb(255, 159, 64)',
//           // Add more colors if needed
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div>
//       <div>
//         <label htmlFor="college">Select College:</label>
//         <select
//           id="college"
//           value={selectedCollege}
//           onChange={(e) => setSelectedCollege(e.target.value)}
//         >
//           {colleges.map(college => (
//             <option key={college} value={college}>{college}</option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label htmlFor="year">Select Year:</label>
//         <select
//           id="year"
//           value={selectedYear}
//           onChange={(e) => setSelectedYear(e.target.value)}
//         >
//           {years.map(year => (
//             <option key={year} value={year}>{year}</option>
//           ))}
//         </select>
//       </div>

//       {filteredData.length > 0 ? (
//         <div style={{ width: '400px', height: '400px' }}>
//           <Pie data={chartData} />
//         </div>
//       ) : (
//         <p>No data available for the selected filters.</p>
//       )}
//     </div>
//   );
// };

// export default MyDoughnutChart;
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
  const [selectedCollege, setSelectedCollege] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedSection, setSelectedSection] = useState<string>('All');

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('weekly_contest_411')
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
  }, []);

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
    <div>
      <div>
        <label htmlFor="college">Select College:</label>
        <select
          id="college"
          value={selectedCollege}
          onChange={(e) => setSelectedCollege(e.target.value)}
        >
          {colleges.map(college => (
            <option key={college} value={college}>{college}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="year">Select Year:</label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="department">Select Department:</label>
        <select
          id="department"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="section">Select Section:</label>
        <select
          id="section"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
        >
          {sections.map(section => (
            <option key={section} value={section}>{section}</option>
          ))}
        </select>
      </div>

      {filteredData.length > 0 ? (
        <div style={{ width: '400px', height: '400px' }}>
          <Pie data={chartData} />
        </div>
      ) : (
        <p>No data available for the selected filters.</p>
      )}
    </div>
  );
};

export default MyDoughnutChart;