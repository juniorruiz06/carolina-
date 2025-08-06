import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VoiceCommand {
  text: string;
  userId: string;
}

interface AIResponse {
  intention: string;
  action: string;
  parameters: Record<string, any>;
  confirmation: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, userId }: VoiceCommand = await req.json();

    if (!text || !userId) {
      throw new Error('Text and userId are required');
    }

    console.log('Processing voice command:', text, 'for user:', userId);

    // Simulate AI processing (replace with actual AI API call)
    const aiResponse = await processWithAI(text);
    
    console.log('AI Response:', aiResponse);

    return new Response(JSON.stringify(aiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in voice-ai-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      intention: 'error',
      action: 'none',
      parameters: {},
      confirmation: 'Lo siento, no pude procesar tu solicitud. ¿Podrías intentarlo de nuevo?'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processWithAI(text: string): Promise<AIResponse> {
  // Simulate AI processing with predefined responses based on keywords
  const lowercaseText = text.toLowerCase();
  
  // Tareas
  if (lowercaseText.includes('tarea') || lowercaseText.includes('estudiar')) {
    return {
      intention: 'crear_tarea',
      action: 'create_task',
      parameters: {
        title: extractTaskTitle(text),
        date: extractDate(text),
        category: 'academic'
      },
      confirmation: 'Perfecto, he registrado tu tarea. Te ayudaré a mantenerte organizado.'
    };
  }
  
  // Ejercicio
  if (lowercaseText.includes('ejercicio') || lowercaseText.includes('deporte')) {
    return {
      intention: 'registrar_ejercicio',
      action: 'log_exercise',
      parameters: {
        minutes: extractMinutes(text) || 30,
        type: 'general',
        date: new Date().toISOString().split('T')[0]
      },
      confirmation: '¡Excelente! He registrado tu actividad física. Cada paso cuenta hacia una vida más saludable.'
    };
  }
  
  // Recordatorios
  if (lowercaseText.includes('recuerda') || lowercaseText.includes('recordatorio')) {
    return {
      intention: 'crear_recordatorio',
      action: 'create_reminder',
      parameters: {
        message: extractReminderMessage(text),
        interval: extractInterval(text) || '3 horas'
      },
      confirmation: 'Entendido, te ayudaré a recordarlo. Cuidar de ti mismo es mi prioridad.'
    };
  }
  
  // Motivación
  if (lowercaseText.includes('motivadora') || lowercaseText.includes('motivación')) {
    return {
      intention: 'mostrar_motivacion',
      action: 'show_motivation',
      parameters: {},
      confirmation: 'Recuerda: Cada día es una nueva oportunidad para crecer y brillar. ¡Tú puedes con todo!'
    };
  }
  
  // Pomodoro
  if (lowercaseText.includes('pomodoro') || lowercaseText.includes('sesión')) {
    return {
      intention: 'iniciar_pomodoro',
      action: 'start_pomodoro',
      parameters: {
        duration: 25,
        type: 'study'
      },
      confirmation: 'Iniciando sesión Pomodoro de 25 minutos. Concéntrate, estaré aquí para apoyarte.'
    };
  }
  
  // Apoyo emocional
  if (lowercaseText.includes('desahogar') || lowercaseText.includes('estresado') || lowercaseText.includes('triste')) {
    return {
      intention: 'apoyo_emocional',
      action: 'emotional_support',
      parameters: {
        mood: 'stressed',
        needsSupport: true
      },
      confirmation: 'Estoy aquí para ti. Es normal sentirse así a veces. ¿Te gustaría que te sugiera algunas técnicas de relajación?'
    };
  }
  
  // Listar tareas
  if (lowercaseText.includes('tareas') && lowercaseText.includes('hoy')) {
    return {
      intention: 'mostrar_tareas',
      action: 'show_tasks',
      parameters: {
        date: new Date().toISOString().split('T')[0]
      },
      confirmation: 'Aquí están tus tareas de hoy. Vamos paso a paso, puedes lograr todo lo que te propongas.'
    };
  }
  
  // Default response
  return {
    intention: 'conversacion_general',
    action: 'general_chat',
    parameters: {},
    confirmation: 'Te escucho. ¿En qué puedo ayudarte hoy? Estoy aquí para apoyarte en lo que necesites.'
  };
}

function extractTaskTitle(text: string): string {
  const match = text.match(/(?:tarea|estudiar)\s+(?:de\s+)?(.+?)(?:\s+mañana|\s+hoy|$)/i);
  return match ? match[1].trim() : 'Nueva tarea';
}

function extractDate(text: string): string {
  const today = new Date();
  if (text.includes('mañana')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
  return today.toISOString().split('T')[0];
}

function extractMinutes(text: string): number | null {
  const match = text.match(/(\d+)\s*(?:hora|horas|minuto|minutos)/i);
  if (match) {
    const value = parseInt(match[1]);
    if (text.includes('hora')) return value * 60;
    return value;
  }
  return null;
}

function extractReminderMessage(text: string): string {
  const match = text.match(/recuerda(?:me)?\s+(.+?)(?:\s+cada|$)/i);
  return match ? match[1].trim() : 'Recordatorio';
}

function extractInterval(text: string): string {
  const match = text.match(/cada\s+(\d+)\s*(?:hora|horas|minuto|minutos)/i);
  if (match) {
    const value = match[1];
    if (text.includes('hora')) return `${value} horas`;
    return `${value} minutos`;
  }
  return '3 horas';
}