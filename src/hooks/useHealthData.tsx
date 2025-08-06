import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface HealthEntry {
  id: string;
  user_id: string;
  date: string;
  weight?: number;
  sleep_hours?: number;
  water_glasses: number;
  exercise_minutes: number;
  mood_score?: number;
  energy_level?: number;
  stress_level?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UseHealthDataReturn {
  healthEntries: HealthEntry[];
  todayEntry: HealthEntry | null;
  loading: boolean;
  error: string | null;
  createEntry: (entry: Partial<HealthEntry>) => Promise<boolean>;
  updateEntry: (id: string, updates: Partial<HealthEntry>) => Promise<boolean>;
  deleteEntry: (id: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

export const useHealthData = (): UseHealthDataReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [healthEntries, setHealthEntries] = useState<HealthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const todayEntry = healthEntries.find(entry => entry.date === today) || null;

  const fetchHealthEntries = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('health_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      if (fetchError) throw fetchError;

      setHealthEntries(data || []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching health data';
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

  const createEntry = async (entry: Partial<HealthEntry>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error: createError } = await supabase
        .from('health_entries')
        .insert([{
          ...entry,
          user_id: user.id,
          date: entry.date || today
        }])
        .select()
        .single();

      if (createError) throw createError;

      setHealthEntries(prev => [data, ...prev.filter(e => e.date !== data.date)]);
      toast({
        title: "Éxito",
        description: "Entrada de salud guardada correctamente",
      });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creating health entry';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateEntry = async (id: string, updates: Partial<HealthEntry>): Promise<boolean> => {
    try {
      const { data, error: updateError } = await supabase
        .from('health_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setHealthEntries(prev => prev.map(entry => 
        entry.id === id ? data : entry
      ));
      toast({
        title: "Éxito",
        description: "Entrada actualizada correctamente",
      });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating health entry';
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
        .from('health_entries')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setHealthEntries(prev => prev.filter(entry => entry.id !== id));
      toast({
        title: "Éxito",
        description: "Entrada eliminada correctamente",
      });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting health entry';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  const refreshData = async () => {
    await fetchHealthEntries();
  };

  useEffect(() => {
    fetchHealthEntries();
  }, [user]);

  return {
    healthEntries,
    todayEntry,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refreshData,
  };
};