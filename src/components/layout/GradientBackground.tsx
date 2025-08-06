import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface GradientBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "welcome";
  animated?: boolean;
}

export const GradientBackground = ({ 
  className, 
  variant = "primary", 
  animated = false,
  children,
  ...props 
}: GradientBackgroundProps) => {
  const getGradientClass = () => {
    switch (variant) {
      case "secondary":
        return "bg-gradient-to-br from-contigo-secondary via-contigo-primary to-contigo-accent";
      case "welcome":
        return "bg-gradient-to-br from-contigo-primary via-background to-contigo-secondary";
      default:
        return "bg-gradient-to-br from-background via-contigo-primary/50 to-contigo-secondary/50";
    }
  };

  return (
    <div 
      className={cn(
        "min-h-screen w-full relative overflow-hidden",
        getGradientClass(),
        animated && "animate-pulse",
        className
      )}
      {...props}
    >
      {/* Floating geometric shapes for glassmorphism effect */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-glass-white rounded-full blur-xl opacity-30 float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-contigo-accent/30 rounded-full blur-lg opacity-40 float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-contigo-secondary/20 rounded-full blur-2xl opacity-25 float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-glass-white rounded-full blur-xl opacity-35 float" style={{ animationDelay: '0.5s' }} />
      </div>
      
      {children}
    </div>
  );
};