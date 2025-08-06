import React, { useState } from 'react';
import { Activity, Heart, Droplets, Moon, Calendar, Plus, TrendingUp } from 'lucide-react';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { GlassButton } from '@/components/ui/GlassButton';
import { useHealthData } from '@/hooks/useHealthData';
import { useToast } from '@/components/ui/use-toast';

export const HealthModule: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'today' | 'stats' | 'add'>('today');
  const [newEntry, setNewEntry] = useState({
    exercise_minutes: 0,
    water_glasses: 0,
    sleep_hours: 8,
    mood_score: 5,
    energy_level: 5,
    stress_level: 3,
    notes: ''
  });

  const handleSaveEntry = async () => {
    try {
      // TODO: Implement save with useHealthData hook
      toast({
        title: "¡Genial!",
        description: "Tu entrada de salud ha sido guardada.",
      });
      setNewEntry({
        exercise_minutes: 0,
        water_glasses: 0,
        sleep_hours: 8,
        mood_score: 5,
        energy_level: 5,
        stress_level: 3,
        notes: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la entrada.",
        variant: "destructive",
      });
    }
  };

  const renderTodayTab = () => (
    <div className="space-y-4">
      {/* Today's Summary */}
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          Resumen de Hoy
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-contigo-primary/20 rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-contigo-primary" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">45</div>
              <div className="text-sm text-foreground/70">min ejercicio</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-contigo-secondary/20 rounded-full flex items-center justify-center">
              <Droplets className="w-5 h-5 text-contigo-secondary" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">6</div>
              <div className="text-sm text-foreground/70">vasos agua</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-contigo-accent/20 rounded-full flex items-center justify-center">
              <Moon className="w-5 h-5 text-contigo-accent" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">7.5</div>
              <div className="text-sm text-foreground/70">horas sueño</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-contigo-heart/20 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-contigo-heart" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">8/10</div>
              <div className="text-sm text-foreground/70">estado ánimo</div>
            </div>
          </div>
        </div>
      </GlassContainer>

      {/* Quick Actions */}
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <GlassButton variant="primary" size="sm" className="flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            <span>Beber Agua</span>
          </GlassButton>
          <GlassButton variant="secondary" size="sm" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>Ejercicio</span>
          </GlassButton>
        </div>
      </GlassContainer>

      {/* Health Tips */}
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          💡 Consejo del Día
        </h3>
        <p className="text-foreground/80 font-secondary">
          Tomar pequeños descansos cada hora puede mejorar tu concentración y reducir el estrés. 
          ¡Levántate y estírate por 2 minutos!
        </p>
      </GlassContainer>
    </div>
  );

  const renderStatsTab = () => (
    <div className="space-y-4">
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          Estadísticas Semanales
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-foreground/70">Ejercicio promedio</span>
            <span className="font-semibold text-foreground">42 min/día</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground/70">Hidratación</span>
            <span className="font-semibold text-foreground">6.5 vasos/día</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground/70">Sueño promedio</span>
            <span className="font-semibold text-foreground">7.2 horas</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground/70">Estado ánimo</span>
            <span className="font-semibold text-foreground">7.8/10</span>
          </div>
        </div>
      </GlassContainer>

      <GlassContainer>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-contigo-primary" />
          <h3 className="text-lg font-primary font-semibold text-foreground">
            Progreso
          </h3>
        </div>
        <p className="text-foreground/80 font-secondary">
          ¡Has mejorado un 15% en tu actividad física esta semana! Sigue así.
        </p>
      </GlassContainer>
    </div>
  );

  const renderAddTab = () => (
    <div className="space-y-4">
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          Registrar Actividad
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground/70 mb-2 block">
              Ejercicio (minutos)
            </label>
            <input
              type="number"
              value={newEntry.exercise_minutes}
              onChange={(e) => setNewEntry({...newEntry, exercise_minutes: parseInt(e.target.value) || 0})}
              className="w-full p-3 glass-container border-0 text-foreground"
              placeholder="0"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/70 mb-2 block">
              Vasos de agua
            </label>
            <input
              type="number"
              value={newEntry.water_glasses}
              onChange={(e) => setNewEntry({...newEntry, water_glasses: parseInt(e.target.value) || 0})}
              className="w-full p-3 glass-container border-0 text-foreground"
              placeholder="0"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/70 mb-2 block">
              Horas de sueño
            </label>
            <input
              type="number"
              step="0.5"
              value={newEntry.sleep_hours}
              onChange={(e) => setNewEntry({...newEntry, sleep_hours: parseFloat(e.target.value) || 0})}
              className="w-full p-3 glass-container border-0 text-foreground"
              placeholder="8"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/70 mb-2 block">
              Estado de ánimo (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={newEntry.mood_score}
              onChange={(e) => setNewEntry({...newEntry, mood_score: parseInt(e.target.value)})}
              className="w-full"
            />
            <div className="text-center text-foreground font-semibold">{newEntry.mood_score}/10</div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/70 mb-2 block">
              Notas (opcional)
            </label>
            <textarea
              value={newEntry.notes}
              onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
              className="w-full p-3 glass-container border-0 text-foreground h-24"
              placeholder="¿Cómo te sientes hoy?"
            />
          </div>

          <GlassButton 
            variant="primary" 
            className="w-full"
            onClick={handleSaveEntry}
          >
            Guardar Entrada
          </GlassButton>
        </div>
      </GlassContainer>
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <GlassContainer className="text-center">
        <div className="w-16 h-16 bg-contigo-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8 text-contigo-primary" />
        </div>
        <h2 className="text-xl font-primary font-bold text-foreground mb-2">
          Módulo de Salud
        </h2>
        <p className="text-foreground/70 font-secondary">
          Cuida tu bienestar físico y mental
        </p>
      </GlassContainer>

      {/* Tabs */}
      <div className="flex gap-2 p-1 glass-container rounded-2xl">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'today' ? 'bg-contigo-primary/30 text-foreground' : 'text-foreground/70'
          }`}
        >
          Hoy
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'stats' ? 'bg-contigo-primary/30 text-foreground' : 'text-foreground/70'
          }`}
        >
          Stats
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'add' ? 'bg-contigo-primary/30 text-foreground' : 'text-foreground/70'
          }`}
        >
          Agregar
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'today' && renderTodayTab()}
      {activeTab === 'stats' && renderStatsTab()}
      {activeTab === 'add' && renderAddTab()}
    </div>
  );
};