import React from 'react';
import { Filters } from '@/lib/types';

interface FilterComponentProps {
  filters: Filters;
  onFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ filters, onFilterChange }) => {
  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getFilterLabel = (filter: string) => {
    switch (filter) {
      case 'status':
        return 'Status';
      case 'college':
        return 'College';
      case 'year':
        return 'Year';
      case 'dept':
        return 'Department';
      case 'section':
        return 'Section';
      case 'no_of_questions':
        return 'Number of Questions';
      default:
        return toTitleCase(filter.replace('_', ' '));
    }
  };

  return (
    <div className="flex justify-center space-x-6 py-4">
      {["status", "college", "year", "dept", "section", "no_of_questions"].map((filter) => (
        <select
          key={filter}
          className="border border-gray-300 rounded-lg p-2 text-lg bg-white shadow-md focus:outline-none focus:ring focus:border-blue-300 shadow-black"
          name={filter}
          onChange={onFilterChange}
          defaultValue=""
        >
          <option value="" disabled hidden>
            {getFilterLabel(filter)}
          </option>
          <option value="">All</option>
          {filter === "status" && (
            <>
              <option value="attended">Attended</option>
              <option value="not attended">Not Attended</option>
            </>
          )}
          {filter === "college" && (
            <>
              <option value="CIT">CIT</option>
              <option value="CITAR">CITAR</option>
            </>
          )}
          {filter === "year" && (
            <>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </>
          )}
          {filter === "dept" && (
            <>
              <option value="CSE">CSE</option>
              {/* <option value="ECE">ECE</option> */}
            </>
          )}
          {filter === "section" && (
            <>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </>
          )}
          {filter === "no_of_questions" && [4, 3, 2, 1, 0].map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
      ))}
    </div>
  );
};

export default FilterComponent;
