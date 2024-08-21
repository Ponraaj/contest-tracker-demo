// // page.js this is the entry point of application

// "use client";
// import React from 'react';
// import dynamic from 'next/dynamic';
// import 'chart.js/auto';
// import getLeetCodeUserDetails from '@/lib/leetcode';

// const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
//   ssr: false,
// });
// const data = {
//   labels: ['January', 'February', 'March', 'April', 'May'],
//   datasets: [
//     {
//       label: 'GeeksforGeeks Line Chart',
//       data: [65, 59, 80, 81, 56],
//       fill: false,
//       borderColor: 'rgb(75, 192, 192)',
//       tension: 0.1,
//     },
//   ],
// };
// const LineChart:React.FC = (Contestdata:any) => {
//   console.log(Contestdata)
//   return (
//     <div className="container flex justify-center items-center">
//   <div className='w-[700px]'>
//     {/* <h1 className="text-center mb-4">Example 1: Line Chart</h1> */}
//     <Line data={data} />
//   </div>
// </div>

//   );
// };
// export default LineChart;

// LineChart.tsx
"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import getLeetCodeUserDetails from '@/lib/leetcode/index';

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});

interface LineChartProps {
  username: string;
}

const LineChart: React.FC<LineChartProps> = ({ username }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLeetCodeUserDetails(username);
        
        if (data && data.contestRanking.length > 0) {
          const lastFourContests = data.contestRanking.slice(-5);
          setChartData({
            labels: lastFourContests.map((contest: any) => contest?.contest?.title || 'N/A'),
            datasets: [
              {
                label: 'Contest Rating',
                // data: data.contestRanking.map((contest: any) =>
                //   contest?.rating || 0
                data: lastFourContests.map((contest: any) =>{
                    if(contest?.attended){
                      return contest?.rating 
                    }else{
                      return 0
                    }
                }),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
              },
            ],
          });
        } else {
          setChartData(null); // No data available
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setChartData(null); // Handle error state
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!chartData || chartData.labels.length === 0) {
    return <p>No data available for {username}</p>;
  }

  return (
    <div className="container flex justify-center items-center">
      <div className='w-[700px]'>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default LineChart;
