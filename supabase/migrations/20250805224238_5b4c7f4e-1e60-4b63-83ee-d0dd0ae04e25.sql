-- Tabla para almacenar todas las conversaciones con la IA
CREATE TABLE public.ai_conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  session_id uuid DEFAULT gen_random_uuid(),
  message_role text NOT NULL CHECK (message_role IN ('user', 'assistant')),
  content text NOT NULL,
  message_order integer NOT NULL,
  context_data jsonb DEFAULT '{}',
  response_time_ms integer,
  model_used text DEFAULT 'claude-3-sonnet',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Tabla para datos de aprendizaje y patrones de usuario
CREATE TABLE public.ai_learning_data (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  data_type text NOT NULL CHECK (data_type IN ('preference', 'pattern', 'behavior', 'goal', 'context')),
  category text NOT NULL, -- emotional, academic, health, general
  key_name text NOT NULL,
  value_data jsonb NOT NULL,
  confidence_score numeric(3,2) DEFAULT 0.5 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  frequency_count integer DEFAULT 1,
  last_observed_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Tabla para feedback del usuario sobre respuestas de la IA
CREATE TABLE public.ai_feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  conversation_id uuid REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  feedback_type text NOT NULL CHECK (feedback_type IN ('like', 'dislike', 'helpful', 'not_helpful', 'accurate', 'inaccurate')),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  feedback_text text,
  improvement_suggestions jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Tabla para análisis de comportamiento y uso
CREATE TABLE public.user_behavior_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  event_type text NOT NULL, -- session_start, module_access, goal_created, etc.
  module_name text, -- ai, health, emotional, academic
  event_data jsonb NOT NULL DEFAULT '{}',
  duration_minutes integer,
  device_info jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  date date NOT NULL DEFAULT CURRENT_DATE
);

-- Tabla para almacenar conocimiento personalizado de cada usuario
CREATE TABLE public.ai_user_knowledge (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  knowledge_type text NOT NULL CHECK (knowledge_type IN ('personal_info', 'goals', 'preferences', 'history', 'relationships')),
  knowledge_key text NOT NULL,
  knowledge_value jsonb NOT NULL,
  source_type text DEFAULT 'conversation', -- conversation, direct_input, inferred
  confidence_level numeric(3,2) DEFAULT 0.7 CHECK (confidence_level >= 0 AND confidence_level <= 1),
  last_updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  is_verified boolean DEFAULT false,
  UNIQUE(user_id, knowledge_type, knowledge_key)
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_learning_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_behavior_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_user_knowledge ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para ai_conversations
CREATE POLICY "Users can view their own conversations"
  ON public.ai_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
  ON public.ai_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON public.ai_conversations FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas RLS para ai_learning_data
CREATE POLICY "Users can view their own learning data"
  ON public.ai_learning_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own learning data"
  ON public.ai_learning_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning data"
  ON public.ai_learning_data FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas RLS para ai_feedback
CREATE POLICY "Users can view their own feedback"
  ON public.ai_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own feedback"
  ON public.ai_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback"
  ON public.ai_feedback FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas RLS para user_behavior_analytics
CREATE POLICY "Users can view their own behavior analytics"
  ON public.user_behavior_analytics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own behavior analytics"
  ON public.user_behavior_analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para ai_user_knowledge
CREATE POLICY "Users can view their own knowledge"
  ON public.ai_user_knowledge FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own knowledge"
  ON public.ai_user_knowledge FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own knowledge"
  ON public.ai_user_knowledge FOR UPDATE
  USING (auth.uid() = user_id);

-- Índices para optimizar consultas
CREATE INDEX idx_ai_conversations_user_session ON public.ai_conversations(user_id, session_id);
CREATE INDEX idx_ai_conversations_created_at ON public.ai_conversations(created_at);
CREATE INDEX idx_ai_learning_data_user_category ON public.ai_learning_data(user_id, category);
CREATE INDEX idx_ai_learning_data_type_key ON public.ai_learning_data(data_type, key_name);
CREATE INDEX idx_ai_feedback_conversation ON public.ai_feedback(conversation_id);
CREATE INDEX idx_user_behavior_date ON public.user_behavior_analytics(user_id, date);
CREATE INDEX idx_ai_knowledge_user_type ON public.ai_user_knowledge(user_id, knowledge_type);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_conversations_updated_at
  BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_learning_data_updated_at
  BEFORE UPDATE ON public.ai_learning_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para extraer insights de conversaciones
CREATE OR REPLACE FUNCTION public.extract_conversation_insights()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Esta función puede ser expandida para análisis automático de conversaciones
  -- Por ahora solo actualiza contadores
  UPDATE public.ai_learning_data 
  SET frequency_count = frequency_count + 1,
      last_observed_at = now()
  WHERE data_type = 'pattern' AND is_active = true;
END;
$$;