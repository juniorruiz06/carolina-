import { useState, useEffect } from "react";
import { GradientBackground } from "@/components/layout/GradientBackground";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { GlassButton } from "@/components/ui/GlassButton";
import { useUserSettings } from "@/hooks/useUserSettings";
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  Bell, 
  Moon, 
  Shield, 
  Accessibility,
  Volume2,
  Vibrate,
  Eye,
  Type,
  Palette
} from "lucide-react";
import contigoHeart from "@/assets/contigo-heart.png";

/**
 * Pantalla de configuración de la aplicación
 * Maneja preferencias de usuario, notificaciones, privacidad y accesibilidad
 */

interface SettingsProps {
  onBack: () => void;
}

interface SettingsState {
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    quietHours: boolean;
    quietStart: string;
    quietEnd: string;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reduceMotion: boolean;
  };
  privacy: {
    shareData: boolean;
    analytics: boolean;
    crashReports: boolean;
  };
}

export const Settings = ({ onBack }: SettingsProps) => {
  const { settings: userSettings, loading, updateSettings } = useUserSettings();
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      enabled: true,
      sound: true,
      vibration: true,
      quietHours: false,
      quietStart: '22:00',
      quietEnd: '07:00',
    },
    appearance: {
      theme: 'system',
      fontSize: 'medium',
      highContrast: false,
      reduceMotion: false,
    },
    privacy: {
      shareData: false,
      analytics: true,
      crashReports: true,
    },
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Cargar configuración desde la base de datos
  useEffect(() => {
    if (userSettings) {
      const accessibilityFeatures = userSettings.accessibility_features || {};
      setSettings({
        notifications: {
          enabled: userSettings.notifications_enabled,
          sound: true, // Por defecto
          vibration: true, // Por defecto
          quietHours: false, // Por defecto
          quietStart: '22:00',
          quietEnd: '07:00',
        },
        appearance: {
          theme: userSettings.theme_preference as 'light' | 'dark' | 'system',
          fontSize: (accessibilityFeatures.fontSize || 'medium') as 'small' | 'medium' | 'large',
          highContrast: accessibilityFeatures.highContrast || false,
          reduceMotion: accessibilityFeatures.reduceMotion || false,
        },
        privacy: {
          shareData: userSettings.data_sharing,
          analytics: true, // Por defecto
          crashReports: true, // Por defecto
        },
      });
    }
  }, [userSettings]);

  /**
   * Actualiza un valor en la configuración
   */
  const updateSetting = (
    section: keyof SettingsState,
    key: string,
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  /**
   * Guarda la configuración
   */
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        notifications_enabled: settings.notifications.enabled,
        theme_preference: settings.appearance.theme,
        data_sharing: settings.privacy.shareData,
        accessibility_features: {
          fontSize: settings.appearance.fontSize,
          highContrast: settings.appearance.highContrast,
          reduceMotion: settings.appearance.reduceMotion,
        },
      });
      
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

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
                <h1 className="text-xl font-primary font-bold text-foreground">Configuración</h1>
              </div>
            </div>

            {hasChanges && (
              <GlassButton
                variant="primary"
                size="sm"
                onClick={saveSettings}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                ) : (
                  "Guardar"
                )}
              </GlassButton>
            )}
          </div>
        </GlassContainer>

        <div className="space-y-6">
          {/* Notificaciones */}
          <GlassContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-contigo-primary/20 rounded-2xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-contigo-primary" />
              </div>
              <h2 className="text-lg font-primary font-semibold text-foreground">
                Notificaciones
              </h2>
            </div>

            <div className="space-y-4">
              <ToggleRow
                label="Recibir notificaciones"
                description="Activar/desactivar todas las notificaciones"
                checked={settings.notifications.enabled}
                onChange={(checked) => updateSetting('notifications', 'enabled', checked)}
              />

              {settings.notifications.enabled && (
                <>
                  <ToggleRow
                    label="Sonido"
                    description="Reproducir sonido con las notificaciones"
                    checked={settings.notifications.sound}
                    onChange={(checked) => updateSetting('notifications', 'sound', checked)}
                    icon={<Volume2 className="w-4 h-4" />}
                  />

                  <ToggleRow
                    label="Vibración"
                    description="Vibrar el dispositivo con las notificaciones"
                    checked={settings.notifications.vibration}
                    onChange={(checked) => updateSetting('notifications', 'vibration', checked)}
                    icon={<Vibrate className="w-4 h-4" />}
                  />

                  <ToggleRow
                    label="Horario silencioso"
                    description="No molestar durante ciertas horas"
                    checked={settings.notifications.quietHours}
                    onChange={(checked) => updateSetting('notifications', 'quietHours', checked)}
                    icon={<Moon className="w-4 h-4" />}
                  />
                </>
              )}
            </div>
          </GlassContainer>

          {/* Apariencia */}
          <GlassContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-contigo-secondary/20 rounded-2xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-contigo-secondary" />
              </div>
              <h2 className="text-lg font-primary font-semibold text-foreground">
                Apariencia
              </h2>
            </div>

            <div className="space-y-4">
              <SelectRow
                label="Tema"
                description="Elige el tema de la aplicación"
                value={settings.appearance.theme}
                options={[
                  { value: 'light', label: 'Claro' },
                  { value: 'dark', label: 'Oscuro' },
                  { value: 'system', label: 'Sistema' },
                ]}
                onChange={(value) => updateSetting('appearance', 'theme', value)}
              />

              <SelectRow
                label="Tamaño de letra"
                description="Ajusta el tamaño del texto"
                value={settings.appearance.fontSize}
                options={[
                  { value: 'small', label: 'Pequeño' },
                  { value: 'medium', label: 'Mediano' },
                  { value: 'large', label: 'Grande' },
                ]}
                onChange={(value) => updateSetting('appearance', 'fontSize', value)}
                icon={<Type className="w-4 h-4" />}
              />
            </div>
          </GlassContainer>

          {/* Accesibilidad */}
          <GlassContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-contigo-accent/20 rounded-2xl flex items-center justify-center">
                <Accessibility className="w-5 h-5 text-contigo-accent" />
              </div>
              <h2 className="text-lg font-primary font-semibold text-foreground">
                Accesibilidad
              </h2>
            </div>

            <div className="space-y-4">
              <ToggleRow
                label="Alto contraste"
                description="Mejora la visibilidad del contenido"
                checked={settings.appearance.highContrast}
                onChange={(checked) => updateSetting('appearance', 'highContrast', checked)}
                icon={<Eye className="w-4 h-4" />}
              />

              <ToggleRow
                label="Reducir movimiento"
                description="Minimiza las animaciones y transiciones"
                checked={settings.appearance.reduceMotion}
                onChange={(checked) => updateSetting('appearance', 'reduceMotion', checked)}
              />
            </div>
          </GlassContainer>

          {/* Privacidad */}
          <GlassContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-lg font-primary font-semibold text-foreground">
                Privacidad y Datos
              </h2>
            </div>

            <div className="space-y-4">
              <ToggleRow
                label="Compartir datos para mejoras"
                description="Ayuda a mejorar la aplicación compartiendo datos anónimos"
                checked={settings.privacy.shareData}
                onChange={(checked) => updateSetting('privacy', 'shareData', checked)}
              />

              <ToggleRow
                label="Análisis de uso"
                description="Permitir recopilación de estadísticas de uso"
                checked={settings.privacy.analytics}
                onChange={(checked) => updateSetting('privacy', 'analytics', checked)}
              />
            </div>
          </GlassContainer>
        </div>
      </div>
    </GradientBackground>
  );
};

/**
 * Componente reutilizable para filas con toggle
 */
interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
}

const ToggleRow = ({ label, description, checked, onChange, icon }: ToggleRowProps) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3 flex-1">
        {icon && (
          <div className="text-foreground/60">
            {icon}
          </div>
        )}
        <div>
          <div className="font-secondary font-medium text-foreground">
            {label}
          </div>
          <div className="text-sm text-foreground/70 font-secondary">
            {description}
          </div>
        </div>
      </div>
      
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-contigo-primary' : 'bg-foreground/20'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

/**
 * Componente reutilizable para filas con selector
 */
interface SelectRowProps {
  label: string;
  description: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

const SelectRow = ({ label, description, value, options, onChange, icon }: SelectRowProps) => {
  return (
    <div className="py-3">
      <div className="flex items-center gap-3 mb-2">
        {icon && (
          <div className="text-foreground/60">
            {icon}
          </div>
        )}
        <div>
          <div className="font-secondary font-medium text-foreground">
            {label}
          </div>
          <div className="text-sm text-foreground/70 font-secondary">
            {description}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-xl text-sm font-secondary transition-all ${
              value === option.value
                ? 'bg-contigo-primary text-white'
                : 'bg-glass-white/30 text-foreground hover:bg-glass-white/50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};