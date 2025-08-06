import { GradientBackground } from "@/components/layout/GradientBackground";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Heart } from "lucide-react";
import contigoHeart from "@/assets/contigo-heart.png";

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
  onBack: () => void;
}

export const LoginScreen = ({ onLogin, onForgotPassword, onSignUp, onBack }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "El email es requerido";
    } else if (!validateEmail(email)) {
      newErrors.email = "Por favor ingresa un email válido";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onLogin(email, password);
    } finally {
      setIsLoading(false);
    }
  };

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
            <h2 className="text-2xl font-primary font-bold text-foreground mb-2">
              ¡Te extrañamos!
            </h2>
            <p className="text-foreground/70 font-secondary">
              Inicia sesión para continuar cuidándote
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <GlassInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu-email@ejemplo.com"
              error={errors.email}
            />

            <div className="relative">
              <GlassInput
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-9 p-1 hover:bg-glass-white rounded-lg transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-foreground/60" />
                ) : (
                  <Eye className="w-5 h-5 text-foreground/60" />
                )}
              </button>
            </div>

            <GlassButton
              type="submit"
              size="lg"
              variant="primary"
              disabled={isLoading}
              className="w-full font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </GlassButton>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-4 text-center">
            <button
              onClick={onForgotPassword}
              className="text-contigo-primary hover:text-contigo-primary/80 font-secondary font-medium transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>

            <div className="flex items-center gap-2 justify-center">
              <span className="text-foreground/70 font-secondary text-sm">
                ¿No tienes cuenta?
              </span>
              <button
                onClick={onSignUp}
                className="text-contigo-heart hover:text-contigo-heart/80 font-secondary font-semibold transition-colors"
              >
                Regístrate aquí
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-1 text-foreground/60">
              <Heart className="w-4 h-4 text-contigo-heart fill-current" />
              <span className="text-xs font-secondary">Nos importa tu bienestar</span>
            </div>
          </div>
        </GlassContainer>
      </div>
    </GradientBackground>
  );
};