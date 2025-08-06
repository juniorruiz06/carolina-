import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface UserSettings {
  id: string;
  user_id: string;
  notifications_enabled: boolean;
  daily_reminder_time: string;
  preferred_language: string;
  theme_preference: string;
  privacy_level: string;
  data_sharing: boolean;
  accessibility_features: any;
  created_at: string;
  updated_at: string;
}

export interface UseUserSettingsReturn {
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (updates: Partial<UserSettings>) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}

export const useUserSettings = (): UseUserSettingsReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      setSettings(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching settings';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error: updateError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...updates,
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (updateError) throw updateError;

      setSettings(data);
      toast({
        title: "Éxito",
        description: "Configuración actualizada correctamente",
      });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating settings';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refreshSettings,
  };
};