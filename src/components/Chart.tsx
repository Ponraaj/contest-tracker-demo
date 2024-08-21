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
                data: lastFourContests.map((contest: any) => contest?.rating || 0),
                fill: false,
                borderColor: 'green',
                tension: 0.5,
                pointBackgroundColor: lastFourContests.map((contest: any) =>
                  contest?.attended ? 'green' : 'red'
                ),
                pointBorderColor: lastFourContests.map((contest: any) =>
                  contest?.attended ? 'green' : 'red'
                ),
                pointRadius: 8,
              },
              {
                label: 'Contest Rating',
                borderColor: 'red',
              }
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
    return <p>Loading...</p>;
  }

  if (!chartData || chartData.labels.length === 0) {
    return <p>No data available for {username}</p>;
  }

  return (
    <div className="container flex justify-center items-center">
      <div className='w-[700px]'>
        <Line
          data={chartData}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.dataset.label || '';
                    const value = context.raw;
                    const index = context.dataIndex;
                    const attended = chartData.datasets[0].pointBackgroundColor[index] === 'green';
                    const status = attended ? 'Attended' : 'Not Attended';

                    return `${label}: ${status} - Rating: ${value}`;
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