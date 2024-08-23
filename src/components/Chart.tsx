
"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import getLeetCodeUserDetails from '@/lib/leetcode/index';
import { ThreeDots } from 'react-loader-spinner';

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
      setLoading(true);
      try {
        const data = await getLeetCodeUserDetails(username);

        if (data && data.contestRanking.length > 0) {
          const lastFourContests = data.contestRanking.slice(-5);
          setChartData({
            labels: lastFourContests.map((contest: any) => contest?.contest?.title || 'N/A'),
            datasets: [
              {
                label: '',  // Set the label to an empty string
                data: lastFourContests.map((contest: any) => contest?.rating || 0),
                fill: false,
                borderColor: 'green',
                backgroundColor:'rgba(0, 0, 0, 0.5)',
                pointHoverRadius: 8,
                tension: 0.1,
                pointBackgroundColor: lastFourContests.map((contest: any) =>
                  contest?.attended ? 'green' : 'red'
                ),
                pointBorderColor: lastFourContests.map((contest: any) =>
                  contest?.attended ? 'green' : 'red'
                ),
                pointRadius: 8,
              },
            ],
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
    return <div className='flex justify-items-center justify-center'> <ThreeDots
      visible={true}
      height="80"
      width="80"
      color="#4fa94d"
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
      />
    </div>;
  }

  if (!chartData || chartData.labels.length === 0) {
    return <p>No data available for {username}</p>;
  }

  return (
    <div className="container flex justify-center items-center">
      <div className='w-[700px] bg-white rounded-lg shadow-lg pt-[20px]'>
      <p className='font-semibold'>Previous 5 contest rankings</p>
        <Line
          className='bg-'
          data={chartData}
          options={{
            plugins: {
              legend: {
                display: false, // Disable the legend to remove the label box
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.dataset.label || '';
                    const value = context.raw;
                    const index = context.dataIndex;
                    const attended = chartData.datasets[0].pointBackgroundColor[index] === 'green';
                    const status = attended ? 'Attended' : 'Not Attended';

                    return `${status} - Rating: ${value}`;
                  },
                },
              },
            },
            elements: {
              point: {
                borderColor: (context) => {
                  const index = context.dataIndex;
                  return chartData.datasets[0].pointBackgroundColor[index];
                },
                borderWidth: 2,
                hoverBorderColor: (context) => {
                  const index = context.dataIndex;
                  return chartData.datasets[0].pointBackgroundColor[index];
                },
                hoverBorderWidth: 2,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default LineChart;
