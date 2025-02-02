// StudentsTable.tsx
import { createClient } from "@/lib/supabase/client";
import Table from "./Table";
import { Student } from "@/lib/types";
export const revalidate = 30;
async function getContests() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contests")
    .select("contest_name, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching contests:", error.message);
    return [];
  }
  return data.map((item) => ({
    contest_name: item.contest_name,
    created_at: item.created_at,
  }));
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
  // console.log(contests);
  const initialContest = contests[0].contest_name;
  const initialStudents = await getStudents(initialContest);
  return (
    <Table
      initialContests={contests}
      initialStudents={initialStudents}
      initialContest={initialContest}
    />
  );
}
