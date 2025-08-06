import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-secondary font-medium text-foreground/80 ml-2">
            {label}
          </label>
        )}
        <input
          className={cn(
            "glass-input font-secondary placeholder:text-foreground/60",
            error && "border-destructive/50 focus:border-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive ml-2 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";

export { GlassInput };