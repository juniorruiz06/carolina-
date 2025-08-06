import React, { useState } from "react";
import { X, Plus, Minus } from "lucide-react";

/**
 * Botón flotante de acción (FAB) para móvil
 * Comportamiento tipo Material Design con acciones expandibles
 */

interface FloatingAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; color?: string }>;
  color?: string;
  onClick: () => void;
}

interface FloatingActionButtonProps {
  actions: FloatingAction[];
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  className?: string;
}

export const FloatingActionButton = ({ 
  actions, 
  position = 'bottom-right',
  className = "" 
}: FloatingActionButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-24 left-6';
      case 'bottom-center':
        return 'bottom-24 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
      default:
        return 'bottom-24 right-6';
    }
  };

  const handleMainClick = () => {
    if (actions.length === 1) {
      actions[0].onClick();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={`fixed z-50 ${getPositionClasses()} ${className}`}>
      {/* Action buttons */}
      {isExpanded && actions.length > 1 && (
        <div className="flex flex-col-reverse gap-3 mb-4">
          {actions.map((action, index) => (
            <div key={action.id} className="flex items-center gap-3">
              {/* Label */}
              <div className="bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                <span className="text-sm font-secondary font-medium text-foreground whitespace-nowrap">
                  {action.label}
                </span>
              </div>
              
              {/* Action button */}
              <button
                onClick={() => {
                  action.onClick();
                  setIsExpanded(false);
                }}
                className="w-14 h-14 rounded-full shadow-lg backdrop-blur-sm border border-glass-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                style={{ 
                  backgroundColor: action.color ? `${action.color}20` : 'hsl(var(--glass-white))',
                  animationDelay: `${index * 50}ms`
                }}
              >
                <action.icon 
                  className="w-6 h-6" 
                  color={action.color || 'hsl(var(--foreground))'}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={handleMainClick}
        className={`
          w-16 h-16 rounded-full shadow-2xl backdrop-blur-sm border border-glass-white/20
          flex items-center justify-center transition-all duration-300
          hover:scale-110 active:scale-95 tap-highlight-none
          ${isExpanded ? 'bg-red-500/20 rotate-45' : 'bg-contigo-primary/80'}
        `}
      >
        {actions.length === 1 ? (
          React.createElement(actions[0].icon, { className: "w-7 h-7 text-white" })
        ) : isExpanded ? (
          <X className="w-7 h-7 text-red-500" />
        ) : (
          <Plus className="w-7 h-7 text-white" />
        )}
      </button>
    </div>
  );
};