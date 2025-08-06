import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, X } from 'lucide-react';
import { useVoiceCommand } from '@/hooks/useVoiceCommand';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { GlassButton } from '@/components/ui/GlassButton';

interface VoiceJarvisProps {
  onClose?: () => void;
}

interface VoiceWaveProps {
  isListening: boolean;
}

const VoiceWave: React.FC<VoiceWaveProps> = ({ isListening }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {isListening && (
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-contigo-primary rounded-full animate-pulse"
              style={{
                height: `${Math.random() * 30 + 10}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.5s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const VoiceJarvis: React.FC<VoiceJarvisProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    isListening,
    isProcessing,
    transcript,
    response,
    startListening,
    stopListening,
    processCommand
  } = useVoiceCommand();

  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  console.log('VoiceJarvis: Rendering component');
  console.log('VoiceJarvis: User:', !!user);
  console.log('VoiceJarvis: isListening:', isListening);
  console.log('VoiceJarvis: isProcessing:', isProcessing);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMicPress = async () => {
    if (!user) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para usar el asistente de voz.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isListening) {
        await stopListening();
      } else {
        await startListening();
      }
    } catch (error) {
      console.error('Error handling mic press:', error);
      toast({
        title: "Error de micrófono",
        description: "No se pudo acceder al micrófono. Verifica los permisos.",
        variant: "destructive",
      });
    }
  };

  const getStatusText = () => {
    if (isProcessing) return "Contigo AI está procesando...";
    if (isListening) return "Contigo AI está escuchando...";
    return "Toca para hablar con Contigo AI";
  };

  const getStatusColor = () => {
    if (isProcessing) return "text-contigo-accent";
    if (isListening) return "text-contigo-heart";
    return "text-contigo-primary";
  };

  return (
    <div 
      ref={containerRef}
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <GlassContainer className="p-8 max-w-sm mx-auto text-center relative">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-glass-white/20 rounded-full transition-all duration-200 group"
          >
            <X className="w-4 h-4 text-foreground/70 group-hover:text-foreground" />
          </button>
        )}
        
        {/* Debug Info */}
        <div className="mb-4 text-xs text-foreground/50">
          VoiceJarvis Activo - User: {user ? '✓' : '✗'}
        </div>
        
        {/* Status Text */}
        <div className={`mb-6 font-medium text-sm ${getStatusColor()} transition-colors duration-300`}>
          {getStatusText()}
        </div>

        {/* Voice Wave Animation */}
        <div className="relative mb-6 h-12 flex items-center justify-center">
          <VoiceWave isListening={isListening} />
        </div>

        {/* Microphone Button */}
        <div className="relative">
          <GlassButton
            onClick={handleMicPress}
            disabled={isProcessing}
            size="lg"
            variant={isListening ? "heart" : "primary"}
            className={`
              w-20 h-20 rounded-full p-0 flex items-center justify-center
              transition-all duration-300 transform
              ${isListening ? 'scale-110 shadow-lg shadow-contigo-heart/30' : 'hover:scale-105'}
              ${isProcessing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              ring-2 ring-contigo-primary/30
            `}
          >
            {isProcessing ? (
              <Loader2 className="w-8 h-8 animate-spin text-foreground" />
            ) : isListening ? (
              <MicOff className="w-8 h-8 text-foreground" />
            ) : (
              <Mic className="w-8 h-8 text-foreground" />
            )}
          </GlassButton>

          {/* Pulse Animation for Listening State */}
          {isListening && (
            <div className="absolute inset-0 rounded-full border-2 border-contigo-heart animate-ping opacity-30" />
          )}
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="mt-6 p-4 glass-container rounded-2xl">
            <p className="text-sm text-foreground/80 italic">
              "{transcript}"
            </p>
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="mt-4 p-4 glass-container rounded-2xl bg-contigo-accent/20">
            <p className="text-sm text-foreground font-medium">
              {response.confirmation}
            </p>
          </div>
        )}

        {/* Floating Background Elements */}
        <div className="absolute -z-10 inset-0 overflow-hidden rounded-3xl">
          <div className="absolute top-2 right-2 w-4 h-4 bg-contigo-secondary/30 rounded-full float" />
          <div className="absolute bottom-4 left-4 w-3 h-3 bg-contigo-accent/40 rounded-full float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-2 w-2 h-2 bg-contigo-heart/30 rounded-full float" style={{ animationDelay: '2s' }} />
        </div>
      </GlassContainer>
    </div>
  );
};

export default VoiceJarvis;