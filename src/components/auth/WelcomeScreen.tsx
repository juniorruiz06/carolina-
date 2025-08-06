import { GradientBackground } from "@/components/layout/GradientBackground";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { GlassButton } from "@/components/ui/GlassButton";
import { Heart } from "lucide-react";
import { useState } from "react";
import contigoHeart from "@/assets/contigo-heart.png";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    setIsLoading(true);
    setTimeout(() => {
      onGetStarted();
      setIsLoading(false);
    }, 800);
  };

  return (
    <GradientBackground variant="welcome" className="flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        <GlassContainer size="xl" glow="strong" className="text-center fade-in">
          {/* Logo Section */}
          <div className="mb-8">
            <div className="relative inline-block mb-6">
              <img 
                src={contigoHeart} 
                alt="Contigo Heart" 
                className="w-24 h-24 mx-auto float"
              />
              <div className="absolute inset-0 bg-contigo-heart/20 rounded-full blur-xl" />
            </div>
            
            <h1 className="text-4xl font-primary font-bold gradient-text mb-2">
              Contigo
            </h1>
            <div className="flex items-center justify-center gap-2 text-foreground/80">
              <Heart className="w-5 h-5 text-contigo-heart fill-current" />
              <span className="font-secondary font-medium">Tu espacio para cuidarte</span>
              <Heart className="w-5 h-5 text-contigo-heart fill-current" />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-10 slide-up">
            <p className="text-lg font-secondary text-foreground/90 leading-relaxed">
              Bienvenido a <strong>Contigo</strong>, tu espacio para cuidarte, organizarte y sentirte mejor.
            </p>
            <p className="text-base font-secondary text-foreground/70 mt-4">
              Un asistente digital cariñoso que te acompaña en tu bienestar físico, emocional y académico.
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-3 gap-4 mb-8 slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-center">
              <div className="w-12 h-12 bg-contigo-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Heart className="w-6 h-6 text-contigo-primary" />
              </div>
              <span className="text-sm font-secondary text-foreground/80">Bienestar</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-contigo-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Heart className="w-6 h-6 text-contigo-secondary" />
              </div>
              <span className="text-sm font-secondary text-foreground/80">Organización</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-contigo-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Heart className="w-6 h-6 text-contigo-accent" />
              </div>
              <span className="text-sm font-secondary text-foreground/80">Cuidado</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="slide-up" style={{ animationDelay: '0.4s' }}>
            <GlassButton
              size="lg"
              variant="primary"
              onClick={handleGetStarted}
              disabled={isLoading}
              className="w-full font-bold text-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                  Cargando...
                </div>
              ) : (
                "Comenzar mi viaje"
              )}
            </GlassButton>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm font-secondary text-foreground/60">
              Tu bienestar es nuestra prioridad 💜
            </p>
          </div>
        </GlassContainer>
      </div>
    </GradientBackground>
  );
};