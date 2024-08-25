// src/components/LineChart.tsx

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
      fill: boolean;
    }[];
  };
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-2">Attendance Percentage</h3>
      <Line data={data} />
    </div>
  );
};

export default LineChart;
