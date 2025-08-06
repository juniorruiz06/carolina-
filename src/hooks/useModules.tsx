import { useState, useEffect } from 'react';
import { Module, BaseModule } from '@/types/modules';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

/**
 * Hook para gestión de módulos del sistema Contigo
 * Maneja el estado, habilitación y configuración de módulos
 */

interface UseModulesReturn {
  modules: BaseModule[];
  loading: boolean;
  error: string | null;
  enableModule: (moduleId: string) => Promise<boolean>;
  disableModule: (moduleId: string) => Promise<boolean>;
  getModuleById: (moduleId: string) => BaseModule | null;
  getEnabledModules: () => BaseModule[];
  refreshModules: () => Promise<void>;
}

export const useModules = (): UseModulesReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [modules, setModules] = useState<BaseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Configuración inicial de módulos del sistema
   * Esta estructura está preparada para futuras implementaciones
   */
  const initializeModules = (): BaseModule[] => {
    return [
      {
        id: 'health',
        name: 'Módulo de Salud',
        description: 'Recordatorios médicos, medicamentos y citas',
        icon: 'Activity',
        color: '#10B981',
        isEnabled: false,
        lastAccessed: undefined,
      },
      {
        id: 'emotional',
        name: 'Módulo Emocional',
        description: 'Diario personal y frases motivacionales',
        icon: 'Smile',
        color: '#F59E0B',
        isEnabled: false,
        lastAccessed: undefined,
      },
      {
        id: 'academic',
        name: 'Módulo Académico',
        description: 'Gestión de tareas y técnica Pomodoro',
        icon: 'BookOpen',
        color: '#3B82F6',
        isEnabled: false,
        lastAccessed: undefined,
      },
      {
        id: 'ai',
        name: 'IA Asistente',
        description: 'Chat inteligente y asistencia personalizada',
        icon: 'Brain',
        color: '#8B5CF6',
        isEnabled: false,
        lastAccessed: undefined,
      },
    ];
  };

  /**
   * Carga la configuración de módulos desde la base de datos
   * Si no existe, crea la configuración inicial
   */
  const loadModules = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // En futuras implementaciones, esto cargaría desde Supabase
      // const { data, error } = await supabase
      //   .from('user_modules')
      //   .select('*')
      //   .eq('user_id', user.id);

      // Por ahora, usamos la configuración inicial
      const initialModules = initializeModules();
      setModules(initialModules);

    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar módulos';
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
   * Habilita un módulo específico
   */
  const enableModule = async (moduleId: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "Usuario no autenticado",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Actualizar estado local
      setModules(prev => 
        prev.map(module => 
          module.id === moduleId 
            ? { ...module, isEnabled: true, lastAccessed: new Date() }
            : module
        )
      );

      // En futuras implementaciones, esto actualizaría Supabase
      // await supabase
      //   .from('user_modules')
      //   .update({ is_enabled: true, last_accessed: new Date() })
      //   .eq('user_id', user.id)
      //   .eq('module_id', moduleId);

      toast({
        title: "Módulo habilitado",
        description: "El módulo se ha activado correctamente",
      });

      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudo habilitar el módulo",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Deshabilita un módulo específico
   */
  const disableModule = async (moduleId: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "Usuario no autenticado",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Actualizar estado local
      setModules(prev => 
        prev.map(module => 
          module.id === moduleId 
            ? { ...module, isEnabled: false }
            : module
        )
      );

      // En futuras implementaciones, esto actualizaría Supabase
      // await supabase
      //   .from('user_modules')
      //   .update({ is_enabled: false })
      //   .eq('user_id', user.id)
      //   .eq('module_id', moduleId);

      toast({
        title: "Módulo deshabilitado",
        description: "El módulo se ha desactivado correctamente",
      });

      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudo deshabilitar el módulo",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Obtiene un módulo por su ID
   */
  const getModuleById = (moduleId: string): BaseModule | null => {
    return modules.find(module => module.id === moduleId) || null;
  };

  /**
   * Obtiene solo los módulos habilitados
   */
  const getEnabledModules = (): BaseModule[] => {
    return modules.filter(module => module.isEnabled);
  };

  /**
   * Recarga la configuración de módulos
   */
  const refreshModules = async () => {
    await loadModules();
  };

  // Effect para cargar módulos cuando cambia el usuario
  useEffect(() => {
    loadModules();
  }, [user]);

  return {
    modules,
    loading,
    error,
    enableModule,
    disableModule,
    getModuleById,
    getEnabledModules,
    refreshModules,
  };
};