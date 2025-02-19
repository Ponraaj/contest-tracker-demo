//linechart.tsx

import React from 'react';
import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, ChartDataLabels);

interface LineChartProps {
  data: any;
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const lineOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Contests',
          color: '#fff',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Percentage',
          color: '#fff',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        max: 100,
        ticks: {
          color: '#fff',
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4 text-center text-white">Contest Trend</h2>
      <div className='h-[300px] w-full'>
        <Line data={data} options={lineOptions} />
      </div>
    </div>
  );
};

export default LineChart;
