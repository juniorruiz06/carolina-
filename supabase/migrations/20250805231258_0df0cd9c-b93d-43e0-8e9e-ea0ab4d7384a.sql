-- Create edge function for voice AI processing
CREATE OR REPLACE FUNCTION public.process_voice_command()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- This function will be called by the edge function
  RETURN NEW;
END;
$function$;