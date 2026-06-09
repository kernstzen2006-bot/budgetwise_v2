export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      budgets: {
        Row: {
          budget_amount: number | null
          category: string | null
          created_at: string | null
          id: string
          month: string | null
          user_id: string
        }
        Insert: {
          budget_amount?: number | null
          category?: string | null
          created_at?: string | null
          id?: string
          month?: string | null
          user_id: string
        }
        Update: {
          budget_amount?: number | null
          category?: string | null
          created_at?: string | null
          id?: string
          month?: string | null
          user_id?: string
        }
        Relationships: []
      }
      debts: {
        Row: {
          created_at: string | null
          direction: string | null
          id: string
          interest_rate: number | null
          monthly_payment: number | null
          name: string | null
          payoff_method: string | null
          remaining_amount: number | null
          total_amount: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          direction?: string | null
          id?: string
          interest_rate?: number | null
          monthly_payment?: number | null
          name?: string | null
          payoff_method?: string | null
          remaining_amount?: number | null
          total_amount?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          direction?: string | null
          id?: string
          interest_rate?: number | null
          monthly_payment?: number | null
          name?: string | null
          payoff_method?: string | null
          remaining_amount?: number | null
          total_amount?: number | null
          user_id?: string
        }
        Relationships: []
      }
      monthly_report_cards: {
        Row: {
          category_grades: Json | null
          created_at: string | null
          id: string
          month: number | null
          overall_grade: string | null
          user_id: string
          year: number | null
        }
        Insert: {
          category_grades?: Json | null
          created_at?: string | null
          id?: string
          month?: number | null
          overall_grade?: string | null
          user_id: string
          year?: number | null
        }
        Update: {
          category_grades?: Json | null
          created_at?: string | null
          id?: string
          month?: number | null
          overall_grade?: string | null
          user_id?: string
          year?: number | null
        }
        Relationships: []
      }
      no_spend_days: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          is_no_spend: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          is_no_spend?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          is_no_spend?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          current_level: string | null
          full_name: string | null
          id: string
          impulse_threshold: number | null
          income_type: string | null
          institution: string | null
          monthly_income: number | null
          onboarding_complete: boolean | null
          payday_date: number | null
          savings_personality: string | null
          student_year: string | null
          theme: string | null
          total_xp: number | null
        }
        Insert: {
          created_at?: string | null
          current_level?: string | null
          full_name?: string | null
          id: string
          impulse_threshold?: number | null
          income_type?: string | null
          institution?: string | null
          monthly_income?: number | null
          onboarding_complete?: boolean | null
          payday_date?: number | null
          savings_personality?: string | null
          student_year?: string | null
          theme?: string | null
          total_xp?: number | null
        }
        Update: {
          created_at?: string | null
          current_level?: string | null
          full_name?: string | null
          id?: string
          impulse_threshold?: number | null
          income_type?: string | null
          institution?: string | null
          monthly_income?: number | null
          onboarding_complete?: boolean | null
          payday_date?: number | null
          savings_personality?: string | null
          student_year?: string | null
          theme?: string | null
          total_xp?: number | null
        }
        Relationships: []
      }
      savings_contributions: {
        Row: {
          amount: number | null
          created_at: string | null
          date: string | null
          goal_id: string | null
          id: string
          note: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          date?: string | null
          goal_id?: string | null
          id?: string
          note?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          date?: string | null
          goal_id?: string | null
          id?: string
          note?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "savings_contributions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "savings_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      savings_goals: {
        Row: {
          contribution_strategy: string | null
          cover_image_url: string | null
          created_at: string | null
          current_amount: number | null
          emoji: string | null
          id: string
          is_locked: boolean | null
          lock_until: string | null
          name: string | null
          target_amount: number | null
          target_date: string | null
          user_id: string
        }
        Insert: {
          contribution_strategy?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          current_amount?: number | null
          emoji?: string | null
          id?: string
          is_locked?: boolean | null
          lock_until?: string | null
          name?: string | null
          target_amount?: number | null
          target_date?: string | null
          user_id: string
        }
        Update: {
          contribution_strategy?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          current_amount?: number | null
          emoji?: string | null
          id?: string
          is_locked?: boolean | null
          lock_until?: string | null
          name?: string | null
          target_amount?: number | null
          target_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number | null
          billing_cycle: string | null
          category: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_used_at: string | null
          name: string | null
          next_due_date: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          billing_cycle?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          name?: string | null
          next_due_date?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          billing_cycle?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          name?: string | null
          next_due_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          date: string | null
          id: string
          note: string | null
          receipt_url: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          note?: string | null
          receipt_url?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          note?: string | null
          receipt_url?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_gamification: {
        Row: {
          current_level: string | null
          id: string
          total_xp: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          current_level?: string | null
          id?: string
          total_xp?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          current_level?: string | null
          id?: string
          total_xp?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      weekly_challenges: {
        Row: {
          challenge_type: string | null
          completed: boolean | null
          created_at: string | null
          current_value: number | null
          id: string
          target_value: number | null
          user_id: string
          week_start_date: string | null
          xp_reward: number | null
        }
        Insert: {
          challenge_type?: string | null
          completed?: boolean | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          target_value?: number | null
          user_id: string
          week_start_date?: string | null
          xp_reward?: number | null
        }
        Update: {
          challenge_type?: string | null
          completed?: boolean | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          target_value?: number | null
          user_id?: string
          week_start_date?: string | null
          xp_reward?: number | null
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          added_at: string | null
          expires_at: string | null
          id: string
          name: string | null
          price: number | null
          purchased: boolean | null
          user_id: string
        }
        Insert: {
          added_at?: string | null
          expires_at?: string | null
          id?: string
          name?: string | null
          price?: number | null
          purchased?: boolean | null
          user_id: string
        }
        Update: {
          added_at?: string | null
          expires_at?: string | null
          id?: string
          name?: string | null
          price?: number | null
          purchased?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      xp_history: {
        Row: {
          action: string | null
          amount: number
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          action?: string | null
          amount: number
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          action?: string | null
          amount?: number
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_xp: {
        Args: { p_action: string; p_amount: number }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
