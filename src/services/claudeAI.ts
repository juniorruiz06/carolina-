import { supabase } from '@/integrations/supabase/client';

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

class ClaudeAIService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
    this.apiUrl = import.meta.env.VITE_ANTHROPIC_API_URL || 'https://api.anthropic.com/v1/messages';
  }

  /**
   * Send a message to Claude AI
   */
  async sendMessage(messages: ClaudeMessage[], maxTokens: number = 1000): Promise<ClaudeResponse> {
    if (!this.apiKey) {
      throw new Error('Claude AI API key is not configured');
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: maxTokens,
          messages: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude AI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        content: data.content?.[0]?.text || 'No response generated',
        usage: data.usage,
      };
    } catch (error) {
      console.error('Error calling Claude AI:', error);
      throw error;
    }
  }

  /**
   * Get emotional support advice
   */
  async getEmotionalSupport(mood: string, context: string): Promise<string> {
    const messages: ClaudeMessage[] = [
      {
        role: 'user',
        content: `Como un consejero de bienestar emocional comprensivo y empático, ayúdame con mi estado de ánimo actual. 

Estado de ánimo: ${mood}
Contexto: ${context}

Por favor, proporciona consejos personalizados, técnicas de afrontamiento y palabras de aliento en español. Sé cálido, comprensivo y práctico.`
      }
    ];

    const response = await this.sendMessage(messages, 800);
    return response.content;
  }

  /**
   * Get academic assistance
   */
  async getAcademicHelp(subject: string, topic: string, difficulty: string): Promise<string> {
    const messages: ClaudeMessage[] = [
      {
        role: 'user',
        content: `Como un tutor académico experto, ayúdame con mis estudios.

Materia: ${subject}
Tema: ${topic}
Nivel de dificultad: ${difficulty}

Por favor, explica el concepto de manera clara y didáctica en español, incluyendo ejemplos prácticos si es posible.`
      }
    ];

    const response = await this.sendMessage(messages, 1200);
    return response.content;
  }

  /**
   * Get health and wellness advice
   */
  async getHealthAdvice(concern: string, symptoms: string): Promise<string> {
    const messages: ClaudeMessage[] = [
      {
        role: 'user',
        content: `Como un consejero de bienestar y salud (sin reemplazar consulta médica profesional), ayúdame con mi preocupación de salud.

Preocupación: ${concern}
Síntomas o detalles: ${symptoms}

Por favor, proporciona consejos generales de bienestar, recomendaciones de estilo de vida saludable y cuándo considerar buscar ayuda médica profesional. Responde en español y siempre recuerda que no reemplazas consulta médica.`
      }
    ];

    const response = await this.sendMessage(messages, 1000);
    return response.content;
  }

  /**
   * Save AI interaction to database
   */
  async saveInteraction(userId: string, type: 'emotional' | 'academic' | 'health', query: string, response: string) {
    try {
      const { error } = await supabase
        .from('ai_interactions')
        .insert({
          user_id: userId,
          interaction_type: type,
          user_query: query,
          ai_response: response,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving AI interaction:', error);
      }
    } catch (error) {
      console.error('Error saving AI interaction to database:', error);
    }
  }

  /**
   * Get user's AI interaction history
   */
  async getInteractionHistory(userId: string, type?: string, limit: number = 50) {
    try {
      let query = supabase
        .from('ai_interactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (type) {
        query = query.eq('interaction_type', type);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching AI interaction history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching interaction history:', error);
      return [];
    }
  }
}

export const claudeAI = new ClaudeAIService();
