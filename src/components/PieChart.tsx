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
          const label = context.chart.data.labels[context.dataIndex];
          return value != null ? `${label}: ${value}` : '';
        },
        font: {
          weight: 'bold' as const,
          size: 25,
          family: 'Poppins, sans-serif',
        },
      },
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
