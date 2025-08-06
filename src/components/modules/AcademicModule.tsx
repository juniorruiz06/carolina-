import React, { useState } from 'react';
import { BookOpen, Target, Clock, Plus, CheckCircle, Calendar, TrendingUp } from 'lucide-react';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { GlassButton } from '@/components/ui/GlassButton';
import { useToast } from '@/components/ui/use-toast';

interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number;
}

export const AcademicModule: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'tasks' | 'progress' | 'add'>('tasks');
  const [newTask, setNewTask] = useState({
    title: '',
    subject: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    estimatedTime: 60
  });

  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Estudiar biología',
      subject: 'Biología',
      dueDate: '2025-01-07',
      completed: false,
      priority: 'high',
      estimatedTime: 120
    },
    {
      id: '2',
      title: 'Ensayo de literatura',
      subject: 'Literatura',
      dueDate: '2025-01-09',
      completed: false,
      priority: 'medium',
      estimatedTime: 180
    },
    {
      id: '3',
      title: 'Problemas de matemáticas',
      subject: 'Matemáticas',
      dueDate: '2025-01-06',
      completed: true,
      priority: 'high',
      estimatedTime: 90
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-foreground/70';
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20';
      case 'medium': return 'bg-yellow-500/20';
      case 'low': return 'bg-green-500/20';
      default: return 'bg-glass-white/10';
    }
  };

  const handleSaveTask = async () => {
    try {
      toast({
        title: "¡Tarea creada!",
        description: "Tu nueva tarea ha sido agregada.",
      });
      setNewTask({
        title: '',
        subject: '',
        dueDate: '',
        priority: 'medium',
        estimatedTime: 60
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la tarea.",
        variant: "destructive",
      });
    }
  };

  const renderTasksTab = () => (
    <div className="space-y-4">
      {/* Today's Tasks */}
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          Tareas de Hoy
        </h3>
        <div className="space-y-3">
          {tasks.filter(task => !task.completed).map((task) => (
            <div key={task.id} className="flex items-center gap-3 p-3 bg-glass-white/10 rounded-xl">
              <div className={`w-6 h-6 border-2 rounded-full ${
                task.completed ? 'bg-contigo-accent border-contigo-accent' : 'border-foreground/30'
              }`}>
                {task.completed && <CheckCircle className="w-6 h-6 text-white" />}
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground">{task.title}</div>
                <div className="text-sm text-foreground/70 flex items-center gap-2">
                  <span>{task.subject}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.estimatedTime}min
                  </span>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityBg(task.priority)} ${getPriorityColor(task.priority)}`}>
                {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
              </div>
            </div>
          ))}
        </div>
      </GlassContainer>

      {/* Study Session */}
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          Sesión de Estudio
        </h3>
        <div className="text-center">
          <div className="w-20 h-20 bg-contigo-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-10 h-10 text-contigo-secondary" />
          </div>
          <p className="text-foreground/70 mb-4">
            Inicia una sesión de estudio enfocada
          </p>
          <div className="grid grid-cols-3 gap-2">
            <GlassButton variant="secondary" size="sm">25min</GlassButton>
            <GlassButton variant="secondary" size="sm">45min</GlassButton>
            <GlassButton variant="secondary" size="sm">60min</GlassButton>
          </div>
        </div>
      </GlassContainer>

      {/* Quick Stats */}
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          Estadísticas Rápidas
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-contigo-primary">5</div>
            <div className="text-sm text-foreground/70">Tareas pendientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-contigo-accent">85%</div>
            <div className="text-sm text-foreground/70">Completadas esta semana</div>
          </div>
        </div>
      </GlassContainer>
    </div>
  );

  const renderProgressTab = () => (
    <div className="space-y-4">
      {/* Weekly Progress */}
      <GlassContainer>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-contigo-secondary" />
          <h3 className="text-lg font-primary font-semibold text-foreground">
            Progreso Semanal
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-foreground/70">Tareas completadas</span>
            <span className="font-semibold text-foreground">12/15</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground/70">Tiempo de estudio</span>
            <span className="font-semibold text-foreground">8.5 horas</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground/70">Promedio diario</span>
            <span className="font-semibold text-foreground">1.2 horas</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground/70">Racha actual</span>
            <span className="font-semibold text-contigo-accent">6 días</span>
          </div>
        </div>
      </GlassContainer>

      {/* Subject Performance */}
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          Rendimiento por Materia
        </h3>
        <div className="space-y-3">
          {['Matemáticas', 'Biología', 'Literatura', 'Historia'].map((subject) => (
            <div key={subject} className="flex items-center justify-between">
              <span className="text-foreground/70">{subject}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-glass-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-contigo-secondary rounded-full" 
                    style={{ width: `${Math.random() * 40 + 60}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground w-8">
                  {Math.floor(Math.random() * 40 + 60)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassContainer>

      {/* Study Insights */}
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          💡 Insights
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-contigo-accent/20 rounded-xl">
            <p className="text-foreground/80 text-sm">
              Tu productividad es mayor en las mañanas. Considera programar tareas importantes entre 9-11 AM.
            </p>
          </div>
          <div className="p-3 bg-contigo-primary/20 rounded-xl">
            <p className="text-foreground/80 text-sm">
              Has mejorado un 25% en matemáticas esta semana. ¡Sigue así!
            </p>
          </div>
        </div>
      </GlassContainer>
    </div>
  );

  const renderAddTab = () => (
    <div className="space-y-4">
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          Nueva Tarea
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground/70 mb-2 block">
              Título de la tarea
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              className="w-full p-3 glass-container border-0 text-foreground"
              placeholder="Ej: Estudiar biología"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/70 mb-2 block">
              Materia
            </label>
            <select
              value={newTask.subject}
              onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
              className="w-full p-3 glass-container border-0 text-foreground"
            >
              <option value="">Seleccionar materia</option>
              <option value="Matemáticas">Matemáticas</option>
              <option value="Biología">Biología</option>
              <option value="Literatura">Literatura</option>
              <option value="Historia">Historia</option>
              <option value="Física">Física</option>
              <option value="Química">Química</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/70 mb-2 block">
              Fecha límite
            </label>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              className="w-full p-3 glass-container border-0 text-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/70 mb-2 block">
              Prioridad
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['low', 'medium', 'high'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => setNewTask({...newTask, priority: priority as any})}
                  className={`p-3 rounded-xl font-medium transition-all ${
                    newTask.priority === priority 
                      ? `${getPriorityBg(priority)} ${getPriorityColor(priority)}` 
                      : 'bg-glass-white/10 text-foreground/70'
                  }`}
                >
                  {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Baja'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/70 mb-2 block">
              Tiempo estimado (minutos)
            </label>
            <input
              type="number"
              value={newTask.estimatedTime}
              onChange={(e) => setNewTask({...newTask, estimatedTime: parseInt(e.target.value) || 60})}
              className="w-full p-3 glass-container border-0 text-foreground"
              placeholder="60"
            />
          </div>

          <GlassButton 
            variant="primary" 
            className="w-full"
            onClick={handleSaveTask}
            disabled={!newTask.title || !newTask.subject}
          >
            Crear Tarea
          </GlassButton>
        </div>
      </GlassContainer>
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <GlassContainer className="text-center">
        <div className="w-16 h-16 bg-contigo-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-contigo-secondary" />
        </div>
        <h2 className="text-xl font-primary font-bold text-foreground mb-2">
          Módulo Académico
        </h2>
        <p className="text-foreground/70 font-secondary">
          Organiza tu aprendizaje y alcanza tus metas
        </p>
      </GlassContainer>

      {/* Tabs */}
      <div className="flex gap-2 p-1 glass-container rounded-2xl">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'tasks' ? 'bg-contigo-secondary/30 text-foreground' : 'text-foreground/70'
          }`}
        >
          Tareas
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'progress' ? 'bg-contigo-secondary/30 text-foreground' : 'text-foreground/70'
          }`}
        >
          Progreso
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'add' ? 'bg-contigo-secondary/30 text-foreground' : 'text-foreground/70'
          }`}
        >
          Agregar
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'tasks' && renderTasksTab()}
      {activeTab === 'progress' && renderProgressTab()}
      {activeTab === 'add' && renderAddTab()}
    </div>
  );
};