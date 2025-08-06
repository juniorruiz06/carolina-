-- Arreglar los warnings de seguridad actualizando las funciones con search_path

-- Actualizar la función update_updated_at_column con search_path seguro
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Actualizar la función extract_conversation_insights con search_path seguro
CREATE OR REPLACE FUNCTION public.extract_conversation_insights()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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