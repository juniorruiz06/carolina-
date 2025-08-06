// ============================================
// TIPOS PARA MÓDULOS DEL SISTEMA CONTIGO
// ============================================

/**
 * Tipos base para todos los módulos del sistema
 */
export interface BaseModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isEnabled: boolean;
  lastAccessed?: Date;
}

/**
 * Tipos para el Módulo de Salud
 * Gestión de recordatorios médicos y medicamentos
 */
export interface HealthModule extends BaseModule {
  type: 'health';
  reminders: Reminder[];
  medications: Medication[];
  appointments: Appointment[];
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  time: Date;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  isActive: boolean;
  category: 'medication' | 'appointment' | 'exercise' | 'water' | 'other';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  reminderTimes: Date[];
  isActive: boolean;
}

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  date: Date;
  location?: string;
  doctorName?: string;
  type: 'medical' | 'therapy' | 'checkup' | 'emergency' | 'other';
}

/**
 * Tipos para el Módulo Emocional
 * Diario personal y frases motivacionales
 */
export interface EmotionalModule extends BaseModule {
  type: 'emotional';
  diaryEntries: DiaryEntry[];
  motivationalPhrases: MotivationalPhrase[];
  moodTracking: MoodEntry[];
}

export interface DiaryEntry {
  id: string;
  title?: string;
  content: string;
  mood: 'very-sad' | 'sad' | 'neutral' | 'happy' | 'very-happy';
  tags: string[];
  date: Date;
  isPrivate: boolean;
  attachments?: string[];
}

export interface MotivationalPhrase {
  id: string;
  text: string;
  author?: string;
  category: 'motivation' | 'peace' | 'strength' | 'hope' | 'love';
  isFavorite: boolean;
  timesViewed: number;
}

export interface MoodEntry {
  id: string;
  mood: number; // 1-10 scale
  note?: string;
  date: Date;
  triggers?: string[];
}

/**
 * Tipos para el Módulo Académico
 * Gestión de tareas y técnica Pomodoro
 */
export interface AcademicModule extends BaseModule {
  type: 'academic';
  tasks: Task[];
  pomodoroSessions: PomodoroSession[];
  subjects: Subject[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  isCompleted: boolean;
  completedAt?: Date;
  estimatedTime?: number; // minutes
  actualTime?: number; // minutes
  pomodoroSessions: string[]; // IDs of related pomodoro sessions
}

export interface PomodoroSession {
  id: string;
  taskId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes (25, 15, 10, etc.)
  breakDuration: number; // minutes (5, 15, 30)
  isCompleted: boolean;
  type: 'work' | 'short-break' | 'long-break';
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  totalTime: number; // minutes spent
  tasksCount: number;
  isArchived: boolean;
}

/**
 * Tipos para el Módulo IA
 * Chat inteligente y asistencia personalizada
 */
export interface AIModule extends BaseModule {
  type: 'ai';
  chatSessions: ChatSession[];
  preferences: AIPreferences;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastMessageAt: Date;
  isActive: boolean;
  context: 'general' | 'health' | 'emotional' | 'academic' | 'emergency';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    mood?: string;
    urgency?: 'low' | 'medium' | 'high';
    category?: string;
  };
}

export interface AIPreferences {
  personality: 'friendly' | 'professional' | 'empathetic' | 'motivational';
  language: 'es' | 'en';
  responseLength: 'short' | 'medium' | 'detailed';
  enableEmotionalSupport: boolean;
  enableHealthReminders: boolean;
  enableAcademicAssistance: boolean;
}

/**
 * Tipo unión para todos los módulos
 */
export type Module = HealthModule | EmotionalModule | AcademicModule | AIModule;

/**
 * Estado global de la aplicación
 */
export interface AppState {
  modules: Module[];
  activeModule?: string;
  user: UserProfile;
  settings: AppSettings;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  displayName: string;
  avatarUrl?: string;
  timezone: string;
  language: 'es' | 'en';
  createdAt: Date;
  lastLoginAt: Date;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    quiet_hours: {
      enabled: boolean;
      start: string; // "22:00"
      end: string; // "07:00"
    };
  };
  privacy: {
    shareDataForImprovement: boolean;
    enableAnalytics: boolean;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reduceMotion: boolean;
  };
}