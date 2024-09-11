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
          const total = context.chart.data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0);
          const percentage = (value / total) * 100;
          // Show label with the value and percentage
          return `${context.chart.data.labels[context.dataIndex]}: ${value}`;
        },
        font: {
          weight: 'bold' as const,
          size: 14,
          family: 'Poppins, sans-serif',
        },
        // Position the labels dynamically based on the percentage
        anchor: (context: any) => {
          const total = context.chart.data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0);
          const percentage = (context.raw / total) * 100;
          return percentage < 10 ? 'end' : 'center';  // Push small slices' labels out
        },
        align: 'start' as const,   // Align labels towards the outer part of the slice
        offset: (context: any) => {
          const total = context.chart.data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0);
          const percentage = (context.raw / total) * 100;
          return percentage < 10 ? 50 : 10; // Larger offset for smaller slices
        },
        padding: {
          top: 10,
          bottom: 10,
        },
        clip: false,      // Ensure labels are not clipped
      },
    },
    layout: {
      padding: 20,  // Increase padding to avoid collisions
    },
  };

  return (
    <div className='w-full grid justify-center'>
      <h2 className="text-lg font-semibold mb-2 pr-2">Question Distribution</h2>
      <Pie data={data} options={pieOptions} />
    </div>
  );
};
export default PieChart;
