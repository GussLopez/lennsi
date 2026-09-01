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
      actions: {
        Row: {
          branch_id: number | null
          created_at: string
          id: number
          is_enabled: boolean
          label: string
          restaurant_id: number
          sort_order: number
          type: string
          updated_at: string
          url: string | null
        }
        Insert: {
          branch_id?: number | null
          created_at?: string
          id?: never
          is_enabled?: boolean
          label: string
          restaurant_id: number
          sort_order?: number
          type: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          branch_id?: number | null
          created_at?: string
          id?: never
          is_enabled?: boolean
          label?: string
          restaurant_id?: number
          sort_order?: number
          type?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "actions_branch_restaurant_fkey"
            columns: ["branch_id", "restaurant_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id", "restaurant_id"]
          },
          {
            foreignKeyName: "actions_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address: string | null
          created_at: string
          google_review_url: string | null
          id: number
          is_active: boolean
          menu_url: string | null
          name: string
          phone: string | null
          restaurant_id: number
          template_id: string
          timezone: string
          updated_at: string
          whatsapp: string | null
          wifi_password: string | null
          wifi_ssid: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          google_review_url?: string | null
          id?: never
          is_active?: boolean
          menu_url?: string | null
          name: string
          phone?: string | null
          restaurant_id: number
          template_id?: string
          timezone?: string
          updated_at?: string
          whatsapp?: string | null
          wifi_password?: string | null
          wifi_ssid?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          google_review_url?: string | null
          id?: never
          is_active?: boolean
          menu_url?: string | null
          name?: string
          phone?: string | null
          restaurant_id?: number
          template_id?: string
          timezone?: string
          updated_at?: string
          whatsapp?: string | null
          wifi_password?: string | null
          wifi_ssid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branches_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          action_id: number | null
          branch_id: number | null
          created_at: string
          device_type: string | null
          event_name: string
          id: number
          metadata: Json
          referrer: string | null
          restaurant_id: number
          session_id: string | null
          tag_id: number | null
          touchpoint_id: number | null
          user_agent: string | null
        }
        Insert: {
          action_id?: number | null
          branch_id?: number | null
          created_at?: string
          device_type?: string | null
          event_name: string
          id?: never
          metadata?: Json
          referrer?: string | null
          restaurant_id: number
          session_id?: string | null
          tag_id?: number | null
          touchpoint_id?: number | null
          user_agent?: string | null
        }
        Update: {
          action_id?: number | null
          branch_id?: number | null
          created_at?: string
          device_type?: string | null
          event_name?: string
          id?: never
          metadata?: Json
          referrer?: string | null
          restaurant_id?: number
          session_id?: string | null
          tag_id?: number | null
          touchpoint_id?: number | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_touchpoint_id_fkey"
            columns: ["touchpoint_id"]
            isOneToOne: false
            referencedRelation: "touchpoints"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      restaurant_members: {
        Row: {
          created_at: string
          id: number
          restaurant_id: number
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          restaurant_id: number
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: never
          restaurant_id?: number
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_members_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
          use_case: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
          use_case: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
          use_case?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: number
          is_active: boolean
          label: string | null
          token: string
          touchpoint_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: never
          is_active?: boolean
          label?: string | null
          token: string
          touchpoint_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: never
          is_active?: boolean
          label?: string | null
          token?: string
          touchpoint_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_touchpoint_id_fkey"
            columns: ["touchpoint_id"]
            isOneToOne: false
            referencedRelation: "touchpoints"
            referencedColumns: ["id"]
          },
        ]
      }
      touchpoints: {
        Row: {
          branch_id: number
          created_at: string
          id: number
          is_active: boolean
          name: string
          number: number | null
          type: string
          updated_at: string
        }
        Insert: {
          branch_id: number
          created_at?: string
          id?: never
          is_active?: boolean
          name: string
          number?: number | null
          type?: string
          updated_at?: string
        }
        Update: {
          branch_id?: number
          created_at?: string
          id?: never
          is_active?: boolean
          name?: string
          number?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "touchpoints_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_restaurant_onboarding: {
        Args: { p_name: string; p_use_case: string; p_use_case_value: string }
        Returns: number
      }
      get_public_tag_page: { Args: { p_token: string }; Returns: Json }
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