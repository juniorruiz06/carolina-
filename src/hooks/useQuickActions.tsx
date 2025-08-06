import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

/**
 * Hook para gestión de acciones rápidas de usuario
 * Maneja CRUD operations y estadísticas de uso
 */

export interface QuickAction {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  icon_name: string;
  color: string;
  action_type: 'navigate' | 'modal' | 'external' | 'function';
  action_data: Record<string, any>;
  category: 'health' | 'emotional' | 'academic' | 'productivity' | 'general';
  is_active: boolean;
  order_index: number;
  usage_count: number;
  last_used_at?: string;
  created_at: string;
  updated_at: string;
}

interface UseQuickActionsReturn {
  quickActions: QuickAction[];
  loading: boolean;
  error: string | null;
  executeAction: (action: QuickAction) => Promise<void>;
  createAction: (action: Partial<QuickAction>) => Promise<boolean>;
  updateAction: (id: string, updates: Partial<QuickAction>) => Promise<boolean>;
  deleteAction: (id: string) => Promise<boolean>;
  reorderActions: (actions: QuickAction[]) => Promise<boolean>;
  refreshActions: () => Promise<void>;
}

export const useQuickActions = (): UseQuickActionsReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene todas las acciones rápidas del usuario
   */
  const fetchQuickActions = async () => {
    if (!user) {
      setLoading(false);
      setQuickActions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('quick_actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;

      setQuickActions(data as QuickAction[] || []);
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar las acciones rápidas';
      setError(errorMessage);
      console.error('Error fetching quick actions:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ejecuta una acción rápida y actualiza estadísticas
   */
  const executeAction = async (action: QuickAction): Promise<void> => {
    if (!user) return;

    try {
      // Actualizar estadísticas de uso
      await supabase
        .from('quick_actions')
        .update({ 
          usage_count: action.usage_count + 1,
          last_used_at: new Date().toISOString()
        })
        .eq('id', action.id)
        .eq('user_id', user.id);

      // Actualizar estado local
      setQuickActions(prev => 
        prev.map(qa => 
          qa.id === action.id 
            ? { ...qa, usage_count: qa.usage_count + 1, last_used_at: new Date().toISOString() }
            : qa
        )
      );

      // Ejecutar la acción según su tipo
      switch (action.action_type) {
        case 'navigate':
          if (action.action_data.url) {
            window.location.href = action.action_data.url;
          }
          break;

        case 'modal':
          // Emitir evento personalizado para que los componentes puedan escuchar
          const modalEvent = new CustomEvent('quickActionModal', {
            detail: {
              modal: action.action_data.modal,
              module: action.action_data.module,
              data: action.action_data
            }
          });
          window.dispatchEvent(modalEvent);
          break;

        case 'external':
          if (action.action_data.url) {
            window.open(action.action_data.url, '_blank');
          }
          break;

        case 'function':
          // Emitir evento personalizado para funciones específicas
          const functionEvent = new CustomEvent('quickActionFunction', {
            detail: {
              function: action.action_data.function,
              params: action.action_data.params
            }
          });
          window.dispatchEvent(functionEvent);
          break;

        default:
          console.warn('Tipo de acción no reconocido:', action.action_type);
      }

      toast({
        title: action.title,
        description: action.description || 'Acción ejecutada correctamente',
      });

    } catch (err: any) {
      console.error('Error executing quick action:', err);
      toast({
        title: "Error",
        description: "No se pudo ejecutar la acción",
        variant: "destructive",
      });
    }
  };

  /**
   * Crea una nueva acción rápida
   */
  const createAction = async (action: Partial<QuickAction>): Promise<boolean> => {
    if (!user) return false;

    try {
      const newAction = {
        user_id: user.id,
        title: action.title || '',
        description: action.description,
        icon_name: action.icon_name || 'Plus',
        color: action.color || '#3B82F6',
        action_type: action.action_type || 'modal',
        action_data: action.action_data || {},
        category: action.category || 'general',
        is_active: action.is_active ?? true,
        order_index: action.order_index ?? quickActions.length,
      };

      const { data, error } = await supabase
        .from('quick_actions')
        .insert(newAction)
        .select()
        .single();

      if (error) throw error;

      // Actualizar estado local
      setQuickActions(prev => [...prev, data as QuickAction]);

      toast({
        title: "Acción creada",
        description: "La acción rápida se ha creado correctamente",
      });

      return true;
    } catch (err: any) {
      console.error('Error creating quick action:', err);
      toast({
        title: "Error",
        description: "No se pudo crear la acción rápida",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Actualiza una acción rápida existente
   */
  const updateAction = async (id: string, updates: Partial<QuickAction>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('quick_actions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Actualizar estado local
      setQuickActions(prev => 
        prev.map(action => action.id === id ? data as QuickAction : action)
      );

      toast({
        title: "Acción actualizada",
        description: "La acción rápida se ha actualizado correctamente",
      });

      return true;
    } catch (err: any) {
      console.error('Error updating quick action:', err);
      toast({
        title: "Error",
        description: "No se pudo actualizar la acción rápida",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Elimina una acción rápida
   */
  const deleteAction = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('quick_actions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Actualizar estado local
      setQuickActions(prev => prev.filter(action => action.id !== id));

      toast({
        title: "Acción eliminada",
        description: "La acción rápida se ha eliminado correctamente",
      });

      return true;
    } catch (err: any) {
      console.error('Error deleting quick action:', err);
      toast({
        title: "Error",
        description: "No se pudo eliminar la acción rápida",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Reordena las acciones rápidas
   */
  const reorderActions = async (actions: QuickAction[]): Promise<boolean> => {
    if (!user) return false;

    try {
      // Actualizar order_index para cada acción
      const updates = actions.map((action, index) => 
        supabase
          .from('quick_actions')
          .update({ order_index: index })
          .eq('id', action.id)
          .eq('user_id', user.id)
      );

      await Promise.all(updates);

      // Actualizar estado local
      setQuickActions(actions);

      return true;
    } catch (err: any) {
      console.error('Error reordering quick actions:', err);
      toast({
        title: "Error",
        description: "No se pudo reordenar las acciones rápidas",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Recarga las acciones rápidas desde la base de datos
   */
  const refreshActions = async () => {
    await fetchQuickActions();
  };

  // Effect para cargar las acciones cuando cambia el usuario
  useEffect(() => {
    fetchQuickActions();
  }, [user]);

  return {
    quickActions,
    loading,
    error,
    executeAction,
    createAction,
    updateAction,
    deleteAction,
    reorderActions,
    refreshActions,
  };
};