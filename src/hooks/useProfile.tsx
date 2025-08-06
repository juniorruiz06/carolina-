import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

/**
 * Hook para gestión del perfil de usuario
 * Maneja CRUD operations del perfil con Supabase
 */

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface UseProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene el perfil del usuario desde Supabase
   */
  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      setProfile(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        // Si no existe el perfil, lo creamos
        await createProfile();
        return;
      }

      setProfile(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar el perfil';
      setError(errorMessage);
      console.error('Error fetching profile:', err);
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
   * Crea un nuevo perfil para el usuario
   */
  const createProfile = async () => {
    if (!user) return;

    try {
      const newProfile = {
        user_id: user.id,
        full_name: user.user_metadata?.full_name || null,
        display_name: user.user_metadata?.display_name || null,
        avatar_url: null,
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast({
        title: "¡Bienvenido!",
        description: "Tu perfil ha sido creado exitosamente.",
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear el perfil';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  /**
   * Actualiza el perfil del usuario
   */
  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "No hay usuario o perfil activo",
        variant: "destructive",
      });
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // Filtramos campos que no se deben actualizar directamente
      const allowedUpdates = {
        ...(updates.full_name !== undefined && { full_name: updates.full_name }),
        ...(updates.display_name !== undefined && { display_name: updates.display_name }),
        ...(updates.avatar_url !== undefined && { avatar_url: updates.avatar_url }),
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(allowedUpdates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast({
        title: "Perfil actualizado",
        description: "Los cambios se han guardado exitosamente.",
      });

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar el perfil';
      setError(errorMessage);
      toast({
        title: "Error al actualizar",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Recarga el perfil desde la base de datos
   */
  const refreshProfile = async () => {
    await fetchProfile();
  };

  // Effect para cargar el perfil cuando cambia el usuario
  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
  };
};