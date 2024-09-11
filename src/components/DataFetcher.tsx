import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

interface DataFetcherProps {
  onDataFetched: (data: any) => void;
  onContestsFetched: (contests: string[]) => void;
  onFiltersFetched: (filters: any) => void;
}

const DataFetcher: React.FC<DataFetcherProps> = ({ onDataFetched, onContestsFetched, onFiltersFetched }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contests
        const { data: contestsData, error: contestsError } = await supabase
          .from('contests')
          .select('contest_name')
          .order('created_at', { ascending: false });

        if (contestsError) throw new Error(`Contests Error: ${contestsError.message}`);

        const contestNames = contestsData.map(contest => contest.contest_name);
        onContestsFetched(contestNames);

        // Fetch filter options
        const { data: filterData, error: filterError } = await supabase
          .from('students')
          .select('college, year, dept, section');

        if (filterError) throw new Error(`Filter Error: ${filterError.message}`);

        const filters = {
          colleges: Array.from(new Set(filterData.map(item => item.college))),
          years: Array.from(new Set(filterData.map(item => item.year))),
          depts: Array.from(new Set(filterData.map(item => item.dept))),
          sections: Array.from(new Set(filterData.map(item => item.section))),
        };

        onFiltersFetched(filters);

        // Fetch data for each contest
        const allDataPromises = contestNames.map(async contest => {
          const { data: contestData, error: contestError } = await supabase
            .from(contest)
            .select('*');

          if (contestError) throw new Error(`Contest ${contest} Error: ${contestError.message}`);

          return { contest, data: contestData || [] };
        });

        const allData = await Promise.all(allDataPromises);
        const contestDataMap = allData.reduce((acc, { contest, data }) => {
          acc[contest] = data;
          return acc;
        }, {} as { [key: string]: any[] });

        onDataFetched({ filterData, contestDataMap });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [onDataFetched, onContestsFetched, onFiltersFetched]);

  return null;
};

export default DataFetcher;