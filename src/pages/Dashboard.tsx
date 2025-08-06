import { GradientBackground } from "@/components/layout/GradientBackground";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { GlassButton } from "@/components/ui/GlassButton";
import { ModuleCard } from "@/components/navigation/ModuleCard";
import { Profile } from "./Profile";
import { Settings } from "./Settings";
import { HealthModule } from "./modules/HealthModule";
import { EmotionalModule } from "./modules/EmotionalModule";
import { AcademicModule } from "./modules/AcademicModule";
import { AIModule } from "./modules/AIModule";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { 
  Heart, 
  User, 
  Settings as SettingsIcon, 
  LogOut, 
  Brain,
  BookOpen,
  Activity,
  MessageCircle,
  Calendar,
  Target,
  Smile
} from "lucide-react";
import contigoHeart from "@/assets/contigo-heart.png";

type CurrentScreen = 'dashboard' | 'profile' | 'settings' | 'health' | 'emotional' | 'academic' | 'ai';

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('dashboard');

  // Render individual modules
  if (currentScreen === 'profile') {
    return <Profile onBack={() => setCurrentScreen('dashboard')} />;
  }

  if (currentScreen === 'settings') {
    return <Settings onBack={() => setCurrentScreen('dashboard')} />;
  }

  if (currentScreen === 'health') {
    return <HealthModule onBack={() => setCurrentScreen('dashboard')} />;
  }

  if (currentScreen === 'emotional') {
    return <EmotionalModule onBack={() => setCurrentScreen('dashboard')} />;
  }

  if (currentScreen === 'academic') {
    return <AcademicModule onBack={() => setCurrentScreen('dashboard')} />;
  }

  if (currentScreen === 'ai') {
    return <AIModule onBack={() => setCurrentScreen('dashboard')} />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  // Configuración de módulos del sistema - Ahora habilitados para demo
  const modules = [
    {
      title: "Módulo de Salud",
      description: "Recordatorios médicos, medicamentos y citas",
      icon: Activity,
      color: "#10B981", // verde
      isEnabled: true, // Habilitado para demo
      isComingSoon: false,
      onClick: () => setCurrentScreen('health'),
    },
    {
      title: "Módulo Emocional", 
      description: "Diario personal y frases motivacionales",
      icon: Smile,
      color: "#F59E0B", // amarillo
      isEnabled: true, // Habilitado para demo
      isComingSoon: false,
      onClick: () => setCurrentScreen('emotional'),
    },
    {
      title: "Módulo Académico",
      description: "Gestión de tareas y técnica Pomodoro",
      icon: BookOpen,
      color: "#3B82F6", // azul
      isEnabled: true, // Habilitado para demo
      isComingSoon: false,
      onClick: () => setCurrentScreen('academic'),
    },
    {
      title: "IA Asistente",
      description: "Chat inteligente y asistencia personalizada",
      icon: Brain,
      color: "#8B5CF6", // púrpura
      isEnabled: true, // Habilitado para demo
      isComingSoon: false,
      onClick: () => setCurrentScreen('ai'),
    },
  ];

  return (
    <GradientBackground variant="primary" className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <GlassContainer size="sm" className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={contigoHeart} alt="Contigo" className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-primary font-bold text-foreground">Contigo</h1>
                <p className="text-sm text-foreground/70 font-secondary">Tu compañero de bienestar</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-foreground/80">
                <User className="w-5 h-5" />
                <span className="font-secondary text-sm">
                  {user?.user_metadata?.full_name || user?.email}
                </span>
              </div>
              <GlassButton
                variant="secondary"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </GlassButton>
            </div>
          </div>
        </GlassContainer>

        {/* Welcome Section */}
        <GlassContainer size="lg" glow="soft" className="text-center mb-8">
          <div className="w-20 h-20 bg-contigo-heart/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-contigo-heart fill-current" />
          </div>
          
          <h2 className="text-3xl font-primary font-bold text-foreground mb-4">
            ¡Bienvenido de vuelta!
          </h2>
          
          <p className="text-lg text-foreground/80 font-secondary mb-6">
            Nos alegra verte de nuevo. ¿Cómo te sientes hoy?
          </p>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassButton
              size="lg"
              variant="primary"
              onClick={() => setCurrentScreen('profile')}
              className="h-auto p-6 flex flex-col gap-3"
            >
              <User className="w-8 h-8 text-white" />
              <div>
                <div className="font-semibold text-white">Mi Perfil</div>
                <div className="text-sm text-white/80">Ver y editar información</div>
              </div>
            </GlassButton>

            <GlassButton
              size="lg"
              variant="secondary"
              onClick={() => setCurrentScreen('settings')}
              className="h-auto p-6 flex flex-col gap-3"
            >
              <SettingsIcon className="w-8 h-8 text-contigo-secondary" />
              <div>
                <div className="font-semibold text-foreground">Configuración</div>
                <div className="text-sm text-foreground/70">Personaliza tu experiencia</div>
              </div>
            </GlassButton>

            <GlassButton
              size="lg"
              variant="accent"
              className="h-auto p-6 flex flex-col gap-3"
            >
              <Heart className="w-8 h-8 text-white" />
              <div>
                <div className="font-semibold text-white">Estado de ánimo</div>
                <div className="text-sm text-white/80">Registra cómo te sientes</div>
              </div>
            </GlassButton>
          </div>
        </GlassContainer>

        {/* Modules Section */}
        <div className="mb-8">
          <h3 className="text-xl font-primary font-bold text-foreground mb-6 text-center">
            Módulos del Sistema
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module, index) => (
              <ModuleCard
                key={index}
                title={module.title}
                description={module.description}
                icon={module.icon}
                color={module.color}
                isEnabled={module.isEnabled}
                isComingSoon={module.isComingSoon}
                onClick={module.onClick}
              />
            ))}
          </div>
        </div>

        {/* Progress Section */}
        <GlassContainer>
          <h3 className="text-lg font-primary font-semibold text-foreground mb-4 text-center">
            Tu Progreso
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-contigo-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-contigo-primary" />
              </div>
              <h4 className="font-primary font-semibold text-foreground mb-1">Días activos</h4>
              <p className="text-2xl font-primary font-bold text-contigo-primary mb-1">1</p>
              <p className="text-sm text-foreground/70 font-secondary">¡Estás empezando!</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-contigo-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-contigo-secondary" />
              </div>
              <h4 className="font-primary font-semibold text-foreground mb-1">Objetivos</h4>
              <p className="text-2xl font-primary font-bold text-contigo-secondary mb-1">0</p>
              <p className="text-sm text-foreground/70 font-secondary">Define tus metas</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-contigo-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Smile className="w-6 h-6 text-contigo-accent" />
              </div>
              <h4 className="font-primary font-semibold text-foreground mb-1">Bienestar</h4>
              <p className="text-2xl font-primary font-bold text-contigo-accent mb-1">Nuevo</p>
              <p className="text-sm text-foreground/70 font-secondary">Comienza tu viaje</p>
            </div>
          </div>
        </GlassContainer>
      </div>
    </GradientBackground>
  );
};