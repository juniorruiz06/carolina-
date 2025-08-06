import React from 'react';
import { TrendingUp, Calendar, BarChart, Activity, Smile } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, subDays, isToday, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';

interface EmotionalEntry {
  id: string;
  primary_emotion: string;
  emotion_intensity: number;
  date: string;
  meditation_minutes: number;
  social_connections: number;
  triggers?: string[];
  coping_strategies?: string[];
  gratitude_items?: string[];
}

interface MoodTrendsProps {
  entries: EmotionalEntry[];
}

const emotionColors: Record<string, string> = {
  'feliz': 'bg-yellow-500 text-yellow-500',
  'emocionado': 'bg-orange-500 text-orange-500',
  'amoroso': 'bg-pink-500 text-pink-500',
  'calmado': 'bg-blue-500 text-blue-500',
  'neutral': 'bg-gray-500 text-gray-500',
  'cansado': 'bg-indigo-500 text-indigo-500',
  'estresado': 'bg-amber-600 text-amber-600',
  'triste': 'bg-blue-600 text-blue-600',
  'frustrado': 'bg-red-500 text-red-500',
  'enojado': 'bg-red-600 text-red-600'
};

const getEmotionColor = (emotion: string) => {
  return emotionColors[emotion] || 'bg-gray-500 text-gray-500';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) return 'Hoy';
  if (isYesterday(date)) return 'Ayer';
  return format(date, 'dd MMM', { locale: es });
};

const getIntensityLabel = (intensity: number) => {
  if (intensity <= 1) return 'Muy Leve';
  if (intensity <= 2) return 'Leve';
  if (intensity <= 3) return 'Moderado';
  if (intensity <= 4) return 'Intenso';
  return 'Muy Intenso';
};

const getWeeklyAverage = (entries: EmotionalEntry[]) => {
  if (entries.length === 0) return 0;
  const sum = entries.reduce((acc, entry) => acc + (entry.emotion_intensity || 0), 0);
  return Math.round((sum / entries.length) * 10) / 10;
};

const getMostFrequentEmotion = (entries: EmotionalEntry[]) => {
  const emotionCount: Record<string, number> = {};
  entries.forEach(entry => {
    if (entry.primary_emotion) {
      emotionCount[entry.primary_emotion] = (emotionCount[entry.primary_emotion] || 0) + 1;
    }
  });
  
  const mostFrequent = Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0];
  return mostFrequent ? { emotion: mostFrequent[0], count: mostFrequent[1] } : null;
};

export const MoodTrends: React.FC<MoodTrendsProps> = ({ entries }) => {
  const recentEntries = entries.slice(0, 7);
  const weeklyAverage = getWeeklyAverage(recentEntries);
  const mostFrequent = getMostFrequentEmotion(recentEntries);
  const totalMeditation = recentEntries.reduce((sum, entry) => sum + (entry.meditation_minutes || 0), 0);
  const averageConnections = recentEntries.length > 0 
    ? Math.round((recentEntries.reduce((sum, entry) => sum + (entry.social_connections || 0), 0) / recentEntries.length) * 10) / 10
    : 0;

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="space-y-2">
              <Activity className="h-6 w-6 mx-auto text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{weeklyAverage}</p>
                <p className="text-xs text-muted-foreground">Intensidad promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="space-y-2">
              <Smile className="h-6 w-6 mx-auto text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{recentEntries.length}</p>
                <p className="text-xs text-muted-foreground">Registros esta semana</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="space-y-2">
              <Calendar className="h-6 w-6 mx-auto text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{totalMeditation}</p>
                <p className="text-xs text-muted-foreground">Min. meditación</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="space-y-2">
              <BarChart className="h-6 w-6 mx-auto text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{averageConnections}</p>
                <p className="text-xs text-muted-foreground">Conexiones sociales</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emoción más frecuente */}
      {mostFrequent && (
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Tu emoción predominante</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${getEmotionColor(mostFrequent.emotion).split(' ')[0]}`} />
                <div>
                  <p className="font-semibold text-foreground capitalize">
                    {mostFrequent.emotion}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mostFrequent.count} {mostFrequent.count === 1 ? 'vez' : 'veces'} esta semana
                  </p>
                </div>
              </div>
              <Badge variant="secondary">
                {Math.round((mostFrequent.count / recentEntries.length) * 100)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline de emociones */}
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Línea de tiempo emocional</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Smile className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay registros emocionales aún</p>
              <p className="text-sm">Comienza a registrar tu estado de ánimo diario</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentEntries.map((entry, index) => (
                <div key={entry.id} className="flex items-center space-x-4 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex-shrink-0 w-16 text-sm text-muted-foreground text-right">
                    {formatDate(entry.date)}
                  </div>
                  
                  <div className="flex-1 flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${getEmotionColor(entry.primary_emotion).split(' ')[0]} animate-pulse`} />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-foreground capitalize">
                          {entry.primary_emotion}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {getIntensityLabel(entry.emotion_intensity)}
                        </Badge>
                      </div>
                      
                      {(entry.meditation_minutes > 0 || entry.social_connections > 0) && (
                        <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                          {entry.meditation_minutes > 0 && (
                            <span>🧘 {entry.meditation_minutes}min</span>
                          )}
                          {entry.social_connections > 0 && (
                            <span>👥 {entry.social_connections}</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-2 rounded-full ${getEmotionColor(entry.primary_emotion).split(' ')[0]} opacity-60`} 
                           style={{ width: `${(entry.emotion_intensity / 5) * 32}px` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights y recomendaciones */}
      {recentEntries.length >= 3 && (
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 animate-fade-in">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-foreground">Insights de la semana</h4>
              </div>
              
              <div className="space-y-2 text-sm">
                {weeklyAverage >= 4 && (
                  <p className="text-green-600">
                    ✨ Has tenido emociones intensas esta semana. ¡Es genial sentir con profundidad!
                  </p>
                )}
                
                {totalMeditation >= 30 && (
                  <p className="text-blue-600">
                    🧘 Excelente práctica de meditación esta semana. Esto puede estar contribuyendo a tu bienestar.
                  </p>
                )}
                
                {averageConnections >= 3 && (
                  <p className="text-purple-600">
                    👥 Mantuviste buenas conexiones sociales. Las relaciones son clave para el bienestar emocional.
                  </p>
                )}
                
                {recentEntries.filter(e => ['feliz', 'emocionado', 'amoroso', 'calmado'].includes(e.primary_emotion)).length >= recentEntries.length * 0.6 && (
                  <p className="text-yellow-600">
                    🌟 La mayoría de tus emociones han sido positivas. ¡Sigue así!
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};