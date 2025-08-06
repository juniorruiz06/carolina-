import { GradientBackground } from "@/components/layout/GradientBackground";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Heart, UserPlus } from "lucide-react";
import contigoHeart from "@/assets/contigo-heart.png";

interface RegisterScreenProps {
  onRegister: (name: string, email: string, password: string) => void;
  onLogin: () => void;
  onBack: () => void;
}

export const RegisterScreen = ({ onRegister, onLogin, onBack }: RegisterScreenProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name) {
      newErrors.name = "El nombre es requerido";
    } else if (formData.name.length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Por favor ingresa un email válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onRegister(formData.name, formData.email, formData.password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <GradientBackground variant="secondary" className="flex items-center justify-center p-6">
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
            <div className="w-16 h-16 bg-contigo-accent/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-contigo-accent" />
            </div>
            <h2 className="text-2xl font-primary font-bold text-foreground mb-2">
              ¡Únete a Contigo!
            </h2>
            <p className="text-foreground/70 font-secondary">
              Comienza tu viaje hacia el bienestar
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <GlassInput
              label="Nombre completo"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Tu nombre"
              error={errors.name}
            />

            <GlassInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="tu-email@ejemplo.com"
              error={errors.email}
            />

            <div className="relative">
              <GlassInput
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
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

            <div className="relative">
              <GlassInput
                label="Confirmar contraseña"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="••••••••"
                error={errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-9 p-1 hover:bg-glass-white rounded-lg transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-foreground/60" />
                ) : (
                  <Eye className="w-5 h-5 text-foreground/60" />
                )}
              </button>
            </div>

            <GlassButton
              type="submit"
              size="lg"
              variant="accent"
              disabled={isLoading}
              className="w-full font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                  Creando cuenta...
                </div>
              ) : (
                "Crear mi cuenta"
              )}
            </GlassButton>
          </form>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-foreground/60 font-secondary leading-relaxed">
              Al registrarte, aceptas cuidar tu bienestar y ser parte de una comunidad que te acompaña.
            </p>
          </div>

          {/* Links */}
          <div className="mt-6 text-center">
            <div className="flex items-center gap-2 justify-center">
              <span className="text-foreground/70 font-secondary text-sm">
                ¿Ya tienes cuenta?
              </span>
              <button
                onClick={onLogin}
                className="text-contigo-primary hover:text-contigo-primary/80 font-secondary font-semibold transition-colors"
              >
                Inicia sesión
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-1 text-foreground/60">
              <Heart className="w-4 h-4 text-contigo-heart fill-current" />
              <span className="text-xs font-secondary">Tu bienestar nos importa</span>
            </div>
          </div>
        </GlassContainer>
      </div>
    </GradientBackground>
  );
};