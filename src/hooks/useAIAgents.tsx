import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

interface AIAgent {
  id: string;
  name: string;
  module_type: 'health' | 'emotional' | 'academic';
  behavior_type: 'reminder' | 'motivational' | 'analytical';
  is_active: boolean;
  settings: {
    notification_frequency?: 'hourly' | 'daily' | 'weekly';
    priority_level?: number;
    notification_time?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

interface AgentTask {
  id: string;
  agent_id: string;
  task_type: string;
  task_data: {
    message?: string;
    priority?: number;
    [key: string]: any;
  };
  status: 'pending' | 'completed' | 'cancelled';
  scheduled_for: string;
  completed_at?: string;
}

interface TaskCompliance {
  id: string;
  user_id: string;
  task_type: string;
  expected_completion: string;
  actual_completion?: string;
  compliance_score: number;
  metadata: any;
}

export const useAIAgents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [compliance, setCompliance] = useState<TaskCompliance[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar agentes del usuario
  const fetchAgents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setAgents((data || []) as AIAgent[]);
    } catch (error) {
      console.error('Error fetching AI agents:', error);
    }
  };

  // Cargar tareas pendientes
  const fetchTasks = async () => {
    if (!user || agents.length === 0) return;

    try {
      const { data, error } = await supabase
        .from('agent_tasks')
        .select(`
          id,
          agent_id,
          task_type,
          task_data,
          status,
          scheduled_for,
          completed_at,
          created_at,
          updated_at
        `)
        .in('agent_id', agents.map(agent => agent.id))
        .eq('status', 'pending')
        .order('scheduled_for', { ascending: true })
        .limit(10);

      if (error) throw error;
      setTasks((data || []) as AgentTask[]);
    } catch (error) {
      console.error('Error fetching agent tasks:', error);
    }
  };

  // Cargar datos de cumplimiento
  const fetchCompliance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('task_compliance')
        .select('*')
        .eq('user_id', user.id)
        .order('expected_completion', { ascending: false })
        .limit(10);

      if (error) throw error;
      setCompliance(data || []);
    } catch (error) {
      console.error('Error fetching compliance data:', error);
    }
  };

  // Activar/desactivar agente
  const toggleAgent = async (agentId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('ai_agents')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', agentId);

      if (error) throw error;

      setAgents(agents.map(agent => 
        agent.id === agentId ? { ...agent, is_active: isActive } : agent
      ));

      toast({
        title: isActive ? "Agente Activado" : "Agente Desactivado",
        description: `El agente ha sido ${isActive ? 'activado' : 'desactivado'} exitosamente.`,
      });

    } catch (error) {
      console.error('Error toggling agent:', error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del agente.",
        variant: "destructive",
      });
    }
  };

  // Completar tarea
  const completeTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('agent_tasks')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.filter(task => task.id !== taskId));

      toast({
        title: "Tarea Completada",
        description: "La tarea ha sido marcada como completada.",
      });

    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: "No se pudo completar la tarea.",
        variant: "destructive",
      });
    }
  };

  // Configurar agente
  const updateAgentSettings = async (agentId: string, settings: any) => {
    try {
      const { error } = await supabase
        .from('ai_agents')
        .update({ 
          settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', agentId);

      if (error) throw error;

      setAgents(agents.map(agent => 
        agent.id === agentId ? { ...agent, settings } : agent
      ));

      toast({
        title: "Configuración Actualizada",
        description: "La configuración del agente ha sido actualizada.",
      });

    } catch (error) {
      console.error('Error updating agent settings:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración del agente.",
        variant: "destructive",
      });
    }
  };

  // Obtener estadísticas de cumplimiento
  const getComplianceStats = () => {
    if (compliance.length === 0) return { average: 0, trend: 'stable' };

    const total = compliance.reduce((sum, item) => sum + item.compliance_score, 0);
    const average = total / compliance.length;

    // Calcular tendencia comparando últimas 5 vs primeras 5 entradas
    const recent = compliance.slice(0, 5);
    const older = compliance.slice(-5);
    
    if (recent.length === 0 || older.length === 0) return { average, trend: 'stable' };

    const recentAvg = recent.reduce((sum, item) => sum + item.compliance_score, 0) / recent.length;
    const olderAvg = older.reduce((sum, item) => sum + item.compliance_score, 0) / older.length;

    let trend = 'stable';
    if (recentAvg > olderAvg + 0.1) trend = 'improving';
    else if (recentAvg < olderAvg - 0.1) trend = 'declining';

    return { average, trend };
  };

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setLoading(true);
        await fetchAgents();
        setLoading(false);
      };

      loadData();
    }
  }, [user]);

  useEffect(() => {
    if (agents.length > 0) {
      fetchTasks();
      fetchCompliance();
    }
  }, [agents]);

  return {
    agents,
    tasks,
    compliance,
    loading,
    toggleAgent,
    completeTask,
    updateAgentSettings,
    getComplianceStats,
    refetch: () => {
      fetchAgents();
      fetchTasks();
      fetchCompliance();
    }
  };
};