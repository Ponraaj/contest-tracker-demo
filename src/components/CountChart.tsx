// "use client";
// import React, { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';
// import 'chart.js/auto';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
// import { Chart as ChartJS, ChartArea, ChartDataset } from 'chart.js';
// import getLeetCodeUserDetails from '@/lib/leetcode/index';
// import { ThreeDots } from 'react-loader-spinner';
// import { Doughnut } from 'react-chartjs-2';

// ChartJS.register(ChartDataLabels);

// // Define the centerText plugin
// const centerTextPlugin = {
//   id: 'centerText',
//   beforeDraw: (chart: { ctx: CanvasRenderingContext2D; chartArea: ChartArea; config: any; }) => {
//     const { ctx, chartArea, config } = chart;
//     const { centerText } = config.options.plugins;
//     if (centerText?.display) {
//       const centerX = (chartArea.left + chartArea.right) / 2;
//       const centerY = (chartArea.top + chartArea.bottom) / 2;
//       ctx.save();
//       ctx.textAlign = 'center';
//       ctx.textBaseline = 'middle';
//       ctx.font = `${centerText.font.size}px ${centerText.font.weight}`;
//       ctx.fillStyle = centerText.color;
//       ctx.fillText(centerText.text, centerX, centerY);
//       ctx.restore();
//     }
//   },
// };

// ChartJS.register(centerTextPlugin);

// interface DoughnutChartProps {
//   username: string;
// }

// const DoughnutChart: React.FC<DoughnutChartProps> = ({ username }) => {
//   const [chartData, setChartData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const data = await getLeetCodeUserDetails(username);

//         if (data && data.problemsSolved.length > 0) {
//           const difficulties = ['Easy', 'Medium', 'Hard'];
//           const colors = ['#229954', '#FAC624', '#C70039'];
          
//           // Filter out segments with zero count
//           const filteredData = difficulties
//             .map((difficulty, index) => {
//               const problemData = data.problemsSolved.find((item: any) => item.difficulty === difficulty);
//               return problemData && problemData.count > 0 ? { count: problemData.count, color: colors[index], difficulty } : null;
//             })
//             .filter(item => item !== null);

//           const counts = filteredData.map(item => item!.count);
//           const filteredColors = filteredData.map(item => item!.color);
//           const filteredLabels = filteredData.map(item => item!.difficulty);

//           // Calculate the total count
//           const totalCount = counts.reduce((acc, count) => acc + count, 0);

//           setChartData({
//             labels: filteredLabels,
//             datasets: [
//               {
//                 data: counts,
//                 backgroundColor: filteredColors,
//                 borderRadius: 8,
//                 borderWidth: 5,
//                 weight: 10,
//               } as ChartDataset<'doughnut'>,
//             ],
//             totalCount,  // Store total count in the chart data
//           });
//         } else {
//           setChartData(null);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setChartData(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [username]);

//   if (loading) {
//     return (
//       <div className='flex justify-center items-center'>
//         <ThreeDots
//           visible={true}
//           height="80"
//           width="80"
//           color="#4fa94d"
//           radius="9"
//           ariaLabel="three-dots-loading"
//         />
//       </div>
//     );
//   }

//   if (!chartData) {
//     return <p>No data available for {username}</p>;
//   }

//   return (
//     <div className="container flex items-center flex-col justify-center bg-white rounded-lg shadow-lg">
//       <p className='font-semibold'>Problem Count</p>
//       <div className='w-[350px] relative'>
//         <Doughnut
//           data={chartData}
//           options={{
//             plugins: {
//               legend: {
//                 display: true,
//               },
//               tooltip: {
//                 enabled: false,  // Disable tooltips entirely
//               },
//               datalabels: {
//                 color: '#000',
//                 font: {
//                   weight: 'bolder',
//                   size: 16,
//                 },
//                 formatter: (value: number) => value,
//               },
//               // Center Text Plugin
//               centerText: {
//                 display: true,
//                 text: `${chartData.totalCount}`, // Display the total count at the center
//                 color: '#000',
//                 font: {
//                   size: 20,
//                   weight: 'bolder',
//                 },
//               },
//             },
//             hover: {
//               mode: null as any,  // Disable hover mode entirely
//             },
//             elements: {
//               arc: {
//                 hoverBorderWidth: 0,  // No border change on hover
//                 hoverBorderColor: 'transparent',  // No border color on hover
//                 hoverOffset: 0,  // No offset on hover
//               },
//             },
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default DoughnutChart;

