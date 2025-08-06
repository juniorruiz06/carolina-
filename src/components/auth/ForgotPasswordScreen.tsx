import { GradientBackground } from "@/components/layout/GradientBackground";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { useState } from "react";
import { ArrowLeft, Heart, Mail, CheckCircle } from "lucide-react";
import contigoHeart from "@/assets/contigo-heart.png";

interface ForgotPasswordScreenProps {
  onResetPassword: (email: string) => void;
  onBack: () => void;
}

export const ForgotPasswordScreen = ({ onResetPassword, onBack }: ForgotPasswordScreenProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("El email es requerido");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    setError("");
    setIsLoading(true);
    
    try {
      await onResetPassword(email);
      setEmailSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <GradientBackground variant="primary" className="flex items-center justify-center p-6">
        <div className="w-full max-w-md mx-auto">
          <GlassContainer size="lg" glow="soft" className="text-center fade-in">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-contigo-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-contigo-accent" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-primary font-bold text-foreground mb-4">
              ¡Email enviado!
            </h2>
            
            <p className="text-foreground/80 font-secondary mb-6 leading-relaxed">
              Hemos enviado las instrucciones para restablecer tu contraseña a:
            </p>
            
            <div className="bg-glass-white/50 rounded-2xl p-4 mb-8">
              <p className="font-secondary font-semibold text-foreground">{email}</p>
            </div>

            <p className="text-sm text-foreground/70 font-secondary mb-8">
              Revisa tu bandeja de entrada y sigue las instrucciones. Si no encuentras el email, revisa tu carpeta de spam.
            </p>

            <GlassButton
              size="lg"
              variant="primary"
              onClick={onBack}
              className="w-full font-semibold"
            >
              Volver al inicio
            </GlassButton>

            {/* Footer */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-1 text-foreground/60">
                <Heart className="w-4 h-4 text-contigo-heart fill-current" />
                <span className="text-xs font-secondary">Estamos aquí para ayudarte</span>
              </div>
            </div>
          </GlassContainer>
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground variant="primary" className="flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        <GlassContainer size="lg" glow="soft" className="fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="p-2 hover:bg-glass-white rounded-2xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            
            <div className="flex items-center gap-2">
              <img src={contigoHeart} alt="Contigo" className="w-8 h-8" />
              <span className="text-xl font-primary font-semibold text-foreground">Contigo</span>
            </div>
            
            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-contigo-secondary/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-contigo-secondary" />
            </div>
            <h2 className="text-2xl font-primary font-bold text-foreground mb-2">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="text-foreground/70 font-secondary">
              No te preocupes, te ayudamos a recuperarla
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-glass-white/30 rounded-2xl p-4 mb-6">
            <p className="text-sm text-foreground/80 font-secondary text-center">
              Ingresa tu email y te enviaremos las instrucciones para crear una nueva contraseña.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <GlassInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="tu-email@ejemplo.com"
              error={error}
            />

            <GlassButton
              type="submit"
              size="lg"
              variant="secondary"
              disabled={isLoading}
              className="w-full font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                  Enviando...
                </div>
              ) : (
                "Enviar instrucciones"
              )}
            </GlassButton>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-contigo-primary hover:text-contigo-primary/80 font-secondary font-medium transition-colors"
            >
              ← Volver al inicio de sesión
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-1 text-foreground/60">
              <Heart className="w-4 h-4 text-contigo-heart fill-current" />
              <span className="text-xs font-secondary">Siempre contigo</span>
            </div>
          </div>
        </GlassContainer>
      </div>
    </GradientBackground>
  );
};