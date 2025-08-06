-- Create wellness modules tables for the Contigo app

-- Health module table for tracking daily health metrics
CREATE TABLE public.health_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  weight numeric(5,2),
  sleep_hours numeric(3,1),
  water_glasses integer DEFAULT 0,
  exercise_minutes integer DEFAULT 0,
  mood_score integer CHECK (mood_score >= 1 AND mood_score <= 10),
  energy_level integer CHECK (energy_level >= 1 AND energy_level <= 10),
  stress_level integer CHECK (stress_level >= 1 AND stress_level <= 10),
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Emotional wellbeing table for mood tracking and emotional insights
CREATE TABLE public.emotional_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  primary_emotion text NOT NULL,
  emotion_intensity integer CHECK (emotion_intensity >= 1 AND emotion_intensity <= 10),
  triggers text[],
  coping_strategies text[],
  gratitude_items text[],
  reflection_notes text,
  meditation_minutes integer DEFAULT 0,
  social_connections integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Academic progress table for learning goals and achievements
CREATE TABLE public.academic_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  topic text NOT NULL,
  study_time_minutes integer NOT NULL DEFAULT 0,
  completion_percentage integer CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  difficulty_rating integer CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  understanding_level integer CHECK (understanding_level >= 1 AND understanding_level <= 5),
  notes text,
  goals text[],
  achievements text[],
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- AI insights and recommendations table
CREATE TABLE public.ai_insights (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type text NOT NULL, -- 'health', 'emotional', 'academic', 'general'
  title text NOT NULL,
  content text NOT NULL,
  priority integer CHECK (priority >= 1 AND priority <= 3) DEFAULT 2,
  is_read boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  related_data jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User goals and milestones
CREATE TABLE public.user_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL, -- 'health', 'emotional', 'academic'
  title text NOT NULL,
  description text,
  target_value numeric,
  current_value numeric DEFAULT 0,
  unit text,
  target_date date,
  is_completed boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User settings and preferences
CREATE TABLE public.user_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  notifications_enabled boolean DEFAULT true,
  daily_reminder_time time DEFAULT '09:00:00',
  preferred_language text DEFAULT 'es',
  theme_preference text DEFAULT 'auto', -- 'light', 'dark', 'auto'
  privacy_level text DEFAULT 'private', -- 'private', 'friends', 'public'
  data_sharing boolean DEFAULT false,
  accessibility_features jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.health_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotional_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for health_entries
CREATE POLICY "Users can view their own health entries" 
ON public.health_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health entries" 
ON public.health_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health entries" 
ON public.health_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health entries" 
ON public.health_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for emotional_entries
CREATE POLICY "Users can view their own emotional entries" 
ON public.emotional_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own emotional entries" 
ON public.emotional_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emotional entries" 
ON public.emotional_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emotional entries" 
ON public.emotional_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for academic_entries
CREATE POLICY "Users can view their own academic entries" 
ON public.academic_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own academic entries" 
ON public.academic_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own academic entries" 
ON public.academic_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own academic entries" 
ON public.academic_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for ai_insights
CREATE POLICY "Users can view their own AI insights" 
ON public.ai_insights 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI insights" 
ON public.ai_insights 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI insights" 
ON public.ai_insights 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI insights" 
ON public.ai_insights 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for user_goals
CREATE POLICY "Users can view their own goals" 
ON public.user_goals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals" 
ON public.user_goals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" 
ON public.user_goals 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" 
ON public.user_goals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for user_settings
CREATE POLICY "Users can view their own settings" 
ON public.user_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings" 
ON public.user_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
ON public.user_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_health_entries_updated_at
BEFORE UPDATE ON public.health_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_emotional_entries_updated_at
BEFORE UPDATE ON public.emotional_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academic_entries_updated_at
BEFORE UPDATE ON public.academic_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_insights_updated_at
BEFORE UPDATE ON public.ai_insights
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at
BEFORE UPDATE ON public.user_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_health_entries_user_date ON public.health_entries(user_id, date DESC);
CREATE INDEX idx_emotional_entries_user_date ON public.emotional_entries(user_id, date DESC);
CREATE INDEX idx_academic_entries_user_date ON public.academic_entries(user_id, date DESC);
CREATE INDEX idx_ai_insights_user_type ON public.ai_insights(user_id, insight_type);
CREATE INDEX idx_user_goals_user_category ON public.user_goals(user_id, category, is_active);

-- Function to automatically create user settings when a user profile is created
CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger to create default settings when a profile is created
CREATE TRIGGER on_profile_created_create_settings
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_settings();