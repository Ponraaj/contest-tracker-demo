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
          const contestNames = lastFourContests.map((contest: any) => {
            const title = contest?.contest?.title || 'N/A';
            const match = title.match(/^(B|W).*?(\d+)/);
            return match ? match[1] + match[2] : 'N/A';
          });          
          setChartData({
            labels: contestNames.map((contest: any) => contest),
            datasets: [
              {
                label: 'Attended',  // Set the label to an empty string
                data: lastFourContests.map((contest: any) => contest?.rating || 0),
                fill: false,
                borderWidth:2,
                borderColor: 'green',
                backgroundColor: 'green',
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
              {
                label:'Not Attended',
                borderWidth: '2',
                borderColor: 'red',
                backgroundColor: 'red',
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
    return (
      <div className='flex justify-items-center justify-center'>
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  if (!chartData || chartData.labels.length === 0) {
    return <p>No data available for {username}</p>;
  }

  return (
    <div className="flex justify-center items-center pr-[20px]">
      <div className='w-[700px] p-[20px] pt-12'>
        <p className='font-semibold'>Previous 5 contest rankings</p>
        <div className="flex justify-center gap-4 my-4">
          <div className="flex items-center gap-2">
            {/* <span className="bg-green-500 w-4 h-4 inline-block rounded-full"></span> */}
            <span className="font-semibold text-sm">B - Biweekly</span>
          </div>
          <div className="flex items-center gap-2">
            {/* <span className="bg-blue-500 w-4 h-4 inline-block rounded-full"></span> */}
            <span className="font-semibold text-sm">W - Weekly</span>
          </div>
        </div>
        <Line
          data={chartData}
          options={{
            plugins: {
              legend: {
                labels: {
                  color: '#1c2833', // Set the color for the legend labels
                  font: {
                    weight: 'bold',
                    family: 'Poppins, sans-serif',
                  }
                },
                display: false, // Disable the legend to remove the label box
              },
              tooltip: {
                enabled: true, // Enable tooltips on hover
                callbacks: {
                  label: (context) => {
                    const value = context.raw;
                    const index = context.dataIndex;
                    const attended = chartData.datasets[0].pointBackgroundColor[index] === 'green';
                    const status = attended ? 'Attended' : 'Not Attended';

                    return `${status} - Rating: ${value}`;
                  },
                },
              },
              datalabels: {
                color: '#000',
                font: {
                  size: 0,
                },
                formatter: (value: number) => value,
              },
            },
            scales: {
              x: {
                ticks: {
                  color: 'black',
                  font: {
                    weight: 'bold', // Set the font weight to semibold for x-axis labels
                    family: 'Poppins, sans-serif', // Use Poppins font
                  },
                },
              },
              y: {
                ticks: {
                  color: 'black',
                  font: {
                    weight: 'bold', // Set the font weight to semibold for y-axis labels
                    family: 'Poppins, sans-serif', // Use Poppins font
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
            interaction: {
              mode: 'nearest', // Only show tooltip on hover
              intersect: true,
            },
          }}
        />
      </div>
    </div>
  );
};

export default LineChart;