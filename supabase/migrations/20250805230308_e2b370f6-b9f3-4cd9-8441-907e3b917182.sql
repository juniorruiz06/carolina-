-- Crear tabla de agentes de IA
CREATE TABLE public.ai_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  module_type TEXT NOT NULL CHECK (module_type IN ('health', 'emotional', 'academic')),
  behavior_type TEXT NOT NULL CHECK (behavior_type IN ('reminder', 'motivational', 'analytical')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;

-- Crear políticas para ai_agents
CREATE POLICY "Users can view their own AI agents" 
ON public.ai_agents 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI agents" 
ON public.ai_agents 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI agents" 
ON public.ai_agents 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI agents" 
ON public.ai_agents 
FOR DELETE 
USING (auth.uid() = user_id);

-- Crear tabla de tareas de agentes
CREATE TABLE public.agent_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL,
  task_data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;

-- Crear función de seguridad para obtener user_id del agente
CREATE OR REPLACE FUNCTION public.get_agent_user_id(agent_uuid UUID)
RETURNS UUID AS $$
  SELECT user_id FROM public.ai_agents WHERE id = agent_uuid;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Crear políticas para agent_tasks
CREATE POLICY "Users can view tasks from their agents" 
ON public.agent_tasks 
FOR SELECT 
USING (auth.uid() = public.get_agent_user_id(agent_id));

CREATE POLICY "Users can create tasks for their agents" 
ON public.agent_tasks 
FOR INSERT 
WITH CHECK (auth.uid() = public.get_agent_user_id(agent_id));

CREATE POLICY "Users can update tasks from their agents" 
ON public.agent_tasks 
FOR UPDATE 
USING (auth.uid() = public.get_agent_user_id(agent_id));

CREATE POLICY "Users can delete tasks from their agents" 
ON public.agent_tasks 
FOR DELETE 
USING (auth.uid() = public.get_agent_user_id(agent_id));

-- Crear tabla de cumplimiento de tareas
CREATE TABLE public.task_compliance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  task_type TEXT NOT NULL,
  expected_completion TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_completion TIMESTAMP WITH TIME ZONE,
  compliance_score NUMERIC NOT NULL DEFAULT 0.0 CHECK (compliance_score >= 0.0 AND compliance_score <= 1.0),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.task_compliance ENABLE ROW LEVEL SECURITY;

-- Crear políticas para task_compliance
CREATE POLICY "Users can view their own task compliance" 
ON public.task_compliance 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own task compliance" 
ON public.task_compliance 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own task compliance" 
ON public.task_compliance 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own task compliance" 
ON public.task_compliance 
FOR DELETE 
USING (auth.uid() = user_id);

-- Crear tabla de notificaciones de agentes
CREATE TABLE public.agent_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_sent BOOLEAN NOT NULL DEFAULT false,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.agent_notifications ENABLE ROW LEVEL SECURITY;

-- Crear políticas para agent_notifications
CREATE POLICY "Users can view notifications from their agents" 
ON public.agent_notifications 
FOR SELECT 
USING (auth.uid() = public.get_agent_user_id(agent_id));

CREATE POLICY "Users can create notifications for their agents" 
ON public.agent_notifications 
FOR INSERT 
WITH CHECK (auth.uid() = public.get_agent_user_id(agent_id));

CREATE POLICY "Users can update notifications from their agents" 
ON public.agent_notifications 
FOR UPDATE 
USING (auth.uid() = public.get_agent_user_id(agent_id));

CREATE POLICY "Users can delete notifications from their agents" 
ON public.agent_notifications 
FOR DELETE 
USING (auth.uid() = public.get_agent_user_id(agent_id));

-- Crear tabla de análisis de comportamiento de agentes
CREATE TABLE public.agent_behavior_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  analysis_data JSONB NOT NULL DEFAULT '{}',
  insights JSONB NOT NULL DEFAULT '{}',
  recommendations JSONB NOT NULL DEFAULT '{}',
  confidence_score NUMERIC NOT NULL DEFAULT 0.0 CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.agent_behavior_analysis ENABLE ROW LEVEL SECURITY;

-- Crear políticas para agent_behavior_analysis
CREATE POLICY "Users can view analysis from their agents" 
ON public.agent_behavior_analysis 
FOR SELECT 
USING (auth.uid() = public.get_agent_user_id(agent_id));

CREATE POLICY "Users can create analysis for their agents" 
ON public.agent_behavior_analysis 
FOR INSERT 
WITH CHECK (auth.uid() = public.get_agent_user_id(agent_id));

CREATE POLICY "Users can update analysis from their agents" 
ON public.agent_behavior_analysis 
FOR UPDATE 
USING (auth.uid() = public.get_agent_user_id(agent_id));

CREATE POLICY "Users can delete analysis from their agents" 
ON public.agent_behavior_analysis 
FOR DELETE 
USING (auth.uid() = public.get_agent_user_id(agent_id));

-- Crear trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_ai_agents_updated_at
BEFORE UPDATE ON public.ai_agents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_tasks_updated_at
BEFORE UPDATE ON public.agent_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_task_compliance_updated_at
BEFORE UPDATE ON public.task_compliance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_notifications_updated_at
BEFORE UPDATE ON public.agent_notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_behavior_analysis_updated_at
BEFORE UPDATE ON public.agent_behavior_analysis
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar agentes por defecto para cada usuario (se ejecutará con un trigger)
CREATE OR REPLACE FUNCTION public.create_default_ai_agents()
RETURNS TRIGGER AS $$
BEGIN
  -- Crear agente de salud
  INSERT INTO public.ai_agents (user_id, name, module_type, behavior_type, settings)
  VALUES (
    NEW.user_id,
    'Asistente de Salud',
    'health',
    'reminder',
    jsonb_build_object(
      'notification_frequency', 'daily',
      'priority_level', 7,
      'notification_time', '09:00',
      'tracking_metrics', array['exercise', 'water', 'sleep']
    )
  );

  -- Crear agente emocional
  INSERT INTO public.ai_agents (user_id, name, module_type, behavior_type, settings)
  VALUES (
    NEW.user_id,
    'Compañero Emocional',
    'emotional',
    'motivational',
    jsonb_build_object(
      'notification_frequency', 'daily',
      'priority_level', 8,
      'notification_time', '20:00',
      'support_style', 'empathetic'
    )
  );

  -- Crear agente académico
  INSERT INTO public.ai_agents (user_id, name, module_type, behavior_type, settings)
  VALUES (
    NEW.user_id,
    'Tutor Personal',
    'academic',
    'analytical',
    jsonb_build_object(
      'notification_frequency', 'weekly',
      'priority_level', 6,
      'notification_time', '18:00',
      'learning_style', 'structured'
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger para crear agentes automáticamente cuando se crea un perfil
CREATE TRIGGER create_user_ai_agents
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.create_default_ai_agents();

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_ai_agents_user_id ON public.ai_agents(user_id);
CREATE INDEX idx_ai_agents_module_type ON public.ai_agents(module_type);
CREATE INDEX idx_agent_tasks_agent_id ON public.agent_tasks(agent_id);
CREATE INDEX idx_agent_tasks_status ON public.agent_tasks(status);
CREATE INDEX idx_agent_tasks_scheduled_for ON public.agent_tasks(scheduled_for);
CREATE INDEX idx_task_compliance_user_id ON public.task_compliance(user_id);
CREATE INDEX idx_task_compliance_task_type ON public.task_compliance(task_type);
CREATE INDEX idx_agent_notifications_agent_id ON public.agent_notifications(agent_id);
CREATE INDEX idx_agent_notifications_scheduled_for ON public.agent_notifications(scheduled_for);