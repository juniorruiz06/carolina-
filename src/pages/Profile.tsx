import { useState, useRef } from "react";
import { GradientBackground } from "@/components/layout/GradientBackground";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { ArrowLeft, User, Mail, Calendar, Edit3, Save, X, Camera, Upload } from "lucide-react";
import contigoHeart from "@/assets/contigo-heart.png";

/**
 * Pantalla de perfil de usuario
 * Permite ver y editar información personal
 */

interface ProfileProps {
  onBack: () => void;
}

export const Profile = ({ onBack }: ProfileProps) => {
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const { uploading: uploadingAvatar, uploadAvatar } = useAvatarUpload();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    display_name: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inicializar formulario cuando se carga el perfil
  const initializeForm = () => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || '',
        display_name: profile.display_name || '',
      });
    }
  };

  const handleEditClick = () => {
    initializeForm();
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ full_name: '', display_name: '' });
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const success = await updateProfile({
        full_name: editForm.full_name.trim() || null,
        display_name: editForm.display_name.trim() || null,
      });

      if (success) {
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSignOut = async () => {
    await signOut();
    onBack();
  };

  /**
   * Maneja la selección y subida de avatar
   */
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const avatarUrl = await uploadAvatar(file);
    if (avatarUrl) {
      // Actualizar el perfil con la nueva URL del avatar
      await updateProfile({ avatar_url: avatarUrl });
    }

    // Limpiar el input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <GradientBackground variant="primary" className="flex items-center justify-center min-h-screen p-6">
        <div className="w-8 h-8 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
      </GradientBackground>
    );
  }

  return (
    <GradientBackground variant="primary" className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <GlassContainer size="sm" className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GlassButton
                variant="secondary"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </GlassButton>
              
              <div className="flex items-center gap-3">
                <img src={contigoHeart} alt="Contigo" className="w-8 h-8" />
                <h1 className="text-xl font-primary font-bold text-foreground">Mi Perfil</h1>
              </div>
            </div>

            {!isEditing && (
              <GlassButton
                variant="secondary"
                size="sm"
                onClick={handleEditClick}
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Editar
              </GlassButton>
            )}
          </div>
        </GlassContainer>

        {/* Profile Content */}
        <GlassContainer size="lg" glow="soft">
          {/* Avatar Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-contigo-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-contigo-primary" />
                )}
              </div>
              
              {isEditing && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute bottom-2 right-2 w-8 h-8 bg-contigo-secondary rounded-full flex items-center justify-center text-white hover:bg-contigo-secondary/80 transition-colors disabled:opacity-50"
                  >
                    {uploadingAvatar ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                </>
              )}
            </div>

            {!isEditing ? (
              <div>
                <h2 className="text-2xl font-primary font-bold text-foreground mb-2">
                  {profile?.display_name || profile?.full_name || 'Usuario'}
                </h2>
                <p className="text-foreground/70 font-secondary">
                  {user?.email}
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-w-md mx-auto">
                <GlassInput
                  label="Nombre completo"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Tu nombre completo"
                />
                <GlassInput
                  label="Nombre para mostrar"
                  value={editForm.display_name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, display_name: e.target.value }))}
                  placeholder="Cómo quieres que te llamen"
                />
              </div>
            )}
          </div>

          {/* Profile Information */}
          {!isEditing && (
            <div className="space-y-6">
              {/* Personal Info */}
              <div className="bg-glass-white/30 rounded-2xl p-6">
                <h3 className="font-primary font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-contigo-primary" />
                  Información Personal
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/70 font-secondary">Nombre completo:</span>
                    <span className="font-secondary font-medium text-foreground">
                      {profile?.full_name || 'No especificado'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/70 font-secondary">Nombre de usuario:</span>
                    <span className="font-secondary font-medium text-foreground">
                      {profile?.display_name || 'No especificado'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-glass-white/30 rounded-2xl p-6">
                <h3 className="font-primary font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-contigo-secondary" />
                  Información de Cuenta
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/70 font-secondary">Email:</span>
                    <span className="font-secondary font-medium text-foreground">
                      {user?.email}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/70 font-secondary">Miembro desde:</span>
                    <span className="font-secondary font-medium text-foreground">
                      {profile?.created_at ? formatDate(profile.created_at) : 'No disponible'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4">
                <GlassButton
                  variant="secondary"
                  size="lg"
                  onClick={handleSignOut}
                  className="w-full font-semibold"
                >
                  Cerrar Sesión
                </GlassButton>
              </div>
            </div>
          )}

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex gap-4 justify-center">
              <GlassButton
                variant="secondary"
                onClick={handleCancelEdit}
                className="flex items-center gap-2"
                disabled={isSaving}
              >
                <X className="w-4 h-4" />
                Cancelar
              </GlassButton>
              
              <GlassButton
                variant="primary"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Guardar Cambios
              </GlassButton>
            </div>
          )}
        </GlassContainer>
      </div>
    </GradientBackground>
  );
};