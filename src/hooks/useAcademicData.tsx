import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface AcademicEntry {
  id: string;
  user_id: string;
  subject: string;
  topic: string;
  study_time_minutes: number;
  completion_percentage: number;
  difficulty_rating: number;
  understanding_level: number;
  notes?: string;
  goals: string[];
  achievements: string[];
  date: string;
  created_at: string;
  updated_at: string;
}

export interface UseAcademicDataReturn {
  academicEntries: AcademicEntry[];
  loading: boolean;
  error: string | null;
  createEntry: (entry: Partial<AcademicEntry>) => Promise<boolean>;
  updateEntry: (id: string, updates: Partial<AcademicEntry>) => Promise<boolean>;
  deleteEntry: (id: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
  getEntriesBySubject: (subject: string) => AcademicEntry[];
  getTotalStudyTime: () => number;
}

export const useAcademicData = (): UseAcademicDataReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [academicEntries, setAcademicEntries] = useState<AcademicEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAcademicEntries = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('academic_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;

      setAcademicEntries(data || []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching academic data';
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

  const createEntry = async (entry: Partial<AcademicEntry>): Promise<boolean> => {
    if (!user || !entry.subject || !entry.topic) return false;

    try {
      const { data, error: createError } = await supabase
        .from('academic_entries')
        .insert([{
          ...entry,
          user_id: user.id,
          subject: entry.subject,
          topic: entry.topic,
          study_time_minutes: entry.study_time_minutes || 0,
          completion_percentage: entry.completion_percentage || 0,
          difficulty_rating: entry.difficulty_rating || 1,
          understanding_level: entry.understanding_level || 1,
          date: entry.date || new Date().toISOString().split('T')[0],
          goals: entry.goals || [],
          achievements: entry.achievements || [],
        }])
        .select()
        .single();

      if (createError) throw createError;

      setAcademicEntries(prev => [data, ...prev]);
      toast({
        title: "Éxito",
        description: "Entrada académica guardada correctamente",
      });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creating academic entry';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateEntry = async (id: string, updates: Partial<AcademicEntry>): Promise<boolean> => {
    try {
      const { data, error: updateError } = await supabase
        .from('academic_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setAcademicEntries(prev => prev.map(entry => 
        entry.id === id ? data : entry
      ));
      toast({
        title: "Éxito",
        description: "Entrada actualizada correctamente",
      });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating academic entry';
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
        .from('academic_entries')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setAcademicEntries(prev => prev.filter(entry => entry.id !== id));
      toast({
        title: "Éxito",
        description: "Entrada eliminada correctamente",
      });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting academic entry';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  const refreshData = async () => {
    await fetchAcademicEntries();
  };

  const getEntriesBySubject = (subject: string): AcademicEntry[] => {
    return academicEntries.filter(entry => entry.subject === subject);
  };

  const getTotalStudyTime = (): number => {
    return academicEntries.reduce((total, entry) => total + entry.study_time_minutes, 0);
  };

  useEffect(() => {
    fetchAcademicEntries();
  }, [user]);

  return {
    academicEntries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refreshData,
    getEntriesBySubject,
    getTotalStudyTime,
  };
};