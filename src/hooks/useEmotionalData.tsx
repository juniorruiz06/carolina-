import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface EmotionalEntry {
  id: string;
  user_id: string;
  date: string;
  primary_emotion: string;
  emotion_intensity: number;
  triggers: string[];
  coping_strategies: string[];
  gratitude_items: string[];
  reflection_notes?: string;
  meditation_minutes: number;
  social_connections: number;
  created_at: string;
  updated_at: string;
}

export interface UseEmotionalDataReturn {
  emotionalEntries: EmotionalEntry[];
  todayEntry: EmotionalEntry | null;
  loading: boolean;
  error: string | null;
  createEntry: (entry: Partial<EmotionalEntry>) => Promise<boolean>;
  updateEntry: (id: string, updates: Partial<EmotionalEntry>) => Promise<boolean>;
  deleteEntry: (id: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

export const useEmotionalData = (): UseEmotionalDataReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [emotionalEntries, setEmotionalEntries] = useState<EmotionalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const todayEntry = emotionalEntries.find(entry => entry.date === today) || null;

  const fetchEmotionalEntries = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('emotional_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      if (fetchError) throw fetchError;

      setEmotionalEntries(data || []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching emotional data';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entry: Partial<EmotionalEntry>): Promise<boolean> => {
    if (!user || !entry.primary_emotion || !entry.emotion_intensity) return false;

    try {
      const { data, error: createError } = await supabase
        .from('emotional_entries')
        .insert([{
          ...entry,
          user_id: user.id,
          primary_emotion: entry.primary_emotion,
          emotion_intensity: entry.emotion_intensity,
          date: entry.date || today,
          triggers: entry.triggers || [],
          coping_strategies: entry.coping_strategies || [],
          gratitude_items: entry.gratitude_items || [],
          meditation_minutes: entry.meditation_minutes || 0,
          social_connections: entry.social_connections || 0,
        }])
        .select()
        .single();

      if (createError) throw createError;

      setEmotionalEntries(prev => [data, ...prev.filter(e => e.date !== data.date)]);
      toast({
        title: "Éxito",
        description: "Entrada emocional guardada correctamente",
      });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creating emotional entry';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateEntry = async (id: string, updates: Partial<EmotionalEntry>): Promise<boolean> => {
    try {
      const { data, error: updateError } = await supabase
        .from('emotional_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setEmotionalEntries(prev => prev.map(entry => 
        entry.id === id ? data : entry
      ));
      toast({
        title: "Éxito",
        description: "Entrada actualizada correctamente",
      });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating emotional entry';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteEntry = async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('emotional_entries')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setEmotionalEntries(prev => prev.filter(entry => entry.id !== id));
      toast({
        title: "Éxito",
        description: "Entrada eliminada correctamente",
      });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting emotional entry';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  const refreshData = async () => {
    await fetchEmotionalEntries();
  };

  useEffect(() => {
    fetchEmotionalEntries();
  }, [user]);

  return {
    emotionalEntries,
    todayEntry,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refreshData,
  };
};