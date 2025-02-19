// BarChart.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels);

interface BarChartProps {
  data: any;
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const barOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#fff', // Set legend label color to black
          font: {
            size: 25,
            weight: 'bold' as const,
          },
        },
        display: false, // Hide the legend if not needed
      },
      title: {
        display: true,
        text: 'Question Distribution (Bar Chart)',
        color: '#fff', // Set title color to black
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        offset: 4,
        color: '#fff', // Set data label color to black
        font: {
          size: 14,
          weight: 'bold' as const,
        },
        formatter: (value: number) => value, // Display the value itself as the label
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        title: {
          display: true,
          text: 'Number of Questions',
          color: '#fff', // Set x-axis title color to black
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
        ticks: {
          color: '#fff', // Set x-axis tick labels color to black
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        title: {
          display: true,
          text: 'Count',
          color: '#fff', // Set y-axis title color to black
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
        ticks: {
          color: '#fff', // Set y-axis tick labels color to black
        },
      },
    },
  };

  return (
    <div className="w-full h-full p-4">
      <Bar data={data} options={barOptions} />
    </div>
  );
};

export default BarChart;
