export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      messages: {
        Row: {
          ai_message: Json | null
          created_at: string
          id: number
          user_mail: string
          user_message: Json | null
        }
        Insert: {
          ai_message?: Json | null
          created_at?: string
          id?: number
          user_mail?: string
          user_message?: Json | null
        }
        Update: {
          ai_message?: Json | null
          created_at?: string
          id?: number
          user_mail?: string
          user_message?: Json | null
        }
        Relationships: []
      }
      students: {
        Row: {
          created_at: string
          dept: string | null
          id: number
          leetcode_id: string | null
          section: string | null
          student_name: string | null
          year: number | null
        }
        Insert: {
          created_at?: string
          dept?: string | null
          id?: number
          leetcode_id?: string | null
          section?: string | null
          student_name?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string
          dept?: string | null
          id?: number
          leetcode_id?: string | null
          section?: string | null
          student_name?: string | null
          year?: number | null
        }
        Relationships: []
      }
      user_data: {
        Row: {
          created_at: string
          finish_time: string | null
          id: number
          no_of_questions: number | null
          question_ids: string[] | null
          rank: number | null
          username: string | null
        }
        Insert: {
          created_at?: string
          finish_time?: string | null
          id?: number
          no_of_questions?: number | null
          question_ids?: string[] | null
          rank?: number | null
          username?: string | null
        }
        Update: {
          created_at?: string
          finish_time?: string | null
          id?: number
          no_of_questions?: number | null
          question_ids?: string[] | null
          rank?: number | null
          username?: string | null
        }
        Relationships: []
      }
      weekly_contest_409: {
        Row: {
          created_at: string
          dept: string | null
          finish_time: string | null
          id: number
          leetcode_id: string | null
          no_of_questions: number | null
          question_ids: string[] | null
          rank: number | null
          section: string | null
          status: string | null
          username: string
          year: string | null
        }
        Insert: {
          created_at?: string
          dept?: string | null
          finish_time?: string | null
          id?: number
          leetcode_id?: string | null
          no_of_questions?: number | null
          question_ids?: string[] | null
          rank?: number | null
          section?: string | null
          status?: string | null
          username?: string
          year?: string | null
        }
        Update: {
          created_at?: string
          dept?: string | null
          finish_time?: string | null
          id?: number
          leetcode_id?: string | null
          no_of_questions?: number | null
          question_ids?: string[] | null
          rank?: number | null
          section?: string | null
          status?: string | null
          username?: string
          year?: string | null
        }
        Relationships: []
      }
      weekly_contest_410: {
        Row: {
          created_at: string
          dept: string | null
          finish_time: string | null
          id: number
          leetcode_id: string | null
          no_of_questions: number | null
          question_ids: string[] | null
          rank: number | null
          section: string | null
          status: string | null
          username: string
          year: string | null
        }
        Insert: {
          created_at?: string
          dept?: string | null
          finish_time?: string | null
          id?: number
          leetcode_id?: string | null
          no_of_questions?: number | null
          question_ids?: string[] | null
          rank?: number | null
          section?: string | null
          status?: string | null
          username?: string
          year?: string | null
        }
        Update: {
          created_at?: string
          dept?: string | null
          finish_time?: string | null
          id?: number
          leetcode_id?: string | null
          no_of_questions?: number | null
          question_ids?: string[] | null
          rank?: number | null
          section?: string | null
          status?: string | null
          username?: string
          year?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
