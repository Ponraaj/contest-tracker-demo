// src/components/FilterComponent.tsx
"use client";

import React from 'react';
import { Filters } from '@/lib/types';

interface FilterComponentProps {
  filters: Filters;
  onFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  showFilters: boolean;
  toggleFilters: () => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ filters, onFilterChange, showFilters, toggleFilters }) => {
  return (
    <div>
      <center>
        <button className='border-black border-2 pl-5 pr-5 mt-10 w-30 rounded h-[70px] text-3xl' onClick={toggleFilters}>
          Filter
        </button>
      </center>
      {showFilters && (
        <div className="flex justify-center pt-10">
          {["status", "year", "dept", "section", "no_of_questions"].map((filter) => (
            <select
              key={filter}
              className="h-[70px] text-2xl mr-10 rounded"
              name={filter}
              onChange={onFilterChange}
              defaultValue=""
            >
              <option value="" disabled hidden>
                {filter.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
              </option>
              <option value="">All</option>
              {filter === "status" && (
                <>
                  <option value="attended">Attended</option>
                  <option value="not attended">Not Attended</option>
                </>
              )}
              {filter === "year" && (
                <>
                  <option value="2">2nd year</option>
                  <option value="3">3rd year</option>
                </>
              )}
              {filter === "dept" && (
                <>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
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
              {filter === "no_of_questions" && [4, 3, 2, 1, 0].map((val) => <option key={val} value={val}>{val}</option>)}
            </select>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
