import { useState, useRef, useEffect, ReactNode } from "react";
import { X } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";

/**
 * Modal/Sheet móvil que desliza desde abajo
 * Optimizado para interacciones táctiles
 */

interface MobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showHandle?: boolean;
  className?: string;
}

export const MobileSheet = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showHandle = true,
  className = ""
}: MobileSheetProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'max-h-[40vh]';
      case 'md': return 'max-h-[60vh]';
      case 'lg': return 'max-h-[80vh]';
      case 'xl': return 'max-h-[90vh]';
      default: return 'max-h-[60vh]';
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const deltaY = currentY - startY;
    
    // Si se desliza hacia abajo más de 100px, cerrar
    if (deltaY > 100) {
      onClose();
    }
    
    setIsDragging(false);
    setStartY(0);
    setCurrentY(0);
  };

  const translateY = isDragging ? Math.max(0, currentY - startY) : 0;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`
          relative w-full bg-background rounded-t-3xl shadow-2xl
          transform transition-transform duration-300 ease-out
          ${getSizeClass()} ${className}
        `}
        style={{
          transform: `translateY(${translateY}px)`,
        }}
      >
        {/* Handle */}
        {showHandle && (
          <div
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-12 h-1 bg-foreground/20 rounded-full" />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-glass-white/20">
            <h2 className="text-xl font-primary font-bold text-foreground">
              {title}
            </h2>
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 p-0 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </GlassButton>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};