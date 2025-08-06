import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface UserContext {
  healthData?: any;
  emotionalData?: any;
  academicData?: any;
  userKnowledge?: any;
  previousInsights?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userContext, sessionId } = await req.json();
    const startTime = Date.now();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authHeader = req.headers.get('Authorization')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get user ID from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const userId = user.id;

    // Obtener datos contextuales del usuario de la base de datos
    const { data: userKnowledge } = await supabase
      .from('ai_user_knowledge')
      .select('*')
      .eq('user_id', userId)
      .eq('is_verified', true);

    const { data: learningData } = await supabase
      .from('ai_learning_data')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('confidence_score', { ascending: false })
      .limit(20);

    // Obtener datos recientes de otros módulos para contexto
    const { data: recentHealth } = await supabase
      .from('health_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: recentEmotional } = await supabase
      .from('emotional_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: recentAcademic } = await supabase
      .from('academic_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: userGoals } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    // Construir contexto enriquecido
    const enrichedContext = {
      userKnowledge: userKnowledge || [],
      patterns: learningData || [],
      recentHealth: recentHealth || [],
      recentEmotional: recentEmotional || [],
      recentAcademic: recentAcademic || [],
      activeGoals: userGoals || [],
      ...userContext
    };

    // Construir prompt del sistema con contexto personalizado
    const systemPrompt = `Eres ContigoIA, un asistente personal inteligente y empático diseñado para acompañar a usuarios en su bienestar integral. Tu propósito es brindar apoyo en las siguientes áreas:

PERSONALIDAD Y TONO:
- Empático, cálido y comprensivo
- Motivador y positivo, pero realista
- Habla en español de manera natural y cercana
- Usa un lenguaje que inspire confianza
- Sé conciso pero completo en tus respuestas
- Personaliza cada respuesta basándote en el historial del usuario

ÁREAS DE ESPECIALIZACIÓN:

1. APOYO EMOCIONAL:
- Escucha activa y validación de emociones
- Técnicas de manejo del estrés y ansiedad
- Promoción de autoestima y confianza
- Acompañamiento en momentos difíciles

2. ASISTENCIA ACADÉMICA:
- Técnicas de estudio efectivas
- Organización y planificación académica
- Motivación para el aprendizaje
- Gestión del tiempo y productividad

3. CONSEJOS DE SALUD Y BIENESTAR:
- Promoción de hábitos saludables
- Recordatorios de autocuidado
- Sugerencias de ejercicio y alimentación
- Higiene del sueño

4. MOTIVACIÓN Y CRECIMIENTO PERSONAL:
- Establecimiento de metas realistas
- Celebración de logros
- Reflexiones inspiradoras
- Desarrollo de resiliencia

CONTEXTO PERSONALIZADO DEL USUARIO:
${JSON.stringify(enrichedContext, null, 2)}

PAUTAS DE RESPUESTA:
- Personaliza tus respuestas basándote en el contexto y patrones del usuario
- Ofrece consejos prácticos y aplicables
- Refiere a datos específicos del usuario cuando sea relevante
- Sugiere recursos o técnicas personalizadas
- Mantén un equilibrio entre apoyo emocional y consejos prácticos
- Si detectas problemas serios de salud mental, recomienda buscar ayuda profesional
- Aprende de cada interacción para mejorar futuras respuestas

Responde siempre como ContigoIA, manteniendo tu personalidad empática y tu enfoque en el bienestar integral del usuario.`;

    // Preparar mensajes para Claude API
    const claudeMessages = messages.map((msg: ChatMessage) => ({
      role: msg.role,
      content: msg.content
    }));

    // Hacer solicitud a Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        system: systemPrompt,
        messages: claudeMessages
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API error:', errorData);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.content[0].text;
    const responseTime = Date.now() - startTime;

    // Guardar conversación en la base de datos
    const currentSessionId = sessionId || crypto.randomUUID();
    
    // Obtener el número de orden de mensaje para esta sesión
    const { data: existingMessages } = await supabase
      .from('ai_conversations')
      .select('message_order')
      .eq('user_id', userId)
      .eq('session_id', currentSessionId)
      .order('message_order', { ascending: false })
      .limit(1);

    const lastOrder = existingMessages?.[0]?.message_order || 0;

    // Guardar el mensaje del usuario y la respuesta de la IA
    const lastUserMessage = messages[messages.length - 1];
    
    if (lastUserMessage?.role === 'user') {
      await supabase.from('ai_conversations').insert([
        {
          user_id: userId,
          session_id: currentSessionId,
          message_role: 'user',
          content: lastUserMessage.content,
          message_order: lastOrder + 1,
          context_data: enrichedContext,
          model_used: 'claude-3-5-sonnet'
        },
        {
          user_id: userId,
          session_id: currentSessionId,
          message_role: 'assistant',
          content: aiMessage,
          message_order: lastOrder + 2,
          context_data: enrichedContext,
          response_time_ms: responseTime,
          model_used: 'claude-3-5-sonnet'
        }
      ]);
    }

    // Analizar y extraer patrones de aprendizaje
    await extractLearningPatterns(supabase, userId, lastUserMessage?.content, aiMessage, enrichedContext);

    return new Response(
      JSON.stringify({ 
        message: aiMessage,
        sessionId: currentSessionId,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in claude-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Función para extraer patrones de aprendizaje de las conversaciones
async function extractLearningPatterns(supabase: any, userId: string, userMessage: string, aiResponse: string, context: any) {
  try {
    const patterns = [];
    
    // Detectar temas frecuentes
    if (userMessage) {
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('estrés') || lowerMessage.includes('ansiedad') || lowerMessage.includes('nervios')) {
        patterns.push({
          user_id: userId,
          data_type: 'pattern',
          category: 'emotional',
          key_name: 'stress_management_interest',
          value_data: { detected_keywords: ['estrés', 'ansiedad'], context: 'user_message' },
          confidence_score: 0.8
        });
      }
      
      if (lowerMessage.includes('estudio') || lowerMessage.includes('tarea') || lowerMessage.includes('examen')) {
        patterns.push({
          user_id: userId,
          data_type: 'pattern',
          category: 'academic',
          key_name: 'study_support_interest',
          value_data: { detected_keywords: ['estudio', 'académico'], context: 'user_message' },
          confidence_score: 0.8
        });
      }
      
      if (lowerMessage.includes('ejercicio') || lowerMessage.includes('dormir') || lowerMessage.includes('agua')) {
        patterns.push({
          user_id: userId,
          data_type: 'pattern',
          category: 'health',
          key_name: 'health_habits_interest',
          value_data: { detected_keywords: ['salud', 'bienestar'], context: 'user_message' },
          confidence_score: 0.8
        });
      }
    }

    // Guardar patrones detectados
    if (patterns.length > 0) {
      for (const pattern of patterns) {
        // Verificar si el patrón ya existe, si es así, actualizar frecuencia
        const { data: existing } = await supabase
          .from('ai_learning_data')
          .select('*')
          .eq('user_id', userId)
          .eq('key_name', pattern.key_name)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('ai_learning_data')
            .update({
              frequency_count: existing.frequency_count + 1,
              last_observed_at: new Date().toISOString(),
              confidence_score: Math.min(existing.confidence_score + 0.1, 1.0)
            })
            .eq('id', existing.id);
        } else {
          await supabase
            .from('ai_learning_data')
            .insert(pattern);
        }
      }
    }
  } catch (error) {
    console.error('Error extracting learning patterns:', error);
  }
}