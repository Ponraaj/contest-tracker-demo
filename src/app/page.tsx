// src/app/page.tsx
import { createClient } from '@/lib/supabase/client';
import StudentsTable from '@/components/StudentTable';

const Page = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('weekly_contest_410')
    .select('username, no_of_questions, question_ids, finish_time, status, dept, year, section, rank');

  if (error) {
    console.error('Error fetching data:', error.message);
    return <div>Error loading students.</div>;
  }

  return (
    <div>
      <StudentsTable students={data || []} />
    </div>
  );
};

export default Page;
