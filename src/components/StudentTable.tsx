// StudentsTable.tsx
import { createClient } from "@/lib/supabase/client";
import Table from "./Table";
import { Student } from "@/lib/types";
// export const revalidate = 30;
async function getContests() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contests")
    .select("contest_name")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching contests:", error.message);
    return [];
  }
  return data.map((item) => item.contest_name);
}
async function getStudents(contestName: string): Promise<Student[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(contestName)
    .select(
      "leetcode_id,username, no_of_questions, question_ids, finish_time, status, dept, year, section, rank, college"
    );
  if (error) {
    console.error("Error fetching students:", error.message);
    return [];
  }
  return data || [];
}
export default async function StudentsTable() {
  const contests = await getContests();
  const initialContest = contests[0];
  const initialStudents = await getStudents(initialContest);
  return (
    <Table
      initialContests={contests}
      initialStudents={initialStudents}
      initialContest={initialContest}
    />
  );
}
