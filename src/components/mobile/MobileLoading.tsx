import { ReactNode } from "react";
import { Heart, Sparkles } from "lucide-react";
import contigoHeart from "@/assets/contigo-heart.png";

/**
 * Pantalla de carga optimizada para móvil
 * Diseño atractivo con animaciones suaves
 */

interface MobileLoadingProps {
  message?: string;
  submessage?: string;
  showLogo?: boolean;
  children?: ReactNode;
}

export const MobileLoading = ({ 
  message = "Cargando...", 
  submessage = "Preparando tu experiencia",
  showLogo = true,
  children 
}: MobileLoadingProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gradient-primary">
      {/* Logo animado */}
      {showLogo && (
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-glass-white/30 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
            <img 
              src={contigoHeart} 
              alt="Contigo" 
              className="w-16 h-16 animate-bounce"
            />
          </div>
          
          {/* Floating particles */}
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-contigo-accent animate-pulse" />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <Heart className="w-5 h-5 text-contigo-heart animate-pulse fill-current" />
          </div>
        </div>
      )}

      {/* Loading content */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-primary font-bold text-foreground mb-2">
          {message}
        </h2>
        <p className="text-foreground/70 font-secondary">
          {submessage}
        </p>
      </div>

      {/* Animated loading bar */}
      <div className="w-64 h-2 bg-glass-white/20 rounded-full overflow-hidden mb-8">
        <div className="h-full bg-gradient-to-r from-contigo-primary via-contigo-secondary to-contigo-accent animate-pulse" 
             style={{
               width: '100%',
               animation: 'loading-bar 2s ease-in-out infinite'
             }} />
      </div>

      {/* Custom content */}
      {children}

      {/* Floating animation dots */}
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-contigo-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
        <div className="w-3 h-3 bg-contigo-secondary rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
        <div className="w-3 h-3 bg-contigo-accent rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
      </div>
    </div>
  );
};