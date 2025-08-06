import { useState, useEffect } from "react";
import { GradientBackground } from "@/components/layout/GradientBackground";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { GlassButton } from "@/components/ui/GlassButton";
import { useAcademicData } from "@/hooks/useAcademicData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  BookOpen, 
  Target, 
  Clock,
  Plus,
  Play,
  Pause,
  CheckCircle,
  Calendar,
  Timer,
  TrendingUp,
  GraduationCap,
  Award,
  BarChart3,
  Brain,
  Star,
  Lightbulb,
  PieChart,
  Trophy
} from "lucide-react";
import contigoHeart from "@/assets/contigo-heart.png";

interface AcademicModuleProps {
  onBack: () => void;
}

type AcademicSection = 'overview' | 'study-session' | 'subjects' | 'progress' | 'history';

// Materias universitarias comunes
const UNIVERSITY_SUBJECTS = [
  'Matemáticas', 'Física', 'Química', 'Biología', 'Historia', 'Literatura',
  'Filosofía', 'Psicología', 'Economía', 'Derecho', 'Ingeniería', 'Medicina',
  'Arquitectura', 'Informática', 'Idiomas', 'Arte', 'Música', 'Educación Física',
  'Estadística', 'Contabilidad', 'Marketing', 'Sociología', 'Antropología',
  'Ciencias Políticas', 'Comunicación', 'Diseño', 'Geografía', 'Geología'
];

const DIFFICULTY_LABELS = {
  1: 'Muy Fácil',
  2: 'Fácil', 
  3: 'Moderado',
  4: 'Difícil',
  5: 'Muy Difícil'
};

const UNDERSTANDING_LABELS = {
  1: 'No entendí',
  2: 'Poco claro',
  3: 'Básico',
  4: 'Bien entendido',
  5: 'Dominado'
};

