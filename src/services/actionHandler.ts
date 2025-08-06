import { supabase } from '@/integrations/supabase/client';

interface ActionParameters {
  [key: string]: any;
}

class ActionHandler {
  async executeAction(action: string, parameters: ActionParameters, userId: string): Promise<void> {
    console.log('Executing action:', action, 'with parameters:', parameters);

    try {
      switch (action) {
        case 'create_task':
          await this.createTask(parameters, userId);
          break;
          
        case 'log_exercise':
          await this.logExercise(parameters, userId);
          break;
          
        case 'create_reminder':
          await this.createReminder(parameters, userId);
          break;
          
        case 'show_motivation':
          await this.showMotivation(parameters, userId);
          break;
          
        case 'start_pomodoro':
          await this.startPomodoro(parameters, userId);
          break;
          
        case 'emotional_support':
          await this.logEmotionalState(parameters, userId);
          break;
          
        case 'show_tasks':
          await this.showTasks(parameters, userId);
          break;
          
        default:
          console.log('Unknown action:', action);
      }
    } catch (error) {
      console.error('Error executing action:', error);
      throw error;
    }
  }

  private async createTask(parameters: ActionParameters, userId: string): Promise<void> {
    const { title, date, category } = parameters;
    
    const { error } = await supabase
      .from('academic_entries')
      .insert({
        user_id: userId,
        topic: title,
        subject: category || 'general',
        date: date,
        study_time_minutes: 0,
        completion_percentage: 0,
        goals: [title],
        notes: 'Creada por Contigo AI'
      });

    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }

    console.log('Task created successfully');
  }

  private async logExercise(parameters: ActionParameters, userId: string): Promise<void> {
    const { minutes, type, date } = parameters;
    
    const { error } = await supabase
      .from('health_entries')
      .insert({
        user_id: userId,
        date: date,
        exercise_minutes: minutes,
        notes: `Ejercicio registrado por Contigo AI: ${type}`
      });

    if (error) {
      console.error('Error logging exercise:', error);
      throw error;
    }

    console.log('Exercise logged successfully');
  }

  private async createReminder(parameters: ActionParameters, userId: string): Promise<void> {
    const { message, interval } = parameters;
    
    // Create a goal that acts as a reminder
    const { error } = await supabase
      .from('user_goals')
      .insert({
        user_id: userId,
        title: `Recordatorio: ${message}`,
        description: `Frecuencia: cada ${interval}`,
        category: 'health',
        is_active: true,
        target_value: 1,
        current_value: 0
      });

    if (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }

    console.log('Reminder created successfully');
  }

  private async showMotivation(parameters: ActionParameters, userId: string): Promise<void> {
    // Create an AI insight with motivational content
    const motivationalQuotes = [
      "Cada día es una nueva oportunidad para crecer y brillar. ¡Tú puedes con todo!",
      "Tu potencial es infinito. Confía en ti mismo y sigue adelante.",
      "Los pequeños pasos diarios te llevarán a grandes logros.",
      "Eres más fuerte de lo que piensas y más capaz de lo que imaginas.",
      "El progreso no siempre es perfecto, pero siempre es valioso."
    ];

    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

    const { error } = await supabase
      .from('ai_insights')
      .insert({
        user_id: userId,
        insight_type: 'motivation',
        title: 'Mensaje motivacional',
        content: randomQuote,
        priority: 1
      });

    if (error) {
      console.error('Error creating motivational insight:', error);
      throw error;
    }

    console.log('Motivational message created successfully');
  }

  private async startPomodoro(parameters: ActionParameters, userId: string): Promise<void> {
    const { duration, type } = parameters;
    
    // Log this as a study session goal
    const { error } = await supabase
      .from('user_goals')
      .insert({
        user_id: userId,
        title: `Sesión Pomodoro - ${type}`,
        description: `Sesión de ${duration} minutos iniciada por Contigo AI`,
        category: 'academic',
        target_value: duration,
        current_value: 0,
        unit: 'minutos',
        is_active: true
      });

    if (error) {
      console.error('Error starting pomodoro session:', error);
      throw error;
    }

    console.log('Pomodoro session started successfully');
  }

  private async logEmotionalState(parameters: ActionParameters, userId: string): Promise<void> {
    const { mood, needsSupport } = parameters;
    
    const { error } = await supabase
      .from('emotional_entries')
      .insert({
        user_id: userId,
        date: new Date().toISOString().split('T')[0],
        primary_emotion: mood || 'stressed',
        emotion_intensity: 6,
        reflection_notes: 'Usuario solicitó apoyo emocional a través de Contigo AI',
        coping_strategies: needsSupport ? ['breathing', 'talking'] : []
      });

    if (error) {
      console.error('Error logging emotional state:', error);
      throw error;
    }

    console.log('Emotional state logged successfully');
  }

  private async showTasks(parameters: ActionParameters, userId: string): Promise<void> {
    const { date } = parameters;
    
    const { data: tasks, error } = await supabase
      .from('academic_entries')
      .select('topic, completion_percentage, study_time_minutes')
      .eq('user_id', userId)
      .eq('date', date)
      .limit(5);

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    // Create an insight with the task summary
    const taskSummary = tasks && tasks.length > 0 
      ? `Tienes ${tasks.length} tareas para hoy: ${tasks.map(t => t.topic).join(', ')}`
      : 'No tienes tareas programadas para hoy. ¡Perfecto momento para relajarte o planear algo nuevo!';

    const { error: insightError } = await supabase
      .from('ai_insights')
      .insert({
        user_id: userId,
        insight_type: 'task_summary',
        title: 'Resumen de tareas',
        content: taskSummary,
        priority: 2,
        related_data: { tasks, date }
      });

    if (insightError) {
      console.error('Error creating task summary insight:', insightError);
      throw insightError;
    }

    console.log('Task summary created successfully');
  }
}

export const actionHandler = new ActionHandler();