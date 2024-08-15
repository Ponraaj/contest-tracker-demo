// src/components/TableComponent.tsx
import React from 'react';
import { Student } from '@/lib/types';

interface TableComponentProps {
  students: Student[];
}

const TableComponent: React.FC<TableComponentProps> = ({ students }) => {
  return (
    <table className="ml-[110px] mr-[100px]">
      <thead>
        <tr>
          <th className="w-[100px]">Rank</th>
          <th className="w-[239px]">Username</th>
          <th className="w-[150px]">Department</th>
          <th className="w-[150px]">Section</th>
          <th className="w-[100px]">Year</th>
          <th className="w-[150px]">No. of Questions</th>
          <th className="w-[150px]">Question ID</th>
          <th className="w-[60px]">Finish Time</th>
          <th className="w-[60px]">Status</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student, index) => (
          <tr key={index} className='hover:bg-gray-300 ease-out'>
            <td>{student.rank}</td>
            <td>{student.username}</td>
            <td>{student.dept}</td>
            <td>{student.section}</td>
            <td>{student.year}</td>
            <td>{student.no_of_questions}</td>
            <td>{student.question_ids?.join(', ')}</td>
            <td>{student.finish_time}</td>
            <td>{student.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
