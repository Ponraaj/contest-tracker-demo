// page.js this is the entry point of application

"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import 'chart.js/auto';
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});
const data = {
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'GeeksforGeeks Line Chart',
      data: [65, 59, 80, 81, 56],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
  ],
};
const LineChart:React.FC = (Contestdata:any) => {
  console.log(Contestdata)
  return (
    <div className="container flex justify-center items-center">
  <div className='w-[700px]'>
    {/* <h1 className="text-center mb-4">Example 1: Line Chart</h1> */}
    <Line data={data} />
  </div>
</div>

  );
};
export default LineChart;
