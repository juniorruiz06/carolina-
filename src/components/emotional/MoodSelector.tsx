import React, { useState } from 'react';
import { Heart, Smile, Meh, Frown, Angry, Zap, Moon, Sun, Cloud, CloudRain } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Emotion {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
}

interface MoodSelectorProps {
  onMoodSelect: (emotion: Emotion, intensity: number) => void;
  selectedMood?: string;
  selectedIntensity?: number;
}

const emotions: Emotion[] = [
  {
    id: 'feliz',
    name: 'Feliz',
    icon: <Smile className="h-8 w-8" />,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30',
    description: 'Me siento alegre y positivo'
  },
  {
    id: 'emocionado',
    name: 'Emocionado',
    icon: <Zap className="h-8 w-8" />,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30',
    description: 'Lleno de energía y entusiasmo'
  },
  {
    id: 'amoroso',
    name: 'Amoroso',
    icon: <Heart className="h-8 w-8" />,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30',
    description: 'Siento amor y conexión'
  },
  {
    id: 'calmado',
    name: 'Calmado',
    icon: <Sun className="h-8 w-8" />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30',
    description: 'En paz y relajado'
  },
  {
    id: 'neutral',
    name: 'Neutral',
    icon: <Meh className="h-8 w-8" />,
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10 hover:bg-gray-500/20 border-gray-500/30',
    description: 'Estado normal, sin emociones fuertes'
  },
  {
    id: 'cansado',
    name: 'Cansado',
    icon: <Moon className="h-8 w-8" />,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30',
    description: 'Me siento agotado o somnoliento'
  },
  {
    id: 'estresado',
    name: 'Estresado',
    icon: <Cloud className="h-8 w-8" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-600/10 hover:bg-amber-600/20 border-amber-600/30',
    description: 'Siento presión y tensión'
  },
  {
    id: 'triste',
    name: 'Triste',
    icon: <CloudRain className="h-8 w-8" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/10 hover:bg-blue-600/20 border-blue-600/30',
    description: 'Me siento melancólico o desanimado'
  },
  {
    id: 'frustrado',
    name: 'Frustrado',
    icon: <Frown className="h-8 w-8" />,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30',
    description: 'Siento irritación o descontento'
  },
  {
    id: 'enojado',
    name: 'Enojado',
    icon: <Angry className="h-8 w-8" />,
    color: 'text-red-600',
    bgColor: 'bg-red-600/10 hover:bg-red-600/20 border-red-600/30',
    description: 'Siento ira o molestia intensa'
  }
];

const intensityLabels = [
  { value: 1, label: 'Muy Leve', color: 'bg-gray-200' },
  { value: 2, label: 'Leve', color: 'bg-blue-200' },
  { value: 3, label: 'Moderado', color: 'bg-yellow-300' },
  { value: 4, label: 'Intenso', color: 'bg-orange-400' },
  { value: 5, label: 'Muy Intenso', color: 'bg-red-500' }
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  onMoodSelect,
  selectedMood,
  selectedIntensity = 3
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(
    selectedMood ? emotions.find(e => e.id === selectedMood) || null : null
  );
  const [intensity, setIntensity] = useState(selectedIntensity);

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    onMoodSelect(emotion, intensity);
  };

  const handleIntensityChange = (newIntensity: number) => {
    setIntensity(newIntensity);
    if (selectedEmotion) {
      onMoodSelect(selectedEmotion, newIntensity);
    }
  };

  return (
    <div className="space-y-8">
      {/* Selector de Emociones */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground text-center">
          ¿Cómo te sientes ahora?
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {emotions.map((emotion) => (
            <Card
              key={emotion.id}
              className={`
                cursor-pointer transition-all duration-300 border-2 
                ${selectedEmotion?.id === emotion.id 
                  ? `${emotion.bgColor} border-current scale-105 shadow-lg` 
                  : `${emotion.bgColor} hover:scale-105`
                }
              `}
              onClick={() => handleEmotionSelect(emotion)}
            >
              <div className="p-4 text-center space-y-2">
                <div className={`${emotion.color} flex justify-center animate-scale-in`}>
                  {emotion.icon}
                </div>
                <div className="space-y-1">
                  <p className={`font-medium text-sm ${emotion.color}`}>
                    {emotion.name}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {emotion.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Selector de Intensidad */}
      {selectedEmotion && (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center space-y-2">
            <h4 className="text-lg font-medium text-foreground">
              Intensidad de tu {selectedEmotion.name.toLowerCase()}
            </h4>
            <p className="text-sm text-muted-foreground">
              Selecciona qué tan intenso sientes esta emoción
            </p>
          </div>

          <div className="space-y-4">
            {/* Barra visual de intensidad */}
            <div className="flex items-center justify-center space-x-2">
              {intensityLabels.map((level) => (
                <Button
                  key={level.value}
                  variant={intensity === level.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleIntensityChange(level.value)}
                  className={`
                    transition-all duration-200 
                    ${intensity === level.value 
                      ? `${selectedEmotion.color} bg-primary scale-110` 
                      : 'hover:scale-105'
                    }
                  `}
                >
                  {level.value}
                </Button>
              ))}
            </div>

            {/* Etiqueta de intensidad actual */}
            <div className="text-center">
              <Badge 
                variant="secondary" 
                className="px-4 py-2 text-sm animate-pulse"
              >
                {intensityLabels[intensity - 1]?.label}
              </Badge>
            </div>

            {/* Indicador visual de intensidad */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${selectedEmotion.color.replace('text-', 'bg-')}`}
                style={{ width: `${(intensity / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Resumen de selección */}
      {selectedEmotion && (
        <Card className="p-4 bg-gradient-to-r from-background to-muted/30 animate-fade-in">
          <div className="flex items-center justify-center space-x-3">
            <div className={selectedEmotion.color}>
              {selectedEmotion.icon}
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">
                Te sientes <span className={selectedEmotion.color}>
                  {selectedEmotion.name.toLowerCase()}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                con intensidad {intensityLabels[intensity - 1]?.label.toLowerCase()}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};