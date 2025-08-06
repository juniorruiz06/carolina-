import { useState } from 'react';
import { claudeAI } from '@/services/claudeAI';
import { useAuth } from './useAuth';
import { toast } from '@/components/ui/use-toast';

interface UseClaudeAIReturn {
  isLoading: boolean;
  error: string | null;
  getEmotionalSupport: (mood: string, context: string) => Promise<string | null>;
  getAcademicHelp: (subject: string, topic: string, difficulty: string) => Promise<string | null>;
  getHealthAdvice: (concern: string, symptoms: string) => Promise<string | null>;
  getInteractionHistory: (type?: string, limit?: number) => Promise<any[]>;
}

export const useClaudeAI = (): UseClaudeAIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleRequest = async <T,>(
    requestFn: () => Promise<T>,
    type: 'emotional' | 'academic' | 'health',
    query: string
  ): Promise<T | null> => {
    if (!user) {
      toast({
        title: "Error de autenticación",
        description: "Debes estar conectado para usar esta función",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await requestFn();
      
      // Save interaction to database
      if (typeof result === 'string' && user.id) {
        await claudeAI.saveInteraction(user.id, type, query, result);
      }

      toast({
        title: "✨ Respuesta generada",
        description: "La IA ha procesado tu consulta exitosamente",
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      
      toast({
        title: "Error al procesar consulta",
        description: errorMessage.includes('API key') 
          ? "La API de Claude no está configurada correctamente" 
          : "Hubo un error al procesar tu consulta. Inténtalo de nuevo.",
        variant: "destructive",
      });

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getEmotionalSupport = async (mood: string, context: string): Promise<string | null> => {
    return handleRequest(
      () => claudeAI.getEmotionalSupport(mood, context),
      'emotional',
      `Estado de ánimo: ${mood}, Contexto: ${context}`
    );
  };

  const getAcademicHelp = async (subject: string, topic: string, difficulty: string): Promise<string | null> => {
    return handleRequest(
      () => claudeAI.getAcademicHelp(subject, topic, difficulty),
      'academic',
      `Materia: ${subject}, Tema: ${topic}, Dificultad: ${difficulty}`
    );
  };

  const getHealthAdvice = async (concern: string, symptoms: string): Promise<string | null> => {
    return handleRequest(
      () => claudeAI.getHealthAdvice(concern, symptoms),
      'health',
      `Preocupación: ${concern}, Síntomas: ${symptoms}`
    );
  };

  const getInteractionHistory = async (type?: string, limit?: number): Promise<any[]> => {
    if (!user?.id) return [];

    setIsLoading(true);
    setError(null);

    try {
      const history = await claudeAI.getInteractionHistory(user.id, type, limit);
      return history;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      
      toast({
        title: "Error al cargar historial",
        description: "No se pudo cargar el historial de interacciones",
        variant: "destructive",
      });

      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getEmotionalSupport,
    getAcademicHelp,
    getHealthAdvice,
    getInteractionHistory,
  };
};
