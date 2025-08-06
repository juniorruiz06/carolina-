import { useState } from "react";
import { GradientBackground } from "@/components/layout/GradientBackground";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { useToast } from "@/components/ui/use-toast";
import { AIAgentsPanel } from "@/components/ai/AIAgentsPanel";
import { useClaudeAI } from "@/hooks/useClaudeAI";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  Brain, 
  MessageCircle, 
  Sparkles,
  Send,
  Bot,
  User,
  Settings,
  AlertCircle,
  Lightbulb,
  Heart,
  BookOpen,
  Activity,
  Loader2
} from "lucide-react";
import contigoHeart from "@/assets/contigo-heart.png";

/**
 * Módulo IA - Chat inteligente y asistencia personalizada
 * Estructura preparada para futuras implementaciones
 */

interface AIModuleProps {
  onBack: () => void;
}

type AISection = 'overview' | 'chat' | 'settings' | 'suggestions' | 'agents';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIModule = ({ onBack }: AIModuleProps) => {
  const [currentSection, setCurrentSection] = useState<AISection>('overview');
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState<string>();
  const { toast } = useToast();
  const { isLoading, getEmotionalSupport } = useClaudeAI();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy ContigoIA, tu asistente personal inteligente. Estoy aquí para acompañarte en tu bienestar emocional, académico y de salud. Puedo ayudarte con técnicas de estudio, manejo del estrés, motivación, hábitos saludables y mucho más. ¿En qué puedo asistirte hoy?',
      timestamp: new Date()
    }
  ]);

  const aiCapabilities = [
    {
      title: "Apoyo Emocional",
      description: "Te acompaño en momentos difíciles y celebro tus logros",
      icon: Heart,
      color: "#EF4444"
    },
    {
      title: "Asistencia Académica", 
      description: "Te ayudo con técnicas de estudio y organización",
      icon: BookOpen,
      color: "#3B82F6"
    },
    {
      title: "Consejos de Salud",
      description: "Sugiero hábitos saludables y recordatorios de bienestar",
      icon: Activity,
      color: "#10B981"
    },
    {
      title: "Motivación Diaria",
      description: "Te inspiro con frases y reflexiones personalizadas",
      icon: Sparkles,
      color: "#8B5CF6"
    }
  ];

  const quickSuggestions = [
    "¿Cómo puedo mejorar mi concentración?",
    "Me siento abrumado, ¿qué hago?",
    "Ayúdame a organizar mis tareas",
    "Necesito motivación para estudiar",
    "¿Cómo puedo dormir mejor?",
    "Quiero crear buenos hábitos"
  ];

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage("");

    try {
      // Usar Supabase Edge Function para Claude AI (más seguro)
      const { data, error } = await supabase.functions.invoke('claude-chat', {
        body: {
          messages: [...chatMessages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          userContext: "Usuario de la app Contigo enfocada en bienestar integral",
          sessionId: sessionId
        }
      });

      if (error) {
        throw error;
      }

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data?.message || 'Lo siento, no pude procesar tu mensaje en este momento.',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiResponse]);

      // Actualizar sessionId si es nuevo
      if (data?.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Intentar con el método directo como fallback
      try {
        const response = await getEmotionalSupport(
          'conversación general', 
          `El usuario pregunta: ${currentMessage}. Proporciona una respuesta empática, útil y personalizada como ContigoIA, el asistente de bienestar integral.`
        );

        if (response) {
          const aiResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response,
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, aiResponse]);
          return;
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
      
      // Respuesta de error más amigable
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '😅 Parece que tengo un pequeño problema técnico. Para usar Claude AI necesitas: \n\n1. Configurar la API key en .env: VITE_ANTHROPIC_API_KEY=tu_clave \n2. O configurar la Edge Function de Supabase con la clave \n\n¡Una vez configurado, podré ayudarte con consejos personalizados!',
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, errorResponse]);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Introducción a la IA */}
      <GlassContainer>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-purple-500" />
          </div>
          <h2 className="text-xl font-primary font-bold text-foreground">
            Tu Asistente Inteligente
          </h2>
        </div>

        <div className="bg-glass-white/30 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="font-primary font-semibold text-foreground mb-2">
                ¡Hola! Soy ContigoIA
              </h3>
              <p className="text-foreground/80 font-secondary leading-relaxed">
                Estoy aquí para acompañarte en tu journey de bienestar. Puedo ayudarte con consejos 
                personalizados, motivación, organización académica y apoyo emocional. ¿Qué te gustaría 
                explorar hoy?
              </p>
            </div>
          </div>
        </div>

        <GlassButton 
          variant="primary" 
          className="w-full"
          onClick={() => setCurrentSection('chat')}
        >
          Comenzar conversación
        </GlassButton>
      </GlassContainer>

      {/* Capacidades de la IA */}
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-6">
          ¿Cómo puedo ayudarte?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiCapabilities.map((capability, index) => (
            <div key={index} className="bg-glass-white/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${capability.color}20` }}
                >
                  <capability.icon className="w-5 h-5" style={{ color: capability.color }} />
                </div>
                <div>
                  <h4 className="font-secondary font-semibold text-foreground mb-1">
                    {capability.title}
                  </h4>
                  <p className="text-sm text-foreground/70 font-secondary">
                    {capability.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassContainer>

      {/* Sugerencias rápidas */}
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          Preguntas Frecuentes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setMessage(suggestion);
                setCurrentSection('chat');
              }}
              className="text-left p-3 bg-glass-white/20 rounded-xl hover:bg-glass-white/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <span className="text-sm font-secondary text-foreground">
                  {suggestion}
                </span>
              </div>
            </button>
          ))}
        </div>
      </GlassContainer>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassButton 
          variant="primary" 
          className="h-20 flex flex-col gap-2"
          onClick={() => setCurrentSection('chat')}
        >
          <MessageCircle className="w-6 h-6" />
          <span>Chat con IA</span>
        </GlassButton>

        <GlassButton 
          variant="secondary" 
          className="h-20 flex flex-col gap-2"
          onClick={() => setCurrentSection('agents')}
        >
          <Bot className="w-6 h-6" />
          <span>Agentes IA</span>
        </GlassButton>

        <GlassButton 
          variant="secondary" 
          className="h-20 flex flex-col gap-2"
          onClick={() => setCurrentSection('suggestions')}
        >
          <Lightbulb className="w-6 h-6" />
          <span>Sugerencias</span>
        </GlassButton>

        <GlassButton 
          variant="accent" 
          className="h-20 flex flex-col gap-2"
          onClick={() => setCurrentSection('settings')}
        >
          <Settings className="w-6 h-6" />
          <span>Configurar IA</span>
        </GlassButton>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="space-y-6">
      {/* Chat Container */}
      <GlassContainer className="h-96 flex flex-col">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-glass-white/20">
          <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-secondary font-semibold text-foreground">ContigoIA</h3>
            <p className="text-xs text-foreground/70">Asistente personal</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-purple-500" />
                </div>
              )}
              
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-contigo-primary text-white' 
                  : 'bg-glass-white/30 text-foreground'
              }`}>
                <p className="text-sm font-secondary">{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.role === 'user' ? 'text-white/70' : 'text-foreground/50'
                }`}>
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-contigo-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-contigo-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex gap-3">
          <GlassInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1"
            disabled={isLoading}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          />
          <GlassButton 
            variant="primary" 
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </GlassButton>
        </div>
      </GlassContainer>

      {/* Quick Suggestions */}
      <GlassContainer>
        <h4 className="font-secondary font-medium text-foreground mb-3">Sugerencias rápidas:</h4>
        <div className="flex flex-wrap gap-2">
          {quickSuggestions.slice(0, 4).map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setMessage(suggestion)}
              className="px-3 py-2 bg-glass-white/20 rounded-xl text-xs font-secondary text-foreground hover:bg-glass-white/30 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </GlassContainer>
    </div>
  );

  const renderComingSoon = (title: string, description: string) => (
    <GlassContainer size="lg" className="text-center">
      <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-10 h-10 text-purple-500" />
      </div>
      
      <h2 className="text-2xl font-primary font-bold text-foreground mb-4">
        {title}
      </h2>
      
      <p className="text-foreground/70 font-secondary mb-6">
        {description}
      </p>

      <GlassButton 
        variant="secondary" 
        onClick={() => setCurrentSection('overview')}
      >
        Volver al resumen
      </GlassButton>
    </GlassContainer>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'overview':
        return renderOverview();
      case 'chat':
        return renderChat();
      case 'agents':
        return <AIAgentsPanel />;
      case 'suggestions':
        return renderComingSoon(
          "Sugerencias Personalizadas",
          "Pronto recibirás sugerencias inteligentes basadas en tus patrones de uso y necesidades específicas."
        );
      case 'settings':
        return renderComingSoon(
          "Configuración de IA",
          "Personaliza el comportamiento de tu asistente, el tipo de respuestas y las áreas en las que quieres que te ayude más."
        );
      default:
        return renderOverview();
    }
  };

  return (
    <GradientBackground variant="primary" className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
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
                <div>
                  <h1 className="text-xl font-primary font-bold text-foreground">IA Asistente</h1>
                  <p className="text-sm text-foreground/70 font-secondary">Tu compañero inteligente</p>
                </div>
              </div>
            </div>

            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </GlassContainer>

        {/* Content */}
        {renderContent()}
      </div>
    </GradientBackground>
  );
};