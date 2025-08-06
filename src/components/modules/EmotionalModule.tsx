import React, { useState } from 'react';
import { Heart, Smile, Frown, Calendar, Plus, BookOpen, TrendingUp } from 'lucide-react';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { GlassButton } from '@/components/ui/GlassButton';
import { useToast } from '@/components/ui/use-toast';

export const EmotionalModule: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'today' | 'journal' | 'mood'>('today');
  const [journalEntry, setJournalEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<number>(5);
  const [gratitude, setGratitude] = useState<string[]>(['', '', '']);

  const moods = [
    { value: 1, emoji: '😢', label: 'Muy triste', color: 'text-red-500' },
    { value: 2, emoji: '😔', label: 'Triste', color: 'text-red-400' },
    { value: 3, emoji: '😐', label: 'Neutral', color: 'text-yellow-500' },
    { value: 4, emoji: '🙂', label: 'Bien', color: 'text-green-400' },
    { value: 5, emoji: '😊', label: 'Muy bien', color: 'text-green-500' },
  ];

  const handleSaveMood = async () => {
    try {
      toast({
        title: "¡Perfecto!",
        description: "Tu estado emocional ha sido registrado.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el estado emocional.",
        variant: "destructive",
      });
    }
  };

  const handleSaveJournal = async () => {
    try {
      toast({
        title: "¡Genial!",
        description: "Tu entrada de diario ha sido guardada.",
      });
      setJournalEntry('');
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
      {/* Current Mood */}
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          ¿Cómo te sientes hoy?
        </h3>
        <div className="flex justify-center">
          <div className="text-6xl">😊</div>
        </div>
        <p className="text-center text-foreground/70 mt-2">
          Te sientes muy bien hoy
        </p>
      </GlassContainer>

      {/* Emotional Summary */}
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          Resumen Emocional
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-foreground/70">Estado predominante</span>
            <span className="font-semibold text-foreground">Positivo</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground/70">Días consecutivos positivos</span>
            <span className="font-semibold text-foreground">5 días</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground/70">Entradas de diario</span>
            <span className="font-semibold text-foreground">12</span>
          </div>
        </div>
      </GlassContainer>

      {/* Quick Mood Check */}
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          Check-in Rápido
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`p-3 rounded-xl transition-all ${
                selectedMood === mood.value 
                  ? 'bg-contigo-primary/30 scale-110' 
                  : 'bg-glass-white/10 hover:bg-glass-white/20'
              }`}
            >
              <div className="text-2xl">{mood.emoji}</div>
            </button>
          ))}
        </div>
        <GlassButton 
          variant="primary" 
          size="sm" 
          className="w-full mt-4"
          onClick={handleSaveMood}
        >
          Registrar Estado
        </GlassButton>
      </GlassContainer>

      {/* Motivational Quote */}
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          💫 Frase Inspiradora
        </h3>
        <p className="text-foreground/80 font-secondary italic text-center">
          "Cada día es una nueva oportunidad para crecer emocionalmente y encontrar la paz interior."
        </p>
      </GlassContainer>
    </div>
  );

  const renderJournalTab = () => (
    <div className="space-y-4">
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          Diario Personal
        </h3>
        <textarea
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          className="w-full h-40 p-4 glass-container border-0 text-foreground resize-none"
          placeholder="Escribe sobre tu día, tus emociones, pensamientos o experiencias..."
        />
        <GlassButton 
          variant="primary" 
          className="w-full mt-4"
          onClick={handleSaveJournal}
          disabled={!journalEntry.trim()}
        >
          Guardar Entrada
        </GlassButton>
      </GlassContainer>

      {/* Gratitude Section */}
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          🙏 Gratitud Diaria
        </h3>
        <p className="text-foreground/70 text-sm mb-4">
          Escribe 3 cosas por las que te sientes agradecido hoy:
        </p>
        <div className="space-y-3">
          {gratitude.map((item, index) => (
            <input
              key={index}
              type="text"
              value={item}
              onChange={(e) => {
                const newGratitude = [...gratitude];
                newGratitude[index] = e.target.value;
                setGratitude(newGratitude);
              }}
              className="w-full p-3 glass-container border-0 text-foreground"
              placeholder={`${index + 1}. Algo que agradeces...`}
            />
          ))}
        </div>
      </GlassContainer>

      {/* Recent Entries */}
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          Entradas Recientes
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-glass-white/10 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground/70">Ayer</span>
              <span className="text-2xl">😊</span>
            </div>
            <p className="text-foreground/80 text-sm">
              Hoy fue un día productivo. Logré completar mis metas...
            </p>
          </div>
          
          <div className="p-3 bg-glass-white/10 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground/70">Hace 2 días</span>
              <span className="text-2xl">🙂</span>
            </div>
            <p className="text-foreground/80 text-sm">
              Me sentí un poco ansioso por la presentación, pero...
            </p>
          </div>
        </div>
      </GlassContainer>
    </div>
  );

  const renderMoodTab = () => (
    <div className="space-y-4">
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          Registro de Estados de Ánimo
        </h3>
        <div className="space-y-4">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                selectedMood === mood.value 
                  ? 'bg-contigo-primary/30 border-2 border-contigo-primary/50' 
                  : 'bg-glass-white/10 hover:bg-glass-white/20'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{mood.emoji}</span>
                <div>
                  <div className="font-semibold text-foreground">{mood.label}</div>
                  <div className="text-sm text-foreground/70">
                    Toca para seleccionar este estado
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </GlassContainer>

      {/* Mood Triggers */}
      <GlassContainer>
        <h3 className="text-lg font-primary font-semibold text-foreground mb-4">
          ¿Qué influyó en tu estado?
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {['Trabajo', 'Familia', 'Salud', 'Clima', 'Ejercicio', 'Sueño'].map((trigger) => (
            <button
              key={trigger}
              className="p-2 bg-glass-white/10 rounded-lg text-sm text-foreground/70 hover:bg-glass-white/20 transition-all"
            >
              {trigger}
            </button>
          ))}
        </div>
      </GlassContainer>

      {/* Mood Stats */}
      <GlassContainer>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-contigo-heart" />
          <h3 className="text-lg font-primary font-semibold text-foreground">
            Estadísticas
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-foreground/70">Promedio semanal</span>
            <span className="font-semibold text-foreground">4.2/5</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground/70">Mejor día</span>
            <span className="font-semibold text-foreground">Viernes</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground/70">Tendencia</span>
            <span className="font-semibold text-contigo-accent">↗ Mejorando</span>
          </div>
        </div>
      </GlassContainer>
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <GlassContainer className="text-center">
        <div className="w-16 h-16 bg-contigo-heart/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-contigo-heart" />
        </div>
        <h2 className="text-xl font-primary font-bold text-foreground mb-2">
          Módulo Emocional
        </h2>
        <p className="text-foreground/70 font-secondary">
          Cuida tu bienestar emocional y mental
        </p>
      </GlassContainer>

      {/* Tabs */}
      <div className="flex gap-2 p-1 glass-container rounded-2xl">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'today' ? 'bg-contigo-heart/30 text-foreground' : 'text-foreground/70'
          }`}
        >
          Hoy
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'journal' ? 'bg-contigo-heart/30 text-foreground' : 'text-foreground/70'
          }`}
        >
          Diario
        </button>
        <button
          onClick={() => setActiveTab('mood')}
          className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'mood' ? 'bg-contigo-heart/30 text-foreground' : 'text-foreground/70'
          }`}
        >
          Estado
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'today' && renderTodayTab()}
      {activeTab === 'journal' && renderJournalTab()}
      {activeTab === 'mood' && renderMoodTab()}
    </div>
  );
};