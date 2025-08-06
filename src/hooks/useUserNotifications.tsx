import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

/**
 * Hook para gestión de notificaciones de usuario
 * Maneja CRUD operations y estado de lectura de notificaciones
 */

export interface UserNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder';
  category: 'health' | 'emotional' | 'academic' | 'general' | 'system';
  is_read: boolean;
  is_important: boolean;
  action_url?: string;
  action_label?: string;
  scheduled_for?: string;
  expires_at?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface UseUserNotificationsReturn {
  notifications: UserNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  deleteNotification: (id: string) => Promise<boolean>;
  createNotification: (notification: Partial<UserNotification>) => Promise<boolean>;
  refreshNotifications: () => Promise<void>;
}

export const useUserNotifications = (): UseUserNotificationsReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene todas las notificaciones del usuario
   */
  const fetchNotifications = async () => {
    if (!user) {
      setLoading(false);
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotifications(data as UserNotification[] || []);
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar las notificaciones';
      setError(errorMessage);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Marca una notificación como leída
   */
  const markAsRead = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Actualizar estado local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, is_read: true }
            : notification
        )
      );

      return true;
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      toast({
        title: "Error",
        description: "No se pudo marcar la notificación como leída",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Marca todas las notificaciones como leídas
   */
  const markAllAsRead = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      // Actualizar estado local
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );

      toast({
        title: "¡Hecho!",
        description: "Todas las notificaciones han sido marcadas como leídas",
      });

      return true;
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
      toast({
        title: "Error",
        description: "No se pudieron marcar todas las notificaciones como leídas",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Elimina una notificación
   */
  const deleteNotification = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Actualizar estado local
      setNotifications(prev => prev.filter(notification => notification.id !== id));

      toast({
        title: "Notificación eliminada",
        description: "La notificación se ha eliminado correctamente",
      });

      return true;
    } catch (err: any) {
      console.error('Error deleting notification:', err);
      toast({
        title: "Error",
        description: "No se pudo eliminar la notificación",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Crea una nueva notificación
   */
  const createNotification = async (notification: Partial<UserNotification>): Promise<boolean> => {
    if (!user) return false;

    try {
      const newNotification = {
        user_id: user.id,
        title: notification.title || '',
        message: notification.message || '',
        type: notification.type || 'info',
        category: notification.category || 'general',
        is_important: notification.is_important || false,
        action_url: notification.action_url,
        action_label: notification.action_label,
        scheduled_for: notification.scheduled_for,
        expires_at: notification.expires_at,
        metadata: notification.metadata || {},
      };

      const { data, error } = await supabase
        .from('user_notifications')
        .insert(newNotification)
        .select()
        .single();

      if (error) throw error;

      // Actualizar estado local
      setNotifications(prev => [data as UserNotification, ...prev]);

      return true;
    } catch (err: any) {
      console.error('Error creating notification:', err);
      toast({
        title: "Error",
        description: "No se pudo crear la notificación",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Recarga las notificaciones desde la base de datos
   */
  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  // Calcular notificaciones no leídas
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Effect para cargar las notificaciones cuando cambia el usuario
  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Configurar real-time updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user-notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Recargar notificaciones cuando hay cambios
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    refreshNotifications,
  };
};