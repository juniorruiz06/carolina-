import { useState } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { MobileTabBar } from "@/components/mobile/MobileTabBar";
import { MobileSheet } from "@/components/mobile/MobileSheet";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { GlassButton } from "@/components/ui/GlassButton";
import { VoiceJarvis } from "@/components/voice/VoiceJarvis";
import { HealthModule } from "@/components/modules/HealthModule";
import { EmotionalModule } from "@/components/modules/EmotionalModule";
import { AcademicModule } from "@/components/modules/AcademicModule";
import { AIModule } from "@/pages/modules/AIModule";
import { Profile } from "@/pages/Profile";
import { useAuth } from "@/hooks/useAuth";
import { useUserNotifications } from "@/hooks/useUserNotifications";
import { useQuickActions } from "@/hooks/useQuickActions";
import { 
  Home, 
  Heart, 
  Brain, 
  Settings,
  User,
  Activity,
  BookOpen,
  Smile,
  Plus,
  Bell,
  Search,
  Calendar,
  Target,
  Sparkles,
  LogOut,
  Bot,
  Clock,
  Trash2,
  Check,
  X,
  AlertCircle,
  Info,
  CheckCircle
} from "lucide-react";

/**
 * Dashboard principal optimizado para móvil
 * Navegación tipo app nativa con tabs inferiores
 */

type MobileScreen = 'home' | 'health' | 'emotional' | 'academic' | 'ai' | 'profile';

