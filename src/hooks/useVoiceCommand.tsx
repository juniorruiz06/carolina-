import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { actionHandler } from '@/services/actionHandler';

interface AIResponse {
  intention: string;
  action: string;
  parameters: Record<string, any>;
  confirmation: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

export const useVoiceCommand = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [response, setResponse] = useState<AIResponse | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  console.log('useVoiceCommand: Hook initialized');
  console.log('useVoiceCommand: User:', !!user);
  console.log('useVoiceCommand: States - listening:', isListening, 'processing:', isProcessing);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'es-ES';
        
        recognition.onstart = () => {
          console.log('Voice recognition started');
          setIsListening(true);
          setTranscript('');
          setResponse(null);
        };
        
        recognition.onend = () => {
          console.log('Voice recognition ended');
          setIsListening(false);
        };
        
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const lastResult = event.results[event.results.length - 1];
          if (lastResult.isFinal) {
            const transcript = lastResult[0].transcript;
            console.log('Final transcript:', transcript);
            setTranscript(transcript);
            processCommand(transcript);
          }
        };
        
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          if (event.error !== 'aborted') {
            toast({
              title: "Error de reconocimiento",
              description: "No se pudo procesar el audio. Inténtalo de nuevo.",
              variant: "destructive",
            });
          }
        };
      }
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current) {
      toast({
        title: "No soportado",
        description: "Tu navegador no soporta reconocimiento de voz.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      recognitionRef.current.start();
      
      // Set a timeout to automatically stop listening after 10 seconds
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 10000);
      
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      toast({
        title: "Error de permisos",
        description: "No se pudo acceder al micrófono. Verifica los permisos.",
        variant: "destructive",
      });
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [isListening]);

  const processCommand = useCallback(async (text: string) => {
    if (!user || !text.trim()) return;
    
    setIsProcessing(true);
    
    try {
      console.log('Processing command:', text);
      
      // Send to AI assistant
      const { data: aiResponse, error } = await supabase.functions.invoke('voice-ai-assistant', {
        body: {
          text: text.trim(),
          userId: user.id
        }
      });
      
      if (error) {
        throw error;
      }
      
      console.log('AI Response:', aiResponse);
      setResponse(aiResponse);
      
      // Execute the action
      if (aiResponse.action !== 'none' && aiResponse.action !== 'general_chat') {
        await actionHandler.executeAction(aiResponse.action, aiResponse.parameters, user.id);
      }
      
      // Speak the confirmation
      speakText(aiResponse.confirmation);
      
    } catch (error) {
      console.error('Error processing command:', error);
      
      const errorResponse: AIResponse = {
        intention: 'error',
        action: 'none',
        parameters: {},
        confirmation: 'Lo siento, hubo un problema procesando tu solicitud. ¿Podrías intentarlo de nuevo?'
      };
      
      setResponse(errorResponse);
      speakText(errorResponse.confirmation);
      
      toast({
        title: "Error de procesamiento",
        description: "No se pudo procesar el comando. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [user, toast]);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window && text) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Find a Spanish voice if available
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(voice => 
        voice.lang.startsWith('es') && voice.name.includes('Female')
      ) || voices.find(voice => voice.lang.startsWith('es'));
      
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }
      
      utterance.onstart = () => console.log('Speech synthesis started');
      utterance.onend = () => console.log('Speech synthesis ended');
      utterance.onerror = (event) => console.error('Speech synthesis error:', event);
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return {
    isListening,
    isProcessing,
    transcript,
    response,
    startListening,
    stopListening,
    processCommand,
    speakText
  };
};