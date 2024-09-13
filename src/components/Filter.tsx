import React from 'react';

interface FilterComponentProps {
  filters: {
    colleges: string[];
    years: string[];
    depts: string[];
    sections: string[];
  };
  onFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="flex justify-center space-x-6 py-4">
      <select name="college" onChange={onFilterChange}>
        <option value="">All Colleges</option>
        {filters.colleges.map((college, index) => (
          <option key={index} value={college}>
            {college}
          </option>
        ))}
      </select>

      <select name="year" onChange={onFilterChange}>
        <option value="">All Years</option>
        {filters.years.map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </select>

      <select name="dept" onChange={onFilterChange}>
        <option value="">All Departments</option>
        {filters.depts.map((dept, index) => (
          <option key={index} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      <select name="section" onChange={onFilterChange}>
        <option value="">All Sections</option>
        {filters.sections.map((section, index) => (
          <option key={index} value={section}>
            {section}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterComponent;
