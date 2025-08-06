import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

/**
 * Hook para gestión de avatares de usuario
 * Maneja subida, actualización y eliminación de avatares
 */

interface UseAvatarUploadReturn {
  uploading: boolean;
  uploadAvatar: (file: File) => Promise<string | null>;
  deleteAvatar: (url: string) => Promise<boolean>;
}

export const useAvatarUpload = (): UseAvatarUploadReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  /**
   * Sube un archivo de avatar al storage de Supabase
   */
  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para subir una imagen",
        variant: "destructive",
      });
      return null;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Solo se permiten archivos de imagen",
        variant: "destructive",
      });
      return null;
    }

    // Validar tamaño de archivo (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "El archivo no puede ser mayor a 5MB",
        variant: "destructive",
      });
      return null;
    }

    try {
      setUploading(true);

      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Subir archivo al storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw error;
      }

      // Obtener URL pública del archivo
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      toast({
        title: "¡Éxito!",
        description: "Avatar subido correctamente",
      });

      return publicUrl;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al subir el avatar';
      console.error('Error uploading avatar:', err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  /**
   * Elimina un avatar del storage
   */
  const deleteAvatar = async (url: string): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      // Extraer el path del archivo de la URL
      const urlParts = url.split('/storage/v1/object/public/avatars/');
      if (urlParts.length !== 2) {
        throw new Error('URL de avatar inválida');
      }

      const filePath = urlParts[1];

      // Eliminar archivo del storage
      const { error } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (error) {
        throw error;
      }

      toast({
        title: "Avatar eliminado",
        description: "El avatar se ha eliminado correctamente",
      });

      return true;
    } catch (err: any) {
      console.error('Error deleting avatar:', err);
      toast({
        title: "Error",
        description: "No se pudo eliminar el avatar",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    uploading,
    uploadAvatar,
    deleteAvatar,
  };
};