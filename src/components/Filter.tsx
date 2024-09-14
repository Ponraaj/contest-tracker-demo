import React from 'react';
import { Filters, FilterOptions } from '@/lib/types';

interface FilterProps {
  filters: Filters;
  onFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  filterOptions: FilterOptions;
}

const Filter: React.FC<FilterProps> = ({ filters, onFilterChange, filterOptions }) => {
  const sortOptions = (options: (string | number | null)[]) => {
    return options.filter(option => option !== null).sort((a, b) => {
      if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
      }
      return String(a).localeCompare(String(b));
    });
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      <select
        name="no_of_questions"
        value={filters.no_of_questions || ''}
        aria-label='No. of questions'
        onChange={onFilterChange}
        className="border border-gray-300 rounded-lg p-2 text-lg bg-white shadow-md focus:outline-none focus:ring focus:border-blue-300"
      >
        <option value="" disabled hidden>No. of Questions</option>
        <option value="">All</option>
        {sortOptions(filterOptions.no_of_questions).map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        name="section"
        value={filters.section || ''}
        aria-label='Section'
        onChange={onFilterChange}
        className="border border-gray-300 rounded-lg p-2 text-lg bg-white shadow-md focus:outline-none focus:ring focus:border-blue-300"
      >
        <option value="" disabled hidden>Section</option>
        <option value="">All</option>
        {sortOptions(filterOptions.section).map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        name="dept"
        value={filters.dept || ''}
        aria-label='Department'
        onChange={onFilterChange}
        className="border border-gray-300 rounded-lg p-2 text-lg bg-white shadow-md focus:outline-none focus:ring focus:border-blue-300"
      >
        <option value="" disabled hidden>Department</option>
        <option value="">All</option>
        {sortOptions(filterOptions.dept).map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        name="status"
        value={filters.status || ''}
        onChange={onFilterChange}
        aria-label='Status'
        className="border border-gray-300 rounded-lg p-2 text-lg bg-white shadow-md focus:outline-none focus:ring focus:border-blue-300"
      >
        <option value="" disabled hidden>Status</option>
        <option value="">All</option>
        {sortOptions(filterOptions.status).map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        name="year"
        value={filters.year || ''}
        onChange={onFilterChange}
        aria-label='Year'
        className="border border-gray-300 rounded-lg p-2 text-lg bg-white shadow-md focus:outline-none focus:ring focus:border-blue-300"
      >
        <option value="" disabled hidden>Year</option>
        <option value="">All</option>
        {sortOptions(filterOptions.year).map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        name="college"
        value={filters.college || ''}
        onChange={onFilterChange}
        aria-label='College'
        className="border border-gray-300 rounded-lg p-2 text-lg bg-white shadow-md focus:outline-none focus:ring focus:border-blue-300"
      >
        <option value="" disabled hidden>College</option>
        <option value="">All</option>
        {sortOptions(filterOptions.college).map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
