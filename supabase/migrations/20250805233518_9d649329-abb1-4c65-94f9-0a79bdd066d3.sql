-- Create table for user notifications
CREATE TABLE public.user_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- 'info', 'success', 'warning', 'error', 'reminder'
  category TEXT NULL DEFAULT 'general', -- 'health', 'emotional', 'academic', 'general', 'system'
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_important BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT NULL,
  action_label TEXT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NULL,
  expires_at TIMESTAMP WITH TIME ZONE NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for quick actions
CREATE TABLE public.quick_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NULL,
  icon_name TEXT NOT NULL, -- lucide icon name
  color TEXT NOT NULL DEFAULT '#3B82F6',
  action_type TEXT NOT NULL, -- 'navigate', 'modal', 'external', 'function'
  action_data JSONB NOT NULL DEFAULT '{}', -- navigation url, modal data, etc.
  category TEXT NOT NULL DEFAULT 'general', -- 'health', 'emotional', 'academic', 'productivity'
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  usage_count INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_actions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_notifications
CREATE POLICY "Users can view their own notifications" 
ON public.user_notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notifications" 
ON public.user_notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.user_notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" 
ON public.user_notifications 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for quick_actions
CREATE POLICY "Users can view their own quick actions" 
ON public.quick_actions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quick actions" 
ON public.quick_actions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quick actions" 
ON public.quick_actions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quick actions" 
ON public.quick_actions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_notifications_user_id ON public.user_notifications(user_id);
CREATE INDEX idx_user_notifications_is_read ON public.user_notifications(is_read);
CREATE INDEX idx_user_notifications_scheduled_for ON public.user_notifications(scheduled_for);
CREATE INDEX idx_quick_actions_user_id ON public.quick_actions(user_id);
CREATE INDEX idx_quick_actions_category ON public.quick_actions(category);
CREATE INDEX idx_quick_actions_order_index ON public.quick_actions(order_index);

-- Create triggers for updated_at
CREATE TRIGGER update_user_notifications_updated_at
BEFORE UPDATE ON public.user_notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quick_actions_updated_at
BEFORE UPDATE ON public.quick_actions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create default quick actions for new users
CREATE OR REPLACE FUNCTION public.create_default_quick_actions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Create default quick actions for new users
  INSERT INTO public.quick_actions (user_id, title, description, icon_name, color, action_type, action_data, category, order_index)
  VALUES 
    (NEW.user_id, 'Nueva Tarea', 'Agregar una nueva tarea académica', 'Plus', '#3B82F6', 'modal', '{"modal": "new_task", "module": "academic"}', 'academic', 1),
    (NEW.user_id, 'Estado de Ánimo', 'Registrar cómo te sientes hoy', 'Heart', '#EF4444', 'modal', '{"modal": "mood_selector", "module": "emotional"}', 'emotional', 2),
    (NEW.user_id, 'Recordatorio Salud', 'Agregar recordatorio médico', 'Calendar', '#10B981', 'modal', '{"modal": "health_reminder", "module": "health"}', 'health', 3),
    (NEW.user_id, 'Chat IA', 'Hablar con tu asistente personal', 'Brain', '#8B5CF6', 'navigate', '{"url": "/ai"}', 'general', 4),
    (NEW.user_id, 'Metas Diarias', 'Ver progreso de objetivos', 'Target', '#F59E0B', 'modal', '{"modal": "daily_goals", "module": "general"}', 'productivity', 5),
    (NEW.user_id, 'Técnica Pomodoro', 'Iniciar sesión de estudio', 'Clock', '#EC4899', 'modal', '{"modal": "pomodoro", "module": "academic"}', 'productivity', 6);
  
  RETURN NEW;
END;
$function$;

-- Create trigger to create default quick actions when a profile is created
CREATE TRIGGER create_default_quick_actions_trigger
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.create_default_quick_actions();