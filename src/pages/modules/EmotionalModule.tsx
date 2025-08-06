import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Calendar, TrendingUp, Save, BookOpen, Sparkles } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { GradientBackground } from '@/components/layout/GradientBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEmotionalData } from '@/hooks/useEmotionalData';
import { MoodSelector } from '@/components/emotional/MoodSelector';
import { EmotionalJournal } from '@/components/emotional/EmotionalJournal';
import { MoodTrends } from '@/components/emotional/MoodTrends';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EmotionalModuleProps {
  onBack: () => void;
}

type EmotionalSection = 'overview' | 'mood-tracker' | 'journal' | 'trends' | 'meditation';

interface Emotion {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
}

interface JournalEntry {
  gratitude: string[];
  triggers: string[];
  copingStrategies: string[];
  reflection: string;
}

export const EmotionalModule: React.FC<EmotionalModuleProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { emotionalEntries: entries, createEntry: addEntry, loading } = useEmotionalData();
  const [currentSection, setCurrentSection] = useState<EmotionalSection>('overview');
  
  // Estado para el seguimiento de estado de ánimo
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState(3);
  const [journalEntry, setJournalEntry] = useState<JournalEntry>({
    gratitude: [],
    triggers: [],
    copingStrategies: [],
    reflection: ''
  });
  const [meditationMinutes, setMeditationMinutes] = useState(0);
  const [socialConnections, setSocialConnections] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleMoodSelect = (emotion: Emotion, intensity: number) => {
    setSelectedEmotion(emotion);
    setSelectedIntensity(intensity);
  };

  const handleJournalUpdate = (entry: JournalEntry) => {
    setJournalEntry(entry);
  };

  const saveEmotionalEntry = async () => {
    if (!selectedEmotion) {
      toast({
        title: "Selecciona una emoción",
        description: "Por favor selecciona cómo te sientes antes de guardar.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await addEntry({
        primary_emotion: selectedEmotion.id,
        emotion_intensity: selectedIntensity,
        reflection_notes: journalEntry.reflection,
        gratitude_items: journalEntry.gratitude,
        triggers: journalEntry.triggers,
        coping_strategies: journalEntry.copingStrategies,
        meditation_minutes: meditationMinutes,
        social_connections: socialConnections,
      });

      toast({
        title: "¡Registro guardado!",
        description: `Tu estado emocional del ${format(new Date(), 'dd/MM/yyyy')} ha sido registrado.`,
      });

      // Resetear el formulario
      setSelectedEmotion(null);
      setSelectedIntensity(3);
      setJournalEntry({
        gratitude: [],
        triggers: [],
        copingStrategies: [],
        reflection: ''
      });
      setMeditationMinutes(0);
      setSocialConnections(0);
      
      // Volver al overview
      setCurrentSection('overview');
    } catch (error) {
      console.error('Error saving emotional entry:', error);
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar tu registro emocional. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
          <Heart className="h-8 w-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Bienestar Emocional
          </h2>
          <p className="text-gray-300 max-w-md mx-auto">
            Conecta con tus emociones y cultiva tu bienestar mental
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassContainer className="p-6 hover:scale-105 transition-all duration-300">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-400" />
            Estado de Ánimo
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            Registra cómo te sientes y descubre patrones en tus emociones
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
              Reconocimiento emocional
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Análisis de tendencias
            </div>
          </div>
        </GlassContainer>

        <GlassContainer className="p-6 hover:scale-105 transition-all duration-300">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            Diario Emocional
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            Reflexiona sobre tu día con gratitud y autoconocimiento
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Reflexiones diarias
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              Práctica de gratitud
            </div>
          </div>
        </GlassContainer>
      </div>

      {/* Estadísticas rápidas */}
      {entries.length > 0 && (
        <GlassContainer className="p-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Tu progreso emocional
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1 animate-scale-in">
                {entries.length}
              </div>
              <p className="text-sm text-gray-300">Registros</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1 animate-scale-in">
                {entries.length > 0 ? Math.round(entries.reduce((sum, entry) => sum + (entry.emotion_intensity || 0), 0) / entries.length) : 0}
              </div>
              <p className="text-sm text-gray-300">Intensidad promedio</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1 animate-scale-in">
                {entries.reduce((sum, entry) => sum + (entry.meditation_minutes || 0), 0)}
              </div>
              <p className="text-sm text-gray-300">Min. meditación</p>
            </div>
          </div>
        </GlassContainer>
      )}

      {/* Mensaje motivacional */}
      <GlassContainer className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
        <div className="text-center space-y-3">
          <Sparkles className="h-8 w-8 mx-auto text-yellow-500 animate-pulse" />
          <h3 className="text-lg font-semibold text-white">
            💙 Mensaje del día
          </h3>
          <p className="text-gray-300 italic">
            "Cada emoción que sientes es válida y te enseña algo valioso sobre ti mismo. 
            Abraza tu viaje emocional con compasión y curiosidad."
          </p>
        </div>
      </GlassContainer>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassButton 
          variant="primary" 
          className="h-20 flex flex-col gap-2 hover:scale-105 transition-all duration-300"
          onClick={() => setCurrentSection('mood-tracker')}
        >
          <Heart className="w-6 h-6 animate-pulse" />
          <span>Registrar Estado</span>
        </GlassButton>

        <GlassButton 
          variant="secondary" 
          className="h-20 flex flex-col gap-2 hover:scale-105 transition-all duration-300"
          onClick={() => setCurrentSection('journal')}
        >
          <BookOpen className="w-6 h-6" />
          <span>Diario Emocional</span>
        </GlassButton>

        <GlassButton 
          variant="accent" 
          className="h-20 flex flex-col gap-2 hover:scale-105 transition-all duration-300"
          onClick={() => setCurrentSection('trends')}
        >
          <TrendingUp className="w-6 h-6" />
          <span>Ver Tendencias</span>
        </GlassButton>
      </div>
    </div>
  );

  const renderMoodTracker = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Registro de Estado de Ánimo
        </h2>
        <p className="text-gray-300">
          {format(new Date(), "EEEE, dd 'de' MMMM", { locale: es })}
        </p>
      </div>

      <GlassContainer className="p-6">
        <MoodSelector 
          onMoodSelect={handleMoodSelect}
          selectedMood={selectedEmotion?.id}
          selectedIntensity={selectedIntensity}
        />
      </GlassContainer>

      {/* Actividades complementarias */}
      <GlassContainer className="p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Actividades de Bienestar
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white">
              Minutos de meditación hoy
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="0"
                max="120"
                value={meditationMinutes}
                onChange={(e) => setMeditationMinutes(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-white font-semibold w-12 text-center bg-primary/20 px-2 py-1 rounded">
                {meditationMinutes}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-white">
              Conexiones sociales hoy
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="0"
                max="10"
                value={socialConnections}
                onChange={(e) => setSocialConnections(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <span className="text-white font-semibold w-12 text-center bg-secondary/20 px-2 py-1 rounded">
                {socialConnections}
              </span>
            </div>
          </div>
        </div>
      </GlassContainer>

      {/* Botones de acción */}
      <div className="flex justify-center space-x-4">
        <GlassButton
          variant="secondary"
          onClick={() => setCurrentSection('journal')}
          className="flex items-center gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Continuar al Diario
        </GlassButton>
        
        <GlassButton
          onClick={saveEmotionalEntry}
          disabled={!selectedEmotion || saving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Guardando...' : 'Guardar Registro'}
        </GlassButton>
      </div>
    </div>
  );

  const renderJournal = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Diario Emocional
        </h2>
        <p className="text-gray-300">
          Reflexiona sobre tu día y cultiva la gratitud
        </p>
      </div>

      <GlassContainer className="p-6">
        <EmotionalJournal 
          onEntryUpdate={handleJournalUpdate}
          initialEntry={journalEntry}
        />
      </GlassContainer>

      <div className="flex justify-center space-x-4">
        <GlassButton
          variant="secondary"
          onClick={() => setCurrentSection('mood-tracker')}
          className="flex items-center gap-2"
        >
          <Heart className="h-4 w-4" />
          Volver al Estado de Ánimo
        </GlassButton>
        
        <GlassButton
          onClick={saveEmotionalEntry}
          disabled={!selectedEmotion || saving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Guardando...' : 'Guardar Todo'}
        </GlassButton>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Tendencias Emocionales
        </h2>
        <p className="text-gray-300">
          Analiza patrones en tu bienestar emocional
        </p>
      </div>

      <GlassContainer className="p-6">
        <MoodTrends entries={entries} />
      </GlassContainer>

      <div className="flex justify-center">
        <GlassButton
          variant="secondary"
          onClick={() => setCurrentSection('overview')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Inicio
        </GlassButton>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'overview':
        return renderOverview();
      case 'mood-tracker':
        return renderMoodTracker();
      case 'journal':
        return renderJournal();
      case 'trends':
        return renderTrends();
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <GradientBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <p className="text-white">Cargando tu espacio emocional...</p>
          </div>
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <div className="min-h-screen p-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <GlassButton 
              variant="secondary" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </GlassButton>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-1">
                Módulo Emocional
              </h1>
              <p className="text-gray-300 text-sm">
                Tu espacio de bienestar emocional
              </p>
            </div>
            
            <div className="w-24" /> {/* Spacer for centering */}
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </GradientBackground>
  );
};