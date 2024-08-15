
export interface Student {
    username: string;
    no_of_questions: number | null;
    question_ids: string[] | null;
    finish_time: string | null;
    status: string | null;
    dept: string | null;
    year: string | null;
    section: string | null;
    rank: number | null;
  }
  
  export interface Filters {
    no_of_questions: number | null;
    status: string | null;
    dept: string | null;
    section: string | null;
    year: string | null;
  }
  