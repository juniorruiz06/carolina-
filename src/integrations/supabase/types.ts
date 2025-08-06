export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      academic_entries: {
        Row: {
          achievements: string[] | null
          completion_percentage: number | null
          created_at: string
          date: string
          difficulty_rating: number | null
          goals: string[] | null
          id: string
          notes: string | null
          study_time_minutes: number
          subject: string
          topic: string
          understanding_level: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements?: string[] | null
          completion_percentage?: number | null
          created_at?: string
          date?: string
          difficulty_rating?: number | null
          goals?: string[] | null
          id?: string
          notes?: string | null
          study_time_minutes?: number
          subject: string
          topic: string
          understanding_level?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements?: string[] | null
          completion_percentage?: number | null
          created_at?: string
          date?: string
          difficulty_rating?: number | null
          goals?: string[] | null
          id?: string
          notes?: string | null
          study_time_minutes?: number
          subject?: string
          topic?: string
          understanding_level?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_behavior_analysis: {
        Row: {
          agent_id: string
          analysis_data: Json
          analysis_type: string
          confidence_score: number
          created_at: string
          id: string
          insights: Json
          recommendations: Json
          updated_at: string
        }
        Insert: {
          agent_id: string
          analysis_data?: Json
          analysis_type: string
          confidence_score?: number
          created_at?: string
          id?: string
          insights?: Json
          recommendations?: Json
          updated_at?: string
        }
        Update: {
          agent_id?: string
          analysis_data?: Json
          analysis_type?: string
          confidence_score?: number
          created_at?: string
          id?: string
          insights?: Json
          recommendations?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_behavior_analysis_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_notifications: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          is_read: boolean
          is_sent: boolean
          message: string
          metadata: Json
          notification_type: string
          scheduled_for: string
          sent_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          is_sent?: boolean
          message: string
          metadata?: Json
          notification_type: string
          scheduled_for: string
          sent_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          is_sent?: boolean
          message?: string
          metadata?: Json
          notification_type?: string
          scheduled_for?: string
          sent_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_notifications_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_tasks: {
        Row: {
          agent_id: string
          completed_at: string | null
          created_at: string
          id: string
          scheduled_for: string
          status: string
          task_data: Json
          task_type: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          scheduled_for: string
          status?: string
          task_data?: Json
          task_type: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          scheduled_for?: string
          status?: string
          task_data?: Json
          task_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_tasks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agents: {
        Row: {
          behavior_type: string
          created_at: string
          id: string
          is_active: boolean
          module_type: string
          name: string
          settings: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          behavior_type: string
          created_at?: string
          id?: string
          is_active?: boolean
          module_type: string
          name: string
          settings?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          behavior_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          module_type?: string
          name?: string
          settings?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_conversations: {
        Row: {
          content: string
          context_data: Json | null
          created_at: string
          id: string
          message_order: number
          message_role: string
          model_used: string | null
          response_time_ms: number | null
          session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          context_data?: Json | null
          created_at?: string
          id?: string
          message_order: number
          message_role: string
          model_used?: string | null
          response_time_ms?: number | null
          session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          context_data?: Json | null
          created_at?: string
          id?: string
          message_order?: number
          message_role?: string
          model_used?: string | null
          response_time_ms?: number | null
          session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_feedback: {
        Row: {
          conversation_id: string | null
          created_at: string
          feedback_text: string | null
          feedback_type: string
          id: string
          improvement_suggestions: Json | null
          rating: number | null
          user_id: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          feedback_text?: string | null
          feedback_type: string
          id?: string
          improvement_suggestions?: Json | null
          rating?: number | null
          user_id: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          feedback_text?: string | null
          feedback_type?: string
          id?: string
          improvement_suggestions?: Json | null
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_feedback_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_insights: {
        Row: {
          content: string
          created_at: string
          id: string
          insight_type: string
          is_archived: boolean | null
          is_read: boolean | null
          priority: number | null
          related_data: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          insight_type: string
          is_archived?: boolean | null
          is_read?: boolean | null
          priority?: number | null
          related_data?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          insight_type?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          priority?: number | null
          related_data?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_learning_data: {
        Row: {
          category: string
          confidence_score: number | null
          created_at: string
          data_type: string
          frequency_count: number | null
          id: string
          is_active: boolean | null
          key_name: string
          last_observed_at: string | null
          updated_at: string
          user_id: string
          value_data: Json
        }
        Insert: {
          category: string
          confidence_score?: number | null
          created_at?: string
          data_type: string
          frequency_count?: number | null
          id?: string
          is_active?: boolean | null
          key_name: string
          last_observed_at?: string | null
          updated_at?: string
          user_id: string
          value_data: Json
        }
        Update: {
          category?: string
          confidence_score?: number | null
          created_at?: string
          data_type?: string
          frequency_count?: number | null
          id?: string
          is_active?: boolean | null
          key_name?: string
          last_observed_at?: string | null
          updated_at?: string
          user_id?: string
          value_data?: Json
        }
        Relationships: []
      }
      ai_user_knowledge: {
        Row: {
          confidence_level: number | null
          created_at: string
          id: string
          is_verified: boolean | null
          knowledge_key: string
          knowledge_type: string
          knowledge_value: Json
          last_updated_at: string | null
          source_type: string | null
          user_id: string
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          knowledge_key: string
          knowledge_type: string
          knowledge_value: Json
          last_updated_at?: string | null
          source_type?: string | null
          user_id: string
        }
        Update: {
          confidence_level?: number | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          knowledge_key?: string
          knowledge_type?: string
          knowledge_value?: Json
          last_updated_at?: string | null
          source_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      emotional_entries: {
        Row: {
          coping_strategies: string[] | null
          created_at: string
          date: string
          emotion_intensity: number | null
          gratitude_items: string[] | null
          id: string
          meditation_minutes: number | null
          primary_emotion: string
          reflection_notes: string | null
          social_connections: number | null
          triggers: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          coping_strategies?: string[] | null
          created_at?: string
          date?: string
          emotion_intensity?: number | null
          gratitude_items?: string[] | null
          id?: string
          meditation_minutes?: number | null
          primary_emotion: string
          reflection_notes?: string | null
          social_connections?: number | null
          triggers?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          coping_strategies?: string[] | null
          created_at?: string
          date?: string
          emotion_intensity?: number | null
          gratitude_items?: string[] | null
          id?: string
          meditation_minutes?: number | null
          primary_emotion?: string
          reflection_notes?: string | null
          social_connections?: number | null
          triggers?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_entries: {
        Row: {
          created_at: string
          date: string
          energy_level: number | null
          exercise_minutes: number | null
          id: string
          mood_score: number | null
          notes: string | null
          sleep_hours: number | null
          stress_level: number | null
          updated_at: string
          user_id: string
          water_glasses: number | null
          weight: number | null
        }
        Insert: {
          created_at?: string
          date?: string
          energy_level?: number | null
          exercise_minutes?: number | null
          id?: string
          mood_score?: number | null
          notes?: string | null
          sleep_hours?: number | null
          stress_level?: number | null
          updated_at?: string
          user_id: string
          water_glasses?: number | null
          weight?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          energy_level?: number | null
          exercise_minutes?: number | null
          id?: string
          mood_score?: number | null
          notes?: string | null
          sleep_hours?: number | null
          stress_level?: number | null
          updated_at?: string
          user_id?: string
          water_glasses?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quick_actions: {
        Row: {
          action_data: Json
          action_type: string
          category: string
          color: string
          created_at: string
          description: string | null
          icon_name: string
          id: string
          is_active: boolean
          last_used_at: string | null
          order_index: number
          title: string
          updated_at: string
          usage_count: number
          user_id: string
        }
        Insert: {
          action_data?: Json
          action_type: string
          category?: string
          color?: string
          created_at?: string
          description?: string | null
          icon_name: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          order_index?: number
          title: string
          updated_at?: string
          usage_count?: number
          user_id: string
        }
        Update: {
          action_data?: Json
          action_type?: string
          category?: string
          color?: string
          created_at?: string
          description?: string | null
          icon_name?: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          order_index?: number
          title?: string
          updated_at?: string
          usage_count?: number
          user_id?: string
        }
        Relationships: []
      }
      task_compliance: {
        Row: {
          actual_completion: string | null
          compliance_score: number
          created_at: string
          expected_completion: string
          id: string
          metadata: Json
          task_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_completion?: string | null
          compliance_score?: number
          created_at?: string
          expected_completion: string
          id?: string
          metadata?: Json
          task_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_completion?: string | null
          compliance_score?: number
          created_at?: string
          expected_completion?: string
          id?: string
          metadata?: Json
          task_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_behavior_analytics: {
        Row: {
          created_at: string
          date: string
          device_info: Json | null
          duration_minutes: number | null
          event_data: Json
          event_type: string
          id: string
          module_name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          device_info?: Json | null
          duration_minutes?: number | null
          event_data?: Json
          event_type: string
          id?: string
          module_name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          device_info?: Json | null
          duration_minutes?: number | null
          event_data?: Json
          event_type?: string
          id?: string
          module_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          category: string
          created_at: string
          current_value: number | null
          description: string | null
          id: string
          is_active: boolean | null
          is_completed: boolean | null
          target_date: string | null
          target_value: number | null
          title: string
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          current_value?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_completed?: boolean | null
          target_date?: string | null
          target_value?: number | null
          title: string
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          current_value?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_completed?: boolean | null
          target_date?: string | null
          target_value?: number | null
          title?: string
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          category: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_important: boolean
          is_read: boolean
          message: string
          metadata: Json
          scheduled_for: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          category?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_important?: boolean
          is_read?: boolean
          message: string
          metadata?: Json
          scheduled_for?: string | null
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          category?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_important?: boolean
          is_read?: boolean
          message?: string
          metadata?: Json
          scheduled_for?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          accessibility_features: Json | null
          created_at: string
          daily_reminder_time: string | null
          data_sharing: boolean | null
          id: string
          notifications_enabled: boolean | null
          preferred_language: string | null
          privacy_level: string | null
          theme_preference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accessibility_features?: Json | null
          created_at?: string
          daily_reminder_time?: string | null
          data_sharing?: boolean | null
          id?: string
          notifications_enabled?: boolean | null
          preferred_language?: string | null
          privacy_level?: string | null
          theme_preference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accessibility_features?: Json | null
          created_at?: string
          daily_reminder_time?: string | null
          data_sharing?: boolean | null
          id?: string
          notifications_enabled?: boolean | null
          preferred_language?: string | null
          privacy_level?: string | null
          theme_preference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extract_conversation_insights: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_agent_user_id: {
        Args: { agent_uuid: string }
        Returns: string
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
