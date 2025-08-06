import { useState, useEffect } from 'react';
import { AppSettings } from '@/types/modules';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

/**
 * Hook para gestión de configuraciones de la aplicación
 * Maneja preferencias, notificaciones, tema y accesibilidad
 */

interface UseAppSettingsReturn {
  settings: AppSettings;
  loading: boolean;
  error: string | null;
  updateSettings: (updates: Partial<AppSettings>) => Promise<boolean>;
  resetToDefaults: () => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
    quiet_hours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
    },
  },
  privacy: {
    shareDataForImprovement: false,
    enableAnalytics: true,
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
  },
};

export const useAppSettings = (): UseAppSettingsReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga la configuración desde la base de datos
   */
  const loadSettings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // En futuras implementaciones, esto cargaría desde Supabase
      // const { data, error } = await supabase
      //   .from('user_settings')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .single();

      // if (error && error.code !== 'PGRST116') {
      //   throw error;
      // }

      // Por ahora, usamos configuración por defecto con localStorage
      const savedSettings = localStorage.getItem(`contigo_settings_${user.id}`);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } else {
        setSettings(defaultSettings);
      }

    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar configuraciones';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza la configuración
   */
  const updateSettings = async (updates: Partial<AppSettings>): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "Usuario no autenticado",
        variant: "destructive",
      });
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const newSettings = { ...settings, ...updates };
      
      // Guardar en localStorage por ahora
      localStorage.setItem(`contigo_settings_${user.id}`, JSON.stringify(newSettings));
      
      // En futuras implementaciones, esto actualizaría Supabase
      // const { error } = await supabase
      //   .from('user_settings')
      //   .upsert({
      //     user_id: user.id,
      //     settings: newSettings,
      //     updated_at: new Date().toISOString(),
      //   });

      // if (error) throw error;

      setSettings(newSettings);

      // Aplicar configuraciones inmediatamente
      applyThemeSettings(newSettings.theme);
      applyAccessibilitySettings(newSettings.accessibility);

      toast({
        title: "Configuración guardada",
        description: "Los cambios se han aplicado correctamente",
      });

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al guardar configuraciones';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Aplica configuraciones de tema
   */
  const applyThemeSettings = (theme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  };

  /**
   * Aplica configuraciones de accesibilidad
   */
  const applyAccessibilitySettings = (accessibility: AppSettings['accessibility']) => {
    const root = document.documentElement;
    
    // Tamaño de fuente
    root.setAttribute('data-font-size', accessibility.fontSize);
    
    // Alto contraste
    if (accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reducir movimiento
    if (accessibility.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  };

  /**
   * Restaura configuraciones por defecto
   */
  const resetToDefaults = async (): Promise<boolean> => {
    return await updateSettings(defaultSettings);
  };

  /**
   * Recarga las configuraciones
   */
  const refreshSettings = async () => {
    await loadSettings();
  };

  // Effect para cargar configuraciones cuando cambia el usuario
  useEffect(() => {
    loadSettings();
  }, [user]);

  // Effect para aplicar configuraciones cuando se cargan
  useEffect(() => {
    if (!loading) {
      applyThemeSettings(settings.theme);
      applyAccessibilitySettings(settings.accessibility);
    }
  }, [settings, loading]);

  // Effect para escuchar cambios del tema del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (settings.theme === 'system') {
        applyThemeSettings('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    resetToDefaults,
    refreshSettings,
  };
};