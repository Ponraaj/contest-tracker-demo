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
      datalabels: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div className="bg-gray-100 shadow-md rounded-lg p-6">
      <h2 className="text-lg font-bold mb-4 text-center">Contest Trend</h2>
      <Line data={data} options={lineOptions} />
    </div>
  );
};

export default LineChart;