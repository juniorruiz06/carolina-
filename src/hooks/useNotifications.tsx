import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useAppSettings } from './useAppSettings';
import { useToast } from './use-toast';

/**
 * Hook para gestión de notificaciones del sistema
 * Maneja permisos, programación y envío de notificaciones
 */

interface Notification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  data?: any;
}

interface UseNotificationsReturn {
  permission: NotificationPermission;
  isSupported: boolean;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  showNotification: (notification: Notification) => Promise<boolean>;
  scheduleNotification: (notification: Notification, delay: number) => string;
  cancelNotification: (id: string) => void;
  clearAllNotifications: () => void;
  isInQuietHours: () => boolean;
}

export const useNotifications = (): UseNotificationsReturn => {
  const { user } = useAuth();
  const { settings } = useAppSettings();
  const { toast } = useToast();
  
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [scheduledNotifications, setScheduledNotifications] = useState<Map<string, number>>(new Map());

  const isSupported = 'Notification' in window;
  const hasPermission = permission === 'granted';

  /**
   * Solicita permisos de notificación
   */
  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      toast({
        title: "No compatible",
        description: "Las notificaciones no son compatibles con este navegador",
        variant: "destructive",
      });
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast({
          title: "Permisos concedidos",
          description: "Las notificaciones han sido habilitadas",
        });
        return true;
      } else {
        toast({
          title: "Permisos denegados",
          description: "Las notificaciones no podrán mostrarse",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron solicitar los permisos",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Verifica si estamos en horario silencioso
   */
  const isInQuietHours = useCallback((): boolean => {
    if (!settings.notifications.quiet_hours.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = settings.notifications.quiet_hours.start.split(':').map(Number);
    const [endHour, endMin] = settings.notifications.quiet_hours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    // Si el horario cruza la medianoche
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      return currentTime >= startTime && currentTime <= endTime;
    }
  }, [settings.notifications.quiet_hours]);

  /**
   * Muestra una notificación
   */
  const showNotification = async (notification: Notification): Promise<boolean> => {
    if (!isSupported || !hasPermission) {
      console.warn('Notifications not supported or permission not granted');
      return false;
    }

    if (!settings.notifications.enabled) {
      console.log('Notifications disabled in settings');
      return false;
    }

    if (isInQuietHours()) {
      console.log('In quiet hours, notification suppressed');
      return false;
    }

    try {
      const notificationOptions: NotificationOptions = {
        body: notification.body,
        icon: notification.icon || '/favicon.ico',
        badge: notification.badge,
        tag: notification.tag,
        requireInteraction: notification.requireInteraction,
        silent: notification.silent || !settings.notifications.sound,
        data: notification.data,
      };

      const systemNotification = new Notification(notification.title, notificationOptions);

      // Manejar vibración si está habilitada
      if (settings.notifications.vibration && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }

      // Auto-cerrar después de 5 segundos si no requiere interacción
      if (!notification.requireInteraction) {
        setTimeout(() => {
          systemNotification.close();
        }, 5000);
      }

      // Manejar eventos de la notificación
      systemNotification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        systemNotification.close();
        
        // Aquí se puede añadir lógica de navegación basada en notification.data
        if (notification.data?.route) {
          // window.location.href = notification.data.route;
        }
      };

      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      toast({
        title: "Error",
        description: "No se pudo mostrar la notificación",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Programa una notificación para más tarde
   */
  const scheduleNotification = (notification: Notification, delay: number): string => {
    const id = notification.id || `notification_${Date.now()}_${Math.random()}`;
    
    const timeoutId = window.setTimeout(() => {
      showNotification({ ...notification, id });
      setScheduledNotifications(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
    }, delay);

    setScheduledNotifications(prev => new Map(prev).set(id, timeoutId));
    
    return id;
  };

  /**
   * Cancela una notificación programada
   */
  const cancelNotification = (id: string) => {
    const timeoutId = scheduledNotifications.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setScheduledNotifications(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
    }
  };

  /**
   * Cancela todas las notificaciones programadas
   */
  const clearAllNotifications = () => {
    scheduledNotifications.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    setScheduledNotifications(new Map());
  };

  // Effect para inicializar el estado de permisos
  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  // Effect para limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      clearAllNotifications();
    };
  }, []);

  return {
    permission,
    isSupported,
    hasPermission,
    requestPermission,
    showNotification,
    scheduleNotification,
    cancelNotification,
    clearAllNotifications,
    isInQuietHours,
  };
};