"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ChartArea, ChartDataset } from 'chart.js';
import getLeetCodeUserDetails from '@/lib/leetcode/index';
import { ThreeDots } from 'react-loader-spinner';
import { Doughnut } from 'react-chartjs-2';
import "../app/globals.css";

ChartJS.register(ChartDataLabels);

// Define the centerText plugin
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw: (chart: { ctx: CanvasRenderingContext2D; chartArea: ChartArea; config: any; }) => {
    const { ctx, chartArea, config } = chart;
    const { centerText } = config.options.plugins;
    if (centerText?.display) {
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${centerText.font.size}px ${centerText.font.weight}`;
      ctx.fillStyle = centerText.color;
      ctx.fillText(centerText.text, centerX, centerY);
      ctx.restore();
    }
  },
};

ChartJS.register(centerTextPlugin);

interface DoughnutChartProps {
  username: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ username }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getLeetCodeUserDetails(username);

        if (data && data.problemsSolved.length > 0) {
          const difficulties = ['Easy', 'Medium', 'Hard'];
          const colors = ['#229954', '#FAC624', '#C70039'];
          
          // Filter out segments with zero count
          const filteredData = difficulties
            .map((difficulty, index) => {
              const problemData = data.problemsSolved.find((item: any) => item.difficulty === difficulty);
              return problemData && problemData.count > 0 ? { count: problemData.count, color: colors[index], difficulty } : null;
            })
            .filter(item => item !== null);

          const counts = filteredData.map(item => item!.count);
          const filteredColors = filteredData.map(item => item!.color);
          const filteredLabels = filteredData.map(item => item!.difficulty);

          // Calculate the total count
          const totalCount = counts.reduce((acc, count) => acc + count, 0);

          setChartData({
            labels: filteredLabels,
            datasets: [
              {
                data: counts,
                backgroundColor: filteredColors,
                borderRadius: 8,
                borderWidth: 5,
                weight: 10,
              } as ChartDataset<'doughnut'>,
            ],
            totalCount,  // Store total count in the chart data
          });
        } else {
          setChartData(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (loading) {
    return (
      <div className='flex justify-center items-center'>
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          radius="9"
          ariaLabel="three-dots-loading"
        />
      </div>
    );
  }

  if (!chartData) {
    return <p>No data available for {username}</p>;
  }

  return (
    <div className="container flex items-center flex-col justify-center bg-white rounded-lg shadow-lg">
      <p className='font-semibold'>Problem Count</p>
      <div className='w-[350px] relative'>
        <Doughnut
          data={chartData}
          options={{
            plugins: {
              legend: {
                display: true,
              },
              tooltip: {
                enabled: false,  // Disable tooltips entirely
              },
              datalabels: {
                color: '#000',
                font: {
                  weight: 'bold',
                  size: 16,
                  family: 'Poppins, sans-serif', // Use Poppins font
                },
                formatter: (value: number) => value,
              },
              // Center Text Plugin
              centerText: {
                display: true,
                text: `${chartData.totalCount}`, // Display the total count at the center
                color: '#000',
                font: {
                  size: 20,
                  weight: 'bold',
                  family: 'Poppins, sans-serif', // Use Poppins font
                },
              },
            },
            hover: {
              mode: null as any,  // Disable hover mode entirely
            },
            elements: {
              arc: {
                hoverBorderWidth: 0,  // No border change on hover
                hoverBorderColor: 'transparent',  // No border color on hover
                hoverOffset: 0,  // No offset on hover
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default DoughnutChart;
