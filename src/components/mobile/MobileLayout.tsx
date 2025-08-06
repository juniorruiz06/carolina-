import { ReactNode } from "react";

/**
 * Layout principal para aplicación móvil
 * Incluye safe areas y estructura optimizada para móvil
 */

interface MobileLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  paddingBottom?: boolean;
}

export const MobileLayout = ({ 
  children, 
  header, 
  footer, 
  className = "",
  paddingBottom = true 
}: MobileLayoutProps) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gradient-primary ${className}`}>
      {/* Header */}
      {header}
      
      {/* Main content with safe areas */}
      <main className={`
        flex-1 overflow-auto
        ${paddingBottom ? 'pb-20' : ''} 
        safe-area-left safe-area-right
      `}>
        {children}
      </main>
      
      {/* Footer/TabBar */}
      {footer}
    </div>
  );
};