import React from 'react';
import { Bot, TrendingUp, TrendingDown, Minus, Bell, Calendar, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAIAgents } from '@/hooks/useAIAgents';
import { AIAgentCard } from './AIAgentCard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const AIAgentsPanel: React.FC = () => {
  const { 
    agents, 
    tasks, 
    compliance, 
    loading, 
    toggleAgent, 
    completeTask, 
    updateAgentSettings,
    getComplianceStats 
  } = useAIAgents();

  const stats = getComplianceStats();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-card/50 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-card/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas de rendimiento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Agentes Activos</p>
                <p className="text-2xl font-bold">
                  {agents.filter(agent => agent.is_active).length}
                </p>
              </div>
              <Bot className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cumplimiento</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">
                    {Math.round(stats.average * 100)}%
                  </p>
                  {getTrendIcon(stats.trend)}
                </div>
              </div>
              <div className={`text-lg font-semibold ${getTrendColor(stats.trend)}`}>
                {stats.trend === 'improving' && '+5%'}
                {stats.trend === 'declining' && '-3%'}
                {stats.trend === 'stable' && '0%'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tareas Pendientes</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de Agentes */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Agentes de IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {agents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tienes agentes configurados aún</p>
                <p className="text-sm">Los agentes se crean automáticamente cuando usas los módulos</p>
              </div>
            ) : (
              agents.map((agent) => (
                <AIAgentCard
                  key={agent.id}
                  agent={agent}
                  onToggle={toggleAgent}
                  onUpdateSettings={updateAgentSettings}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Panel de Tareas Pendientes */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Tareas Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>¡Genial! No tienes tareas pendientes</p>
                <p className="text-sm">Tus agentes están monitoreando tu progreso</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="p-3 border border-border/50 rounded-lg bg-background/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {task.task_type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(task.scheduled_for), 'dd MMM, HH:mm', { locale: es })}
                          </span>
                        </div>
                        <p className="text-sm">
                          {task.task_data?.message || 'Tarea programada por tu agente de IA'}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => completeTask(task.id)}
                        className="shrink-0"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {tasks.length > 5 && (
                  <div className="text-center pt-2">
                    <span className="text-sm text-muted-foreground">
                      y {tasks.length - 5} tareas más...
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Historial de Cumplimiento */}
      {compliance.length > 0 && (
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Historial de Cumplimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {compliance.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-background/50">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {item.task_type}
                    </Badge>
                    <span className="text-sm">
                      {format(new Date(item.expected_completion), 'dd MMM yyyy', { locale: es })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      item.compliance_score >= 0.8 
                        ? 'bg-green-100 text-green-800' 
                        : item.compliance_score >= 0.6 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {Math.round(item.compliance_score * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};