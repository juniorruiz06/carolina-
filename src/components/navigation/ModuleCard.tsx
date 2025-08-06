import { LucideIcon } from "lucide-react";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { GlassButton } from "@/components/ui/GlassButton";

/**
 * Tarjeta modular para representar cada módulo del sistema
 * Diseñada para ser reutilizable y escalable
 */

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  isEnabled: boolean;
  isComingSoon?: boolean;
  lastAccessed?: Date;
  stats?: {
    label: string;
    value: string | number;
  };
  onClick: () => void;
}

export const ModuleCard = ({
  title,
  description,
  icon: Icon,
  color,
  isEnabled,
  isComingSoon = false,
  lastAccessed,
  stats,
  onClick,
}: ModuleCardProps) => {
  const formatLastAccessed = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Hace unos minutos";
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInHours < 48) return "Ayer";
    return date.toLocaleDateString();
  };

  return (
    <GlassContainer 
      className={`relative transition-all duration-300 hover:scale-[1.02] ${
        !isEnabled ? 'opacity-60' : ''
      }`}
    >
      {/* Coming Soon Badge */}
      {isComingSoon && (
        <div className="absolute -top-2 -right-2 bg-contigo-accent text-white text-xs font-semibold px-3 py-1 rounded-full border-2 border-background z-10">
          Próximamente
        </div>
      )}

      {/* Header con icono y título */}
      <div className="flex items-start gap-4 mb-4">
        <div 
          className={`w-14 h-14 rounded-2xl flex items-center justify-center`}
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon 
            className="w-7 h-7" 
            style={{ color }} 
          />
        </div>
        
        <div className="flex-1">
          <h3 className="font-primary font-semibold text-foreground text-lg mb-1">
            {title}
          </h3>
          <p className="text-sm text-foreground/70 font-secondary leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Estadísticas si están disponibles */}
      {stats && isEnabled && !isComingSoon && (
        <div className="bg-glass-white/30 rounded-xl p-3 mb-4">
          <div className="text-center">
            <div className="text-xl font-primary font-bold text-foreground mb-1">
              {stats.value}
            </div>
            <div className="text-xs text-foreground/70 font-secondary">
              {stats.label}
            </div>
          </div>
        </div>
      )}

      {/* Última actividad */}
      {lastAccessed && isEnabled && !isComingSoon && (
        <div className="text-xs text-foreground/60 font-secondary mb-4">
          <span>Último acceso: {formatLastAccessed(lastAccessed)}</span>
        </div>
      )}

      {/* Botón de acción */}
      <GlassButton
        size="sm"
        variant={isEnabled && !isComingSoon ? "primary" : "secondary"}
        onClick={onClick}
        disabled={!isEnabled}
        className="w-full font-semibold"
      >
        {isComingSoon 
          ? "Próximamente" 
          : isEnabled 
            ? "Abrir módulo" 
            : "No disponible"
        }
      </GlassButton>

      {/* Estado visual si está deshabilitado */}
      {!isEnabled && !isComingSoon && (
        <div className="absolute inset-0 bg-background/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
          <div className="text-foreground/60 font-secondary text-sm text-center">
            Módulo no disponible
          </div>
        </div>
      )}
    </GlassContainer>
  );
};