export const MobileDashboard = () => {
  const { user, signOut } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useUserNotifications();
  const { quickActions, executeAction } = useQuickActions();
  
  const [activeScreen, setActiveScreen] = useState<MobileScreen>('home');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showVoiceJarvis, setShowVoiceJarvis] = useState(false);

  // Debug logging
  console.log('MobileDashboard: User authenticated:', !!user);
  console.log('MobileDashboard: Active screen:', activeScreen);
  console.log('MobileDashboard: Voice Jarvis visible:', showVoiceJarvis);
  console.log('MobileDashboard: Notifications count:', notifications.length);
  console.log('MobileDashboard: Quick actions count:', quickActions.length);

  const tabBarItems = [
    {
      id: 'home',
      label: 'Inicio',
      icon: Home,
      onClick: () => setActiveScreen('home')
    },
    {
      id: 'health',
      label: 'Salud',
      icon: Activity,
      badge: 3,
      onClick: () => setActiveScreen('health')
    },
    {
      id: 'emotional',
      label: 'Emocional',
      icon: Heart,
      onClick: () => setActiveScreen('emotional')
    },
    {
      id: 'academic',
      label: 'Académico',
      icon: BookOpen,
      badge: 2,
      onClick: () => setActiveScreen('academic')
    },
    {
      id: 'ai',
      label: 'IA Chat',
      icon: Brain,
      onClick: () => setActiveScreen('ai')
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
      onClick: () => setActiveScreen('profile')
    }
  ];

  // Función auxiliar para obtener el icono según el tipo de notificación
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return X;
      case 'reminder': return Clock;
      default: return Info;
    }
  };

  // Función auxiliar para obtener el color según el tipo de notificación
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      case 'reminder': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const renderHomeScreen = () => (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <GlassContainer className="text-center">
        <div className="w-16 h-16 bg-contigo-heart/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-contigo-heart fill-current" />
        </div>
        <h2 className="text-xl font-primary font-bold text-foreground mb-2">
          ¡Hola {user?.user_metadata?.display_name || 'Usuario'}! 👋
        </h2>
        <p className="text-foreground/70 font-secondary">
          ¿Cómo te sientes hoy?
        </p>
      </GlassContainer>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <GlassContainer className="text-center">
          <Target className="w-8 h-8 text-contigo-primary mx-auto mb-2" />
          <div className="text-2xl font-primary font-bold text-contigo-primary">85%</div>
          <div className="text-sm text-foreground/70 font-secondary">Progreso semanal</div>
        </GlassContainer>
        
        <GlassContainer className="text-center">
          <Sparkles className="w-8 h-8 text-contigo-secondary mx-auto mb-2" />
          <div className="text-2xl font-primary font-bold text-contigo-secondary">7</div>
          <div className="text-sm text-foreground/70 font-secondary">Días activos</div>
        </GlassContainer>
      </div>

      {/* Today's Tasks */}
      <GlassContainer>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-primary font-semibold text-foreground">
            Tareas de Hoy
          </h3>
          <GlassButton variant="secondary" size="sm">
            Ver todas
          </GlassButton>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-glass-white/20 rounded-xl">
            <div className="w-6 h-6 border-2 border-contigo-primary rounded-full" />
            <div className="flex-1">
              <div className="font-secondary font-medium text-foreground">Tomar vitaminas</div>
              <div className="text-sm text-foreground/70">09:00 • Salud</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-glass-white/20 rounded-xl">
            <div className="w-6 h-6 bg-contigo-secondary rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <div className="flex-1">
              <div className="font-secondary font-medium text-foreground">Escribir en diario</div>
              <div className="text-sm text-foreground/70">Completado • Emocional</div>
            </div>
          </div>
        </div>
      </GlassContainer>

      {/* Modules Grid */}
      <div className="grid grid-cols-2 gap-4">
        <GlassButton 
          variant="primary" 
          className="h-24 flex flex-col gap-2 p-4"
          onClick={() => setActiveScreen('health')}
        >
          <Activity className="w-8 h-8" />
          <span className="font-secondary">Salud</span>
        </GlassButton>

        <GlassButton 
          variant="secondary" 
          className="h-24 flex flex-col gap-2 p-4"
          onClick={() => setActiveScreen('emotional')}
        >
          <Smile className="w-8 h-8" />
          <span className="font-secondary">Emocional</span>
        </GlassButton>

        <GlassButton 
          variant="accent" 
          className="h-24 flex flex-col gap-2 p-4"
          onClick={() => setActiveScreen('academic')}
        >
          <BookOpen className="w-8 h-8" />
          <span className="font-secondary">Académico</span>
        </GlassButton>

        <GlassButton 
          variant="primary" 
          className="h-24 flex flex-col gap-2 p-4"
          onClick={() => setShowQuickActions(true)}
        >
          <Brain className="w-8 h-8" />
          <span className="font-secondary">IA Chat</span>
        </GlassButton>
      </div>
    </div>
  );

  const renderModuleScreen = (type: string) => {
    switch (type) {
      case 'health':
        return <HealthModule />;
      case 'emotional':
        return <EmotionalModule />;
      case 'academic':
        return <AcademicModule />;
      case 'ai':
        return <AIModule onBack={() => setActiveScreen('home')} />;
      default:
        return (
          <div className="p-4">
            <GlassContainer size="lg" className="text-center">
              <div className="w-20 h-20 bg-contigo-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                {type === 'health' && <Activity className="w-10 h-10 text-contigo-primary" />}
                {type === 'emotional' && <Heart className="w-10 h-10 text-contigo-heart" />}
                {type === 'academic' && <BookOpen className="w-10 h-10 text-contigo-secondary" />}
                {type === 'ai' && <Brain className="w-10 h-10 text-purple-500" />}
              </div>
              
              <h2 className="text-2xl font-primary font-bold text-foreground mb-4">
                Módulo {type === 'health' ? 'de Salud' : type === 'emotional' ? 'Emocional' : type === 'academic' ? 'Académico' : 'de IA'}
              </h2>
              
              <p className="text-foreground/70 font-secondary mb-6">
                Esta sección está en desarrollo. Pronto tendrás acceso completo a todas las funcionalidades.
              </p>

              <GlassButton variant="primary" className="w-full">
                Próximamente disponible
              </GlassButton>
            </GlassContainer>
          </div>
        );
    }
  };

  const renderProfileScreen = () => (
    <Profile onBack={() => setActiveScreen('home')} />
  );

  const renderContent = () => {
    switch (activeScreen) {
      case 'home':
        return renderHomeScreen();
      case 'health':
        return renderModuleScreen('health');
      case 'emotional':
        return renderModuleScreen('emotional');
      case 'academic':
        return renderModuleScreen('academic');
      case 'ai':
        return renderModuleScreen('ai');
      case 'profile':
        return renderProfileScreen();
      default:
        return renderHomeScreen();
    }
  };

  return (
    <MobileLayout
      header={
        <MobileHeader
          title={activeScreen === 'home' ? 'Contigo' : 
                activeScreen === 'health' ? 'Salud' :
                activeScreen === 'emotional' ? 'Emocional' :
                activeScreen === 'academic' ? 'Académico' : 
                activeScreen === 'ai' ? 'IA Asistente' : 'Perfil'}
          subtitle="Tu compañero de bienestar"
          showLogo={activeScreen === 'home'}
          rightAction={
            activeScreen !== 'ai' && (
              <div className="flex items-center gap-2">
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowNotifications(true)}
                  className="w-10 h-10 p-0 flex items-center justify-center relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{unreadCount}</span>
                    </div>
                  )}
                </GlassButton>
                
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowQuickActions(true)}
                  className="w-10 h-10 p-0 flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </GlassButton>
              </div>
            )
          }
        />
      }
      footer={
        <MobileTabBar
          items={tabBarItems}
          activeTab={activeScreen}
        />
      }
    >
      {renderContent()}

      {/* Quick Actions Sheet */}
      <MobileSheet
        isOpen={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        title="Acciones Rápidas"
        size="md"
      >
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => {
            // Función auxiliar para obtener el componente de icono dinámicamente
            const getIconComponent = (iconName: string) => {
              const iconMap: Record<string, any> = {
                Plus, Heart, Calendar, Brain, Target, Clock, Activity, BookOpen, User, Settings
              };
              return iconMap[iconName] || Plus;
            };

            const IconComponent = getIconComponent(action.icon_name);

            return (
              <GlassButton
                key={action.id}
                variant="secondary"
                className="h-20 flex flex-col gap-2 p-4"
                onClick={() => {
                  executeAction(action);
                  setShowQuickActions(false);
                }}
              >
                <IconComponent 
                  className="w-8 h-8" 
                  style={{ color: action.color }} 
                />
                <span className="font-secondary text-sm">{action.title}</span>
              </GlassButton>
            );
          })}
        </div>
      </MobileSheet>

      {/* Notifications Sheet */}
      <MobileSheet
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="Notificaciones"
        size="lg"
      >
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-foreground/30 mx-auto mb-3" />
              <p className="text-foreground/70 font-secondary">No tienes notificaciones</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-foreground/70">{unreadCount} no leídas</span>
                {unreadCount > 0 && (
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Marcar todas como leídas
                  </GlassButton>
                )}
              </div>
              
              {notifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                const iconColor = getNotificationColor(notification.type);
                
                return (
                  <div 
                    key={notification.id} 
                    className={`flex items-start gap-3 p-4 rounded-xl transition-all ${
                      notification.is_read 
                        ? 'bg-glass-white/10' 
                        : 'bg-glass-white/20 border border-contigo-primary/30'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 mt-0.5 ${iconColor}`} />
                    <div className="flex-1 min-w-0">
                      <div className={`font-secondary font-medium text-foreground ${
                        !notification.is_read ? 'font-semibold' : ''
                      }`}>
                        {notification.title}
                      </div>
                      <div className="text-sm text-foreground/70 line-clamp-2 mt-1">
                        {notification.message}
                      </div>
                      <div className="text-xs text-foreground/50 mt-2">
                        {new Date(notification.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-contigo-primary/20 hover:bg-contigo-primary/30 transition-colors"
                        >
                          <Check className="w-3 h-3 text-contigo-primary" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </MobileSheet>

      {/* Voice Assistant - Jarvis */}
      {showVoiceJarvis && (
        <VoiceJarvis onClose={() => setShowVoiceJarvis(false)} />
      )}

      {/* Floating Voice Assistant Button */}
      {!showVoiceJarvis && (
        <div className="fixed bottom-8 right-6 z-50">
          <GlassButton
            variant="primary"
            size="lg"
            onClick={() => setShowVoiceJarvis(true)}
            className="w-16 h-16 rounded-full p-0 flex items-center justify-center shadow-lg animate-pulse"
          >
            <Bot className="w-8 h-8 text-foreground" />
          </GlassButton>
        </div>
      )}
    </MobileLayout>
  );
};