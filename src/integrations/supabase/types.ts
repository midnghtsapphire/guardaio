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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      affiliate_referrals: {
        Row: {
          affiliate_id: string
          commission_amount: number
          created_at: string
          id: string
          payment_id: string | null
          referred_user_id: string | null
          status: string
        }
        Insert: {
          affiliate_id: string
          commission_amount?: number
          created_at?: string
          id?: string
          payment_id?: string | null
          referred_user_id?: string | null
          status?: string
        }
        Update: {
          affiliate_id?: string
          commission_amount?: number
          created_at?: string
          id?: string
          payment_id?: string | null
          referred_user_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          affiliate_code: string
          commission_rate: number
          created_at: string
          email: string
          id: string
          name: string
          pending_payout: number
          status: string
          total_earnings: number
          updated_at: string
          user_id: string
        }
        Insert: {
          affiliate_code: string
          commission_rate?: number
          created_at?: string
          email: string
          id?: string
          name: string
          pending_payout?: number
          status?: string
          total_earnings?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          affiliate_code?: string
          commission_rate?: number
          created_at?: string
          email?: string
          id?: string
          name?: string
          pending_payout?: number
          status?: string
          total_earnings?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      analysis_history: {
        Row: {
          confidence: number
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          findings: string[]
          id: string
          share_token: string | null
          status: string
          user_id: string
        }
        Insert: {
          confidence: number
          created_at?: string
          file_name: string
          file_size: number
          file_type: string
          findings?: string[]
          id?: string
          share_token?: string | null
          status: string
          user_id: string
        }
        Update: {
          confidence?: number
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          findings?: string[]
          id?: string
          share_token?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      batch_analyses: {
        Row: {
          completed_at: string | null
          completed_files: number
          created_at: string
          id: string
          name: string
          results: Json | null
          status: string
          total_files: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_files?: number
          created_at?: string
          id?: string
          name: string
          results?: Json | null
          status?: string
          total_files?: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_files?: number
          created_at?: string
          id?: string
          name?: string
          results?: Json | null
          status?: string
          total_files?: number
          user_id?: string
        }
        Relationships: []
      }
      compliance_tests: {
        Row: {
          category: string
          details: Json | null
          id: string
          passed: boolean | null
          run_at: string
          run_by: string | null
          status: string
          test_name: string
        }
        Insert: {
          category: string
          details?: Json | null
          id?: string
          passed?: boolean | null
          run_at?: string
          run_by?: string | null
          status?: string
          test_name: string
        }
        Update: {
          category?: string
          details?: Json | null
          id?: string
          passed?: boolean | null
          run_at?: string
          run_by?: string | null
          status?: string
          test_name?: string
        }
        Relationships: []
      }
      error_reports: {
        Row: {
          component_name: string | null
          created_at: string
          error_message: string
          error_stack: string | null
          error_type: string
          id: string
          metadata: Json | null
          url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          component_name?: string | null
          created_at?: string
          error_message: string
          error_stack?: string | null
          error_type?: string
          id?: string
          metadata?: Json | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          component_name?: string | null
          created_at?: string
          error_message?: string
          error_stack?: string | null
          error_type?: string
          id?: string
          metadata?: Json | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      known_software_signatures: {
        Row: {
          category: string
          description: string | null
          first_seen: string
          id: string
          is_verified: boolean | null
          occurrence_count: number
          risk_level: string | null
          signature_pattern: string
          software_name: string
        }
        Insert: {
          category: string
          description?: string | null
          first_seen?: string
          id?: string
          is_verified?: boolean | null
          occurrence_count?: number
          risk_level?: string | null
          signature_pattern: string
          software_name: string
        }
        Update: {
          category?: string
          description?: string | null
          first_seen?: string
          id?: string
          is_verified?: boolean | null
          occurrence_count?: number
          risk_level?: string | null
          signature_pattern?: string
          software_name?: string
        }
        Relationships: []
      }
      metadata_anomalies: {
        Row: {
          anomaly_type: string
          detection_context: string | null
          example_file_names: string[] | null
          first_seen: string
          id: string
          is_suspicious: boolean | null
          last_seen: string
          notes: string | null
          occurrence_count: number
          pattern_data: Json
          pattern_signature: string
          rarity_score: number | null
        }
        Insert: {
          anomaly_type: string
          detection_context?: string | null
          example_file_names?: string[] | null
          first_seen?: string
          id?: string
          is_suspicious?: boolean | null
          last_seen?: string
          notes?: string | null
          occurrence_count?: number
          pattern_data?: Json
          pattern_signature: string
          rarity_score?: number | null
        }
        Update: {
          anomaly_type?: string
          detection_context?: string | null
          example_file_names?: string[] | null
          first_seen?: string
          id?: string
          is_suspicious?: boolean | null
          last_seen?: string
          notes?: string | null
          occurrence_count?: number
          pattern_data?: Json
          pattern_signature?: string
          rarity_score?: number | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          affiliate_code: string | null
          amount: number
          created_at: string
          currency: string
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_payment_id: string | null
          tier: string
          user_id: string
        }
        Insert: {
          affiliate_code?: string | null
          amount: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_id?: string | null
          tier: string
          user_id: string
        }
        Update: {
          affiliate_code?: string | null
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_id?: string | null
          tier?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_rarity_score: {
        Args: { occurrence: number; total_count: number }
        Returns: number
      }
      generate_affiliate_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
