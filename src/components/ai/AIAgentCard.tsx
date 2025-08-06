import React, { useState } from 'react';
import { Bot, Settings, MoreVertical, Play, Pause, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface AIAgent {
  id: string;
  name: string;
  module_type: string;
  behavior_type: string;
  is_active: boolean;
  settings: any;
  created_at: string;
  updated_at: string;
}

interface AIAgentCardProps {
  agent: AIAgent;
  onToggle: (agentId: string, isActive: boolean) => void;
  onUpdateSettings: (agentId: string, settings: any) => void;
}

const getModuleColor = (moduleType: string) => {
  switch (moduleType) {
    case 'health': return 'bg-green-500/10 text-green-600 border-green-500/20';
    case 'emotional': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    case 'academic': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  }
};

const getBehaviorIcon = (behaviorType: string) => {
  switch (behaviorType) {
    case 'reminder': return <CheckCircle className="h-4 w-4" />;
    case 'motivational': return <Play className="h-4 w-4" />;
    case 'analytical': return <Settings className="h-4 w-4" />;
    default: return <Bot className="h-4 w-4" />;
  }
};

export const AIAgentCard: React.FC<AIAgentCardProps> = ({
  agent,
  onToggle,
  onUpdateSettings
}) => {
  const [settings, setSettings] = useState(agent.settings || {});
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSettingsUpdate = () => {
    onUpdateSettings(agent.id, settings);
    setIsSettingsOpen(false);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              {getBehaviorIcon(agent.behavior_type)}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{agent.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getModuleColor(agent.module_type)}>
                  {agent.module_type}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {agent.behavior_type}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={agent.is_active}
              onCheckedChange={(checked) => onToggle(agent.id, checked)}
            />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estado:</span>
            <div className="flex items-center gap-2">
              {agent.is_active ? (
                <>
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-600">Activo</span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 bg-gray-400 rounded-full" />
                  <span className="text-gray-600">Inactivo</span>
                </>
              )}
            </div>
          </div>

          {agent.settings && (
            <div className="space-y-2">
              {agent.settings.notification_frequency && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frecuencia:</span>
                  <span>{agent.settings.notification_frequency}</span>
                </div>
              )}
              {agent.settings.priority_level && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Prioridad:</span>
                  <span>{agent.settings.priority_level}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Configurar {agent.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Frecuencia de Notificaciones</Label>
                <select
                  value={settings.notification_frequency || 'daily'}
                  onChange={(e) => updateSetting('notification_frequency', e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-background"
                >
                  <option value="hourly">Cada hora</option>
                  <option value="daily">Diario</option>
                  <option value="weekly">Semanal</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Nivel de Prioridad: {settings.priority_level || 5}</Label>
                <Slider
                  value={[settings.priority_level || 5]}
                  onValueChange={(value) => updateSetting('priority_level', value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Hora de Notificación</Label>
                <input
                  type="time"
                  value={settings.notification_time || '09:00'}
                  onChange={(e) => updateSetting('notification_time', e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-background"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSettingsUpdate}>
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};