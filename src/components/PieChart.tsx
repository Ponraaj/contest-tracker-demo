import React from 'react';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels);

interface PieChartProps {
  data: any;
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const pieOptions = {
    plugins: {
      datalabels: {
        color: '#000',
        formatter: (value: any, context: any) => {
          // Show label only if value is 10 or greater
          return value >= 10 ? `${context.chart.data.labels[context.dataIndex]}: ${value}` : '';
        },
        font: {
          weight: 'bold' as const,
          size: 14,
          family: 'Poppins, sans-serif',
        },
        anchor: 'end',     // Position labels outside of the pie slices
        align: 'start',    // Align labels towards the outer edge
        offset: 10,        // Adjust offset as needed
        padding: {
          top: 10,
          bottom: 10,
        },
        clip: false,       // Ensure labels are not clipped
      },
    },
    layout: {
      padding: 20,  // Increase padding to avoid label collisions
    },
  };

  return (
    <div className='w-full grid justify-center bg-gray-100 shadow-md rounded-lg p-4'>
      <h2 className="text-lg font-semibold mb-2 pr-2">Question Distribution</h2>
      <Pie data={data} options={pieOptions} />
    </div>
  );
};

export default PieChart;