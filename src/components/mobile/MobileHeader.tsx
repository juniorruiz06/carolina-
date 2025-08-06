import { ReactNode } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import contigoHeart from "@/assets/contigo-heart.png";

/**
 * Header móvil reutilizable
 * Optimizado para navegación en dispositivos móviles
 */

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onMenu?: () => void;
  rightAction?: ReactNode;
  variant?: 'default' | 'transparent' | 'solid';
  showLogo?: boolean;
  className?: string;
}

export const MobileHeader = ({
  title,
  subtitle,
  onBack,
  onMenu,
  rightAction,
  variant = 'default',
  showLogo = false,
  className = ""
}: MobileHeaderProps) => {
  const getBackgroundClass = () => {
    switch (variant) {
      case 'transparent':
        return 'bg-transparent';
      case 'solid':
        return 'bg-background';
      default:
        return 'bg-background/80 backdrop-blur-xl';
    }
  };

  return (
    <div className={`
      sticky top-0 z-40 w-full border-b border-glass-white/20 
      ${getBackgroundClass()} safe-area-top ${className}
    `}>
      <div className="flex items-center justify-between px-4 py-3 h-16">
        {/* Left side - Back button or Logo */}
        <div className="flex items-center gap-3 flex-1">
          {onBack ? (
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={onBack}
              className="w-10 h-10 p-0 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </GlassButton>
          ) : showLogo ? (
            <img src={contigoHeart} alt="Contigo" className="w-8 h-8" />
          ) : (
            <div className="w-10" /> // Spacer
          )}
          
          {/* Title and subtitle */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-primary font-bold text-foreground truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-foreground/70 font-secondary truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right side - Action or Menu */}
        <div className="flex items-center gap-2">
          {rightAction || (
            onMenu && (
              <GlassButton
                variant="secondary"
                size="sm"
                onClick={onMenu}
                className="w-10 h-10 p-0 flex items-center justify-center"
              >
                <MoreVertical className="w-5 h-5" />
              </GlassButton>
            )
          )}
        </div>
      </div>
    </div>
  );
};