export const AcademicModule = ({ onBack }: AcademicModuleProps) => {
  const { academicEntries, loading, createEntry, updateEntry, getTotalStudyTime, getEntriesBySubject } = useAcademicData();
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState<AcademicSection>('overview');
  const [isStudying, setIsStudying] = useState(false);
  const [studyTime, setStudyTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    study_time_minutes: '',
    completion_percentage: '0',
    difficulty_rating: '3',
    understanding_level: '3',
    notes: '',
    goals: '',
    achievements: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.topic) {
      toast({
        title: "Error",
        description: "Por favor completa materia y tema",
        variant: "destructive",
      });
      return;
    }

    const entryData = {
      subject: formData.subject,
      topic: formData.topic,
      study_time_minutes: parseInt(formData.study_time_minutes) || studyTime,
      completion_percentage: parseInt(formData.completion_percentage),
      difficulty_rating: parseInt(formData.difficulty_rating),
      understanding_level: parseInt(formData.understanding_level),
      notes: formData.notes || undefined,
      goals: formData.goals ? formData.goals.split(',').map(s => s.trim()) : [],
      achievements: formData.achievements ? formData.achievements.split(',').map(s => s.trim()) : [],
    };

    const success = await createEntry(entryData);
    
    if (success) {
      setCurrentSection('overview');
      resetForm();
      stopTimer();
    }
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      topic: '',
      study_time_minutes: '',
      completion_percentage: '0',
      difficulty_rating: '3',
      understanding_level: '3',
      notes: '',
      goals: '',
      achievements: ''
    });
  };

  const startTimer = () => {
    setIsStudying(true);
    const interval = setInterval(() => {
      setStudyTime(prev => prev + 1);
    }, 60000); // Incrementar cada minuto
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    setIsStudying(false);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const pauseTimer = () => {
    setIsStudying(false);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const resetTimer = () => {
    stopTimer();
    setStudyTime(0);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const renderOverview = () => {
    const todayEntries = academicEntries.filter(entry => 
      entry.date === new Date().toISOString().split('T')[0]
    );
    const totalTodayTime = todayEntries.reduce((acc, entry) => acc + entry.study_time_minutes, 0);
    const avgUnderstanding = todayEntries.length > 0 
      ? todayEntries.reduce((acc, entry) => acc + entry.understanding_level, 0) / todayEntries.length 
      : 0;
    const subjectsToday = new Set(todayEntries.map(entry => entry.subject)).size;

    // Estadísticas semanales
    const weekEntries = academicEntries.slice(0, 7);
    const totalWeekTime = weekEntries.reduce((acc, entry) => acc + entry.study_time_minutes, 0);
    const avgWeeklyUnderstanding = weekEntries.length > 0
      ? weekEntries.reduce((acc, entry) => acc + entry.understanding_level, 0) / weekEntries.length
      : 0;

    return (
      <div className="space-y-6">
        {/* Estadísticas del día */}
        <GlassContainer>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-xl font-primary font-bold text-foreground">
              Progreso Académico de Hoy
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-glass-white/30 rounded-xl p-4 text-center">
              <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-primary font-bold text-blue-500 mb-1">
                {Math.floor(totalTodayTime / 60)}h {totalTodayTime % 60}m
              </div>
              <div className="text-sm font-secondary text-foreground/70">Tiempo estudiado</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all" 
                  style={{ width: `${Math.min((totalTodayTime / 240) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-glass-white/30 rounded-xl p-4 text-center">
              <BookOpen className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-primary font-bold text-green-500 mb-1">
                {subjectsToday}
              </div>
              <div className="text-sm font-secondary text-foreground/70">Materias estudiadas</div>
            </div>
            
            <div className="bg-glass-white/30 rounded-xl p-4 text-center">
              <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-primary font-bold text-purple-500 mb-1">
                {avgUnderstanding.toFixed(1)}
              </div>
              <div className="text-sm font-secondary text-foreground/70">Comprensión prom.</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all" 
                  style={{ width: `${avgUnderstanding * 20}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-glass-white/30 rounded-xl p-4 text-center">
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-primary font-bold text-yellow-500 mb-1">
                {todayEntries.length}
              </div>
              <div className="text-sm font-secondary text-foreground/70">Sesiones hoy</div>
            </div>
          </div>
        </GlassContainer>

        {/* Timer de estudio activo */}
        <GlassContainer>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-primary font-semibold text-foreground">
              Sesión de Estudio
            </h3>
            <div className="flex items-center gap-2">
              <Timer className={`w-5 h-5 ${isStudying ? 'text-green-500' : 'text-contigo-primary'}`} />
              <span className={`text-sm ${isStudying ? 'text-green-500' : 'text-contigo-primary'}`}>
                {isStudying ? 'Estudiando' : 'Listo'}
              </span>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-6xl font-primary font-bold text-foreground mb-4">
              {formatTime(studyTime)}
            </div>
            
            <div className="flex items-center justify-center gap-4">
              {!isStudying ? (
                <GlassButton
                  variant="primary"
                  onClick={startTimer}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Iniciar Estudio
                </GlassButton>
              ) : (
                <GlassButton
                  variant="secondary"
                  onClick={pauseTimer}
                  className="flex items-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Pausar
                </GlassButton>
              )}
              
              <GlassButton 
                variant="secondary" 
                size="sm"
                onClick={resetTimer}
              >
                Reiniciar
              </GlassButton>
              
              {studyTime > 0 && (
                <GlassButton 
                  variant="accent" 
                  onClick={() => setCurrentSection('study-session')}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Finalizar Sesión
                </GlassButton>
              )}
            </div>
          </div>

          <div className="text-center text-sm text-foreground/70 font-secondary">
            {isStudying ? 'Mantén el foco en tus estudios' : 'Haz clic en "Iniciar Estudio" para comenzar'}
          </div>
        </GlassContainer>

        {/* Estadísticas semanales */}
        <GlassContainer>
          <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
            Resumen Semanal
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-glass-white/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-primary font-bold text-blue-500 mb-1">
                {Math.floor(totalWeekTime / 60)}h {totalWeekTime % 60}m
              </div>
              <div className="text-sm font-secondary text-foreground/70">Total semanal</div>
            </div>
            
            <div className="bg-glass-white/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-primary font-bold text-green-500 mb-1">
                {avgWeeklyUnderstanding.toFixed(1)}/5
              </div>
              <div className="text-sm font-secondary text-foreground/70">Comprensión semanal</div>
            </div>
            
            <div className="bg-glass-white/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-primary font-bold text-purple-500 mb-1">
                {weekEntries.length}
              </div>
              <div className="text-sm font-secondary text-foreground/70">Sesiones esta semana</div>
            </div>
          </div>

          {/* Materias más estudiadas */}
          {academicEntries.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-foreground mb-3">Materias más estudiadas</h4>
              <div className="space-y-2">
                {Object.entries(
                  academicEntries.reduce((acc, entry) => {
                    acc[entry.subject] = (acc[entry.subject] || 0) + entry.study_time_minutes;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([subject, time]) => (
                    <div key={subject} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{subject}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(time / totalWeekTime) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-foreground/70 w-12 text-right">
                          {Math.floor(time / 60)}h {time % 60}m
                        </span>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </GlassContainer>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassButton 
            variant="primary" 
            className="h-20 flex flex-col gap-2"
            onClick={() => setCurrentSection('study-session')}
          >
            <BookOpen className="w-6 h-6" />
            <span>Nueva Sesión</span>
          </GlassButton>

          <GlassButton 
            variant="secondary" 
            className="h-20 flex flex-col gap-2"
            onClick={() => setCurrentSection('subjects')}
          >
            <GraduationCap className="w-6 h-6" />
            <span>Mis Materias</span>
          </GlassButton>

          <GlassButton 
            variant="accent" 
            className="h-20 flex flex-col gap-2"
            onClick={() => setCurrentSection('progress')}
          >
            <BarChart3 className="w-6 h-6" />
            <span>Mi Progreso</span>
          </GlassButton>
        </div>
      </div>
    );
  };

  const renderStudySession = () => (
    <GlassContainer>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-blue-500" />
        </div>
        <h2 className="text-xl font-primary font-bold text-foreground">
          Registrar Sesión de Estudio
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Materia *
            </label>
            <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
              <SelectTrigger className="bg-glass-white/20 border-glass-white/30">
                <SelectValue placeholder="Selecciona una materia" />
              </SelectTrigger>
              <SelectContent>
                {UNIVERSITY_SUBJECTS.map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Tema/Capítulo *
            </label>
            <Input
              value={formData.topic}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              className="bg-glass-white/20 border-glass-white/30 text-foreground"
              placeholder="ej: Derivadas, Revolución Francesa, etc."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Tiempo de estudio (minutos)
            </label>
            <Input
              type="number"
              value={formData.study_time_minutes || studyTime.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, study_time_minutes: e.target.value }))}
              className="bg-glass-white/20 border-glass-white/30 text-foreground"
              placeholder="120"
            />
            {studyTime > 0 && (
              <p className="text-xs text-foreground/60 mt-1">
                Tiempo del cronómetro: {studyTime} minutos
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Progreso completado (%)
            </label>
            <Input
              type="range"
              min="0"
              max="100"
              value={formData.completion_percentage}
              onChange={(e) => setFormData(prev => ({ ...prev, completion_percentage: e.target.value }))}
              className="w-full mb-2"
            />
            <div className="text-center text-lg font-bold text-foreground">
              {formData.completion_percentage}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Dificultad del tema (1-5)
            </label>
            <Select value={formData.difficulty_rating} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty_rating: value }))}>
              <SelectTrigger className="bg-glass-white/20 border-glass-white/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{value} - {label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Nivel de comprensión (1-5)
            </label>
            <Select value={formData.understanding_level} onValueChange={(value) => setFormData(prev => ({ ...prev, understanding_level: value }))}>
              <SelectTrigger className="bg-glass-white/20 border-glass-white/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(UNDERSTANDING_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{value} - {label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">
            Objetivos para la próxima sesión (separar con comas)
          </label>
          <Input
            value={formData.goals}
            onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
            className="bg-glass-white/20 border-glass-white/30 text-foreground"
            placeholder="ej: Terminar ejercicios 1-10, Repasar conceptos"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">
            Logros de esta sesión (separar con comas)
          </label>
          <Input
            value={formData.achievements}
            onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
            className="bg-glass-white/20 border-glass-white/30 text-foreground"
            placeholder="ej: Entendí las derivadas, Resolví 15 problemas"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">
            Notas adicionales
          </label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="bg-glass-white/20 border-glass-white/30 text-foreground"
            placeholder="Reflexiones, dudas, puntos importantes..."
            rows={3}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            Guardar Sesión
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setCurrentSection('overview');
              resetForm();
            }}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </GlassContainer>
  );

  const renderSubjects = () => {
    const subjectStats = academicEntries.reduce((acc, entry) => {
      if (!acc[entry.subject]) {
        acc[entry.subject] = {
          totalTime: 0,
          sessions: 0,
          avgUnderstanding: 0,
          avgDifficulty: 0,
          totalUnderstanding: 0,
          totalDifficulty: 0
        };
      }
      acc[entry.subject].totalTime += entry.study_time_minutes;
      acc[entry.subject].sessions += 1;
      acc[entry.subject].totalUnderstanding += entry.understanding_level;
      acc[entry.subject].totalDifficulty += entry.difficulty_rating;
      acc[entry.subject].avgUnderstanding = acc[entry.subject].totalUnderstanding / acc[entry.subject].sessions;
      acc[entry.subject].avgDifficulty = acc[entry.subject].totalDifficulty / acc[entry.subject].sessions;
      return acc;
    }, {} as Record<string, any>);

    return (
      <GlassContainer>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-green-500" />
          </div>
          <h2 className="text-xl font-primary font-bold text-foreground">
            Mis Materias
          </h2>
        </div>

        {Object.keys(subjectStats).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(subjectStats)
              .sort(([,a], [,b]) => b.totalTime - a.totalTime)
              .map(([subject, stats]) => (
                <div key={subject} className="bg-glass-white/20 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium text-foreground">{subject}</h3>
                    <div className="text-right">
                      <div className="text-sm font-bold text-foreground">
                        {Math.floor(stats.totalTime / 60)}h {stats.totalTime % 60}m
                      </div>
                      <div className="text-xs text-foreground/70">tiempo total</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-500">{stats.sessions}</div>
                      <div className="text-xs text-foreground/70">Sesiones</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-500">
                        {stats.avgUnderstanding.toFixed(1)}/5
                      </div>
                      <div className="text-xs text-foreground/70">Comprensión</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-500">
                        {stats.avgDifficulty.toFixed(1)}/5
                      </div>
                      <div className="text-xs text-foreground/70">Dificultad</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-500">
                        {Math.round((stats.totalTime / getTotalStudyTime()) * 100)}%
                      </div>
                      <div className="text-xs text-foreground/70">Del total</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-foreground/70">Progreso de comprensión</span>
                      <span className="text-sm text-foreground">{stats.avgUnderstanding.toFixed(1)}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${(stats.avgUnderstanding / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        ) : (
          <div className="text-center py-8">
            <GraduationCap className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
            <p className="text-foreground/70 mb-4">
              No has registrado sesiones de estudio aún
            </p>
            <GlassButton 
              variant="primary"
              onClick={() => setCurrentSection('study-session')}
            >
              Crear Primera Sesión
            </GlassButton>
          </div>
        )}
      </GlassContainer>
    );
  };

  const renderProgress = () => {
    const totalTime = getTotalStudyTime();
    const avgUnderstanding = academicEntries.length > 0
      ? academicEntries.reduce((acc, entry) => acc + entry.understanding_level, 0) / academicEntries.length
      : 0;
    const totalSessions = academicEntries.length;
    const avgDifficulty = academicEntries.length > 0
      ? academicEntries.reduce((acc, entry) => acc + entry.difficulty_rating, 0) / academicEntries.length
      : 0;

    return (
      <GlassContainer>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-purple-500" />
          </div>
          <h2 className="text-xl font-primary font-bold text-foreground">
            Análisis de Progreso Académico
          </h2>
        </div>

        {academicEntries.length > 0 ? (
          <div className="space-y-6">
            {/* Métricas generales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-glass-white/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-primary font-bold text-blue-500 mb-1">
                  {totalSessions}
                </div>
                <div className="text-sm font-secondary text-foreground/70">Total sesiones</div>
              </div>
              
              <div className="bg-glass-white/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-primary font-bold text-green-500 mb-1">
                  {Math.floor(totalTime / 60)}h
                </div>
                <div className="text-sm font-secondary text-foreground/70">Tiempo total</div>
              </div>
              
              <div className="bg-glass-white/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-primary font-bold text-purple-500 mb-1">
                  {avgUnderstanding.toFixed(1)}
                </div>
                <div className="text-sm font-secondary text-foreground/70">Comprensión prom.</div>
              </div>
              
              <div className="bg-glass-white/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-primary font-bold text-orange-500 mb-1">
                  {avgDifficulty.toFixed(1)}
                </div>
                <div className="text-sm font-secondary text-foreground/70">Dificultad prom.</div>
              </div>
            </div>

            {/* Insights personalizados */}
            <div className="bg-glass-white/20 rounded-xl p-6">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Insights Académicos
              </h3>
              <div className="space-y-3 text-sm text-foreground/80">
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <p>
                    Has estudiado un total de <strong>{Math.floor(totalTime / 60)} horas y {totalTime % 60} minutos</strong> 
                    en {totalSessions} sesiones.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-blue-500 mt-0.5" />
                  <p>
                    Tu nivel de comprensión promedio es <strong>{avgUnderstanding.toFixed(1)}/5</strong>, 
                    lo que indica {avgUnderstanding >= 4 ? 'excelente' : avgUnderstanding >= 3 ? 'buen' : 'que necesitas reforzar'} progreso.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Brain className="w-4 h-4 text-purple-500 mt-0.5" />
                  <p>
                    Trabajas con temas de dificultad promedio <strong>{avgDifficulty.toFixed(1)}/5</strong>,
                    {avgDifficulty >= 4 ? ' desafiándote constantemente' : ' manteniéndote en tu zona de confort'}.
                  </p>
                </div>
                {totalTime >= 600 && (
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-green-500 mt-0.5" />
                    <p>
                      ¡Felicitaciones! Has alcanzado más de 10 horas de estudio. 
                      Mantén este gran hábito académico.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Progreso semanal */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Progreso Semanal</h3>
              <div className="grid grid-cols-7 gap-2">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => {
                  const dayEntries = academicEntries.filter(entry => {
                    const entryDate = new Date(entry.date);
                    const today = new Date();
                    const dayOfWeek = (today.getDay() - index + 6) % 7;
                    const targetDate = new Date(today);
                    targetDate.setDate(today.getDate() - dayOfWeek);
                    return entryDate.toDateString() === targetDate.toDateString();
                  });
                  
                  const dayTime = dayEntries.reduce((acc, entry) => acc + entry.study_time_minutes, 0);
                  
                  return (
                    <div key={index} className="text-center">
                      <div className="text-xs font-secondary text-foreground/70 mb-2">{day}</div>
                      <div className={`h-12 rounded-lg flex items-end justify-center ${
                        dayTime > 0 ? 'bg-blue-500' : 'bg-gray-200'
                      }`}>
                        <span className={`text-xs font-bold mb-1 ${
                          dayTime > 0 ? 'text-white' : 'text-gray-400'
                        }`}>
                          {dayTime > 0 ? `${Math.floor(dayTime / 60)}h` : '0'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
            <p className="text-foreground/70 mb-4">
              No hay datos suficientes para mostrar análisis
            </p>
            <GlassButton 
              variant="primary"
              onClick={() => setCurrentSection('study-session')}
            >
              Comenzar a Estudiar
            </GlassButton>
          </div>
        )}
      </GlassContainer>
    );
  };

  const renderHistory = () => (
    <GlassContainer>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-orange-500" />
        </div>
        <h2 className="text-xl font-primary font-bold text-foreground">
          Historial de Estudio
        </h2>
      </div>

      {academicEntries.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {academicEntries.map((entry) => (
            <div key={entry.id} className="bg-glass-white/20 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-foreground">{entry.subject}</h3>
                  <p className="text-sm text-foreground/70">{entry.topic}</p>
                  <p className="text-xs text-foreground/60">{entry.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-foreground">
                    {Math.floor(entry.study_time_minutes / 60)}h {entry.study_time_minutes % 60}m
                  </div>
                  <div className="text-xs text-foreground/70">
                    {entry.completion_percentage}% completado
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <span className="text-xs text-foreground/60">Comprensión: </span>
                  <span className="text-sm text-green-500 font-medium">
                    {entry.understanding_level}/5
                  </span>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className="bg-green-500 h-1 rounded-full"
                      style={{ width: `${(entry.understanding_level / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-foreground/60">Dificultad: </span>
                  <span className="text-sm text-orange-500 font-medium">
                    {entry.difficulty_rating}/5
                  </span>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className="bg-orange-500 h-1 rounded-full"
                      style={{ width: `${(entry.difficulty_rating / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {entry.goals.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs text-foreground/60">Objetivos: </span>
                  <span className="text-sm text-foreground/80">
                    {entry.goals.join(', ')}
                  </span>
                </div>
              )}

              {entry.achievements.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs text-foreground/60">Logros: </span>
                  <span className="text-sm text-foreground/80">
                    {entry.achievements.join(', ')}
                  </span>
                </div>
              )}

              {entry.notes && (
                <div className="mt-3 p-3 bg-glass-white/20 rounded-lg">
                  <p className="text-sm text-foreground/80 italic">
                    "{entry.notes}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
          <p className="text-foreground/70 mb-4">
            No hay sesiones de estudio registradas
          </p>
          <GlassButton 
            variant="primary"
            onClick={() => setCurrentSection('study-session')}
          >
            Crear Primera Sesión
          </GlassButton>
        </div>
      )}
    </GlassContainer>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'overview':
        return renderOverview();
      case 'study-session':
        return renderStudySession();
      case 'subjects':
        return renderSubjects();
      case 'progress':
        return renderProgress();
      case 'history':
        return renderHistory();
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <GradientBackground variant="primary" className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </GradientBackground>
    );
  }

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
                  <h1 className="text-xl font-primary font-bold text-foreground">Módulo Académico</h1>
                  <p className="text-sm text-foreground/70 font-secondary">Optimiza tu rendimiento universitario</p>
                </div>
              </div>
            </div>

            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </GlassContainer>

        {/* Content */}
        {renderContent()}
      </div>
    </GradientBackground>
  );
};