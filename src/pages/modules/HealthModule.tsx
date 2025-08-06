import { useState, useEffect } from "react";
import { GradientBackground } from "@/components/layout/GradientBackground";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { GlassButton } from "@/components/ui/GlassButton";
import { useHealthData } from "@/hooks/useHealthData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Activity, 
  Heart,
  Moon,
  Droplets,
  Plus,
  TrendingUp,
  Calendar
} from "lucide-react";
import contigoHeart from "@/assets/contigo-heart.png";

interface HealthModuleProps {
  onBack: () => void;
}

type HealthSection = 'overview' | 'daily-entry' | 'history';

export const HealthModule = ({ onBack }: HealthModuleProps) => {
  const { healthEntries, todayEntry, loading, createEntry, updateEntry } = useHealthData();
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState<HealthSection>('overview');
  const [formData, setFormData] = useState({
    weight: '',
    sleep_hours: '',
    water_glasses: '',
    exercise_minutes: '',
    mood_score: '',
    energy_level: '',
    stress_level: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const entryData = {
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      sleep_hours: formData.sleep_hours ? parseFloat(formData.sleep_hours) : undefined,
      water_glasses: formData.water_glasses ? parseInt(formData.water_glasses) : 0,
      exercise_minutes: formData.exercise_minutes ? parseInt(formData.exercise_minutes) : 0,
      mood_score: formData.mood_score ? parseInt(formData.mood_score) : undefined,
      energy_level: formData.energy_level ? parseInt(formData.energy_level) : undefined,
      stress_level: formData.stress_level ? parseInt(formData.stress_level) : undefined,
      notes: formData.notes || undefined,
    };

    const success = todayEntry 
      ? await updateEntry(todayEntry.id, entryData)
      : await createEntry(entryData);
    
    if (success) {
      setCurrentSection('overview');
      setFormData({
        weight: '',
        sleep_hours: '',
        water_glasses: '',
        exercise_minutes: '',
        mood_score: '',
        energy_level: '',
        stress_level: '',
        notes: ''
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Cargar datos del día actual cuando existe
  useEffect(() => {
    if (todayEntry && currentSection === 'daily-entry') {
      setFormData({
        weight: todayEntry.weight?.toString() || '',
        sleep_hours: todayEntry.sleep_hours?.toString() || '',
        water_glasses: todayEntry.water_glasses?.toString() || '',
        exercise_minutes: todayEntry.exercise_minutes?.toString() || '',
        mood_score: todayEntry.mood_score?.toString() || '',
        energy_level: todayEntry.energy_level?.toString() || '',
        stress_level: todayEntry.stress_level?.toString() || '',
        notes: todayEntry.notes || ''
      });
    }
  }, [todayEntry, currentSection]);

  const renderOverview = () => {
    const weekEntries = healthEntries.slice(0, 7);
    const avgMood = weekEntries.reduce((acc, entry) => acc + (entry.mood_score || 0), 0) / (weekEntries.filter(e => e.mood_score).length || 1);
    const totalExercise = weekEntries.reduce((acc, entry) => acc + entry.exercise_minutes, 0);
    const avgSleep = weekEntries.reduce((acc, entry) => acc + (entry.sleep_hours || 0), 0) / (weekEntries.filter(e => e.sleep_hours).length || 1);
    const avgWater = weekEntries.reduce((acc, entry) => acc + entry.water_glasses, 0) / (weekEntries.length || 1);

    return (
      <div className="space-y-6">
        {/* Métricas de hoy */}
        <GlassContainer>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-500" />
            </div>
            <h2 className="text-xl font-primary font-bold text-foreground">
              Métricas de Hoy
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-glass-white/30 rounded-xl p-4 text-center">
              <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-primary font-bold text-red-500 mb-1">
                {todayEntry?.mood_score || '--'}
              </div>
              <div className="text-sm font-secondary text-foreground/70">Estado de ánimo</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all" 
                  style={{ width: `${(todayEntry?.mood_score || 0) * 10}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-glass-white/30 rounded-xl p-4 text-center">
              <Activity className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-primary font-bold text-green-500 mb-1">
                {todayEntry?.exercise_minutes || 0}
              </div>
              <div className="text-sm font-secondary text-foreground/70">Min ejercicio</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all" 
                  style={{ width: `${Math.min((todayEntry?.exercise_minutes || 0) / 60 * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-glass-white/30 rounded-xl p-4 text-center">
              <Moon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-primary font-bold text-blue-500 mb-1">
                {todayEntry?.sleep_hours || '--'}
              </div>
              <div className="text-sm font-secondary text-foreground/70">Horas sueño</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all" 
                  style={{ width: `${Math.min((todayEntry?.sleep_hours || 0) / 8 * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-glass-white/30 rounded-xl p-4 text-center">
              <Droplets className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-primary font-bold text-cyan-500 mb-1">
                {todayEntry?.water_glasses || 0}/8
              </div>
              <div className="text-sm font-secondary text-foreground/70">Vasos agua</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-cyan-500 h-2 rounded-full transition-all" 
                  style={{ width: `${Math.min((todayEntry?.water_glasses || 0) / 8 * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </GlassContainer>

        {/* Estadísticas semanales */}
        <GlassContainer>
          <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
            Resumen Semanal (últimos 7 días)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-red-400">{avgMood.toFixed(1)}</div>
              <div className="text-sm text-foreground/70">Ánimo promedio</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{totalExercise}min</div>
              <div className="text-sm text-foreground/70">Ejercicio total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{avgSleep.toFixed(1)}h</div>
              <div className="text-sm text-foreground/70">Sueño promedio</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-400">{avgWater.toFixed(1)}</div>
              <div className="text-sm text-foreground/70">Agua promedio</div>
            </div>
          </div>
        </GlassContainer>

        {/* Estado del registro de hoy */}
        <GlassContainer>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-primary font-semibold text-foreground">
              Registro de Hoy
            </h3>
            <GlassButton 
              variant="primary" 
              size="sm"
              onClick={() => setCurrentSection('daily-entry')}
            >
              <Plus className="w-4 h-4 mr-2" />
              {todayEntry ? 'Editar' : 'Registrar'}
            </GlassButton>
          </div>

          {todayEntry ? (
            <div className="bg-glass-white/20 rounded-xl p-4">
              <p className="text-foreground/80 font-secondary mb-2">
                ✅ Ya completaste tu registro de hoy
              </p>
              <div className="flex gap-4 text-sm text-foreground/70 flex-wrap">
                {todayEntry.mood_score && <span>😊 {todayEntry.mood_score}/10</span>}
                {todayEntry.exercise_minutes > 0 && <span>🏃 {todayEntry.exercise_minutes}min</span>}
                {todayEntry.sleep_hours && <span>😴 {todayEntry.sleep_hours}h</span>}
                {todayEntry.water_glasses > 0 && <span>💧 {todayEntry.water_glasses}/8</span>}
                {todayEntry.weight && <span>⚖️ {todayEntry.weight}kg</span>}
              </div>
              {todayEntry.notes && (
                <p className="text-sm text-foreground/70 italic mt-2">
                  "{todayEntry.notes}"
                </p>
              )}
            </div>
          ) : (
            <div className="bg-glass-white/20 rounded-xl p-4">
              <p className="text-foreground/80 font-secondary">
                📝 No has registrado tus métricas de hoy
              </p>
              <p className="text-sm text-foreground/60 mt-1">
                Haz un seguimiento de tu bienestar diario
              </p>
            </div>
          )}
        </GlassContainer>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassButton 
            variant="secondary" 
            className="h-20 flex flex-col gap-2"
            onClick={() => setCurrentSection('history')}
          >
            <TrendingUp className="w-6 h-6" />
            <span>Ver Historial ({healthEntries.length})</span>
          </GlassButton>

          <GlassButton 
            variant="accent" 
            className="h-20 flex flex-col gap-2"
            onClick={() => setCurrentSection('daily-entry')}
          >
            <Calendar className="w-6 h-6" />
            <span>Registro Diario</span>
          </GlassButton>
        </div>
      </div>
    );
  };

  const renderDailyEntry = () => (
    <GlassContainer>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-blue-500" />
        </div>
        <h2 className="text-xl font-primary font-bold text-foreground">
          {todayEntry ? 'Editar Registro de Hoy' : 'Registro Diario'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Peso (kg)
            </label>
            <Input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              className="bg-glass-white/20 border-glass-white/30 text-foreground"
              placeholder="70.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Horas de sueño
            </label>
            <Input
              type="number"
              step="0.5"
              value={formData.sleep_hours}
              onChange={(e) => handleInputChange('sleep_hours', e.target.value)}
              className="bg-glass-white/20 border-glass-white/30 text-foreground"
              placeholder="8"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Vasos de agua
            </label>
            <Input
              type="number"
              value={formData.water_glasses}
              onChange={(e) => handleInputChange('water_glasses', e.target.value)}
              className="bg-glass-white/20 border-glass-white/30 text-foreground"
              placeholder="8"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Minutos de ejercicio
            </label>
            <Input
              type="number"
              value={formData.exercise_minutes}
              onChange={(e) => handleInputChange('exercise_minutes', e.target.value)}
              className="bg-glass-white/20 border-glass-white/30 text-foreground"
              placeholder="30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Estado de ánimo (1-10)
            </label>
            <Input
              type="number"
              min="1"
              max="10"
              value={formData.mood_score}
              onChange={(e) => handleInputChange('mood_score', e.target.value)}
              className="bg-glass-white/20 border-glass-white/30 text-foreground"
              placeholder="7"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Nivel de energía (1-10)
            </label>
            <Input
              type="number"
              min="1"
              max="10"
              value={formData.energy_level}
              onChange={(e) => handleInputChange('energy_level', e.target.value)}
              className="bg-glass-white/20 border-glass-white/30 text-foreground"
              placeholder="8"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">
            Notas adicionales
          </label>
          <Textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="bg-glass-white/20 border-glass-white/30 text-foreground"
            placeholder="¿Cómo te sentiste hoy?"
            rows={3}
          />
        </div>
        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            {todayEntry ? 'Actualizar' : 'Guardar'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setCurrentSection('overview')}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </GlassContainer>
  );

  const renderHistory = () => (
    <GlassContainer>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-purple-500" />
        </div>
        <h2 className="text-xl font-primary font-bold text-foreground">
          Historial de Salud
        </h2>
      </div>

      {healthEntries.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {healthEntries.map((entry) => (
            <div key={entry.id} className="bg-glass-white/20 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-foreground">{entry.date}</span>
                <div className="flex gap-4 text-sm text-foreground/70">
                  {entry.mood_score && <span>😊 {entry.mood_score}/10</span>}
                  {entry.exercise_minutes > 0 && <span>🏃 {entry.exercise_minutes}min</span>}
                  {entry.sleep_hours && <span>😴 {entry.sleep_hours}h</span>}
                  {entry.water_glasses > 0 && <span>💧 {entry.water_glasses} vasos</span>}
                </div>
              </div>
              {entry.notes && (
                <p className="text-foreground/60 text-sm italic">"{entry.notes}"</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-foreground/70 font-secondary">
            No hay datos históricos aún. Comienza registrando tu primera entrada.
          </p>
          <GlassButton 
            variant="primary" 
            className="mt-4"
            onClick={() => setCurrentSection('daily-entry')}
          >
            Crear Primera Entrada
          </GlassButton>
        </div>
      )}
    </GlassContainer>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'overview':
        return renderOverview();
      case 'daily-entry':
        return renderDailyEntry();
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
                  <h1 className="text-xl font-primary font-bold text-foreground">Módulo de Salud</h1>
                  <p className="text-sm text-foreground/70 font-secondary">Cuida tu bienestar físico</p>
                </div>
              </div>
            </div>

            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </GlassContainer>

        {/* Content */}
        {renderContent()}
      </div>
    </GradientBackground>
  );
};