-- Insert some example notifications for existing users (this will only affect existing users who already have profiles)
INSERT INTO public.user_notifications (user_id, title, message, type, category, is_important)
SELECT 
  p.user_id,
  'Bienvenido a Contigo',
  'Gracias por unirte a nuestra plataforma de bienestar. Explora las funcionalidades disponibles para mejorar tu día a día.',
  'info',
  'system',
  false
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_notifications un 
  WHERE un.user_id = p.user_id AND un.title = 'Bienvenido a Contigo'
);

-- Insert quick actions for existing users who don't have any
INSERT INTO public.quick_actions (user_id, title, description, icon_name, color, action_type, action_data, category, order_index)
SELECT 
  p.user_id,
  unnest(ARRAY['Nueva Tarea', 'Estado de Ánimo', 'Recordatorio Salud', 'Chat IA', 'Metas Diarias', 'Técnica Pomodoro']),
  unnest(ARRAY[
    'Agregar una nueva tarea académica',
    'Registrar cómo te sientes hoy', 
    'Agregar recordatorio médico',
    'Hablar con tu asistente personal',
    'Ver progreso de objetivos',
    'Iniciar sesión de estudio'
  ]),
  unnest(ARRAY['Plus', 'Heart', 'Calendar', 'Brain', 'Target', 'Clock']),
  unnest(ARRAY['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899']),
  unnest(ARRAY['modal', 'modal', 'modal', 'navigate', 'modal', 'modal']),
  unnest(ARRAY[
    '{"modal": "new_task", "module": "academic"}',
    '{"modal": "mood_selector", "module": "emotional"}',
    '{"modal": "health_reminder", "module": "health"}', 
    '{"url": "/ai"}',
    '{"modal": "daily_goals", "module": "general"}',
    '{"modal": "pomodoro", "module": "academic"}'
  ]::jsonb[]),
  unnest(ARRAY['academic', 'emotional', 'health', 'general', 'productivity', 'productivity']),
  unnest(ARRAY[1, 2, 3, 4, 5, 6])
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.quick_actions qa 
  WHERE qa.user_id = p.user_id
);