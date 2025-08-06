import { LucideIcon } from "lucide-react";
import { useState } from "react";

/**
 * Navegación inferior tipo móvil
 * Diseñada para experiencia nativa en dispositivos móviles
 */

interface TabBarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  isActive?: boolean;
  onClick: () => void;
}

interface MobileTabBarProps {
  items: TabBarItem[];
  activeTab: string;
  className?: string;
}

export const MobileTabBar = ({ items, activeTab, className = "" }: MobileTabBarProps) => {
  const [pressedTab, setPressedTab] = useState<string | null>(null);

  const handleTouchStart = (tabId: string) => {
    setPressedTab(tabId);
  };

  const handleTouchEnd = () => {
    setPressedTab(null);
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}>
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-glass-white/20" />
      
      {/* Tab items */}
      <div className="relative flex items-center justify-around px-2 py-2 safe-area-bottom">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          const isPressed = pressedTab === item.id;
          
          return (
            <button
              key={item.id}
              onTouchStart={() => handleTouchStart(item.id)}
              onTouchEnd={handleTouchEnd}
              onMouseDown={() => handleTouchStart(item.id)}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
              onClick={item.onClick}
              className={`
                relative flex flex-col items-center justify-center
                w-16 h-14 rounded-2xl transition-all duration-200
                ${isActive 
                  ? 'bg-contigo-primary/20 scale-105' 
                  : isPressed 
                    ? 'bg-glass-white/30 scale-95' 
                    : 'hover:bg-glass-white/20'
                }
              `}
            >
              {/* Icon */}
              <div className="relative">
                <item.icon 
                  className={`w-6 h-6 transition-colors duration-200 ${
                    isActive ? 'text-contigo-primary' : 'text-foreground/70'
                  }`}
                />
                
                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Label */}
              <span className={`
                text-xs font-secondary mt-1 transition-colors duration-200
                ${isActive ? 'text-contigo-primary font-semibold' : 'text-foreground/70'}
              `}>
                {item.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-1 w-8 h-1 bg-contigo-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};