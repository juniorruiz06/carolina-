import React, { useState } from 'react';
import { BookOpen, Plus, Sparkles, Target, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface JournalEntry {
  gratitude: string[];
  triggers: string[];
  copingStrategies: string[];
  reflection: string;
}

interface EmotionalJournalProps {
  onEntryUpdate: (entry: JournalEntry) => void;
  initialEntry?: Partial<JournalEntry>;
}

export const EmotionalJournal: React.FC<EmotionalJournalProps> = ({
  onEntryUpdate,
  initialEntry = {}
}) => {
  const [gratitude, setGratitude] = useState<string[]>(initialEntry.gratitude || []);
  const [triggers, setTriggers] = useState<string[]>(initialEntry.triggers || []);
  const [copingStrategies, setCopingStrategies] = useState<string[]>(initialEntry.copingStrategies || []);
  const [reflection, setReflection] = useState(initialEntry.reflection || '');

  const [newGratitude, setNewGratitude] = useState('');
  const [newTrigger, setNewTrigger] = useState('');
  const [newStrategy, setNewStrategy] = useState('');

  const updateEntry = () => {
    const entry: JournalEntry = {
      gratitude,
      triggers,
      copingStrategies,
      reflection
    };
    onEntryUpdate(entry);
  };

  const addGratitude = () => {
    if (newGratitude.trim()) {
      const updated = [...gratitude, newGratitude.trim()];
      setGratitude(updated);
      setNewGratitude('');
      updateEntry();
    }
  };

  const addTrigger = () => {
    if (newTrigger.trim()) {
      const updated = [...triggers, newTrigger.trim()];
      setTriggers(updated);
      setNewTrigger('');
      updateEntry();
    }
  };

  const addStrategy = () => {
    if (newStrategy.trim()) {
      const updated = [...copingStrategies, newStrategy.trim()];
      setCopingStrategies(updated);
      setNewStrategy('');
      updateEntry();
    }
  };

  const removeItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    const updated = list.filter((_, i) => i !== index);
    setList(updated);
    updateEntry();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">
            Diario Emocional
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Reflexiona sobre tu día y emociones
        </p>
      </div>

      {/* Sección de Gratitud */}
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span>¿Por qué estás agradecido hoy?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newGratitude}
              onChange={(e) => setNewGratitude(e.target.value)}
              placeholder="Algo por lo que te sientes agradecido..."
              className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => e.key === 'Enter' && addGratitude()}
            />
            <Button onClick={addGratitude} size="sm" disabled={!newGratitude.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {gratitude.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {gratitude.map((item, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors animate-fade-in"
                    onClick={() => removeItem(gratitude, setGratitude, index)}
                  >
                    {item} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sección de Triggers */}
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Target className="h-5 w-5 text-orange-500" />
            <span>¿Qué provocó tus emociones?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTrigger}
              onChange={(e) => setNewTrigger(e.target.value)}
              placeholder="Algo que influyó en cómo te sentiste..."
              className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => e.key === 'Enter' && addTrigger()}
            />
            <Button onClick={addTrigger} size="sm" disabled={!newTrigger.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {triggers.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {triggers.map((item, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors animate-fade-in"
                    onClick={() => removeItem(triggers, setTriggers, index)}
                  >
                    {item} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sección de Estrategias */}
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Heart className="h-5 w-5 text-green-500" />
            <span>¿Cómo te cuidaste hoy?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newStrategy}
              onChange={(e) => setNewStrategy(e.target.value)}
              placeholder="Algo que hiciste para sentirte mejor..."
              className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => e.key === 'Enter' && addStrategy()}
            />
            <Button onClick={addStrategy} size="sm" disabled={!newStrategy.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {copingStrategies.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {copingStrategies.map((item, index) => (
                  <Badge 
                    key={index}
                    variant="default"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors animate-fade-in"
                    onClick={() => removeItem(copingStrategies, setCopingStrategies, index)}
                  >
                    {item} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sección de Reflexión */}
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Reflexión del día</CardTitle>
          <p className="text-sm text-muted-foreground">
            Escribe tus pensamientos y sentimientos sobre el día
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            value={reflection}
            onChange={(e) => {
              setReflection(e.target.value);
              updateEntry();
            }}
            placeholder="¿Cómo fue tu día? ¿Qué aprendiste sobre ti mismo? ¿Hay algo que quisieras hacer diferente mañana?"
            className="min-h-32 resize-none"
          />
        </CardContent>
      </Card>

      {/* Resumen */}
      {(gratitude.length > 0 || triggers.length > 0 || copingStrategies.length > 0 || reflection.trim()) && (
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 animate-fade-in">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="font-medium text-foreground">
                🌟 ¡Excelente trabajo reflexionando sobre tu día!
              </p>
              <p className="text-sm text-muted-foreground">
                El autoconocimiento es el primer paso hacia el bienestar emocional
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};