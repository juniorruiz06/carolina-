import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const glassButtonVariants = cva(
  "glass-button font-primary font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "text-foreground hover:bg-contigo-primary/20",
        secondary: "text-foreground hover:bg-contigo-secondary/20",
        accent: "text-foreground hover:bg-contigo-accent/20",
        heart: "text-foreground hover:bg-contigo-heart/20",
        outline: "border-2 border-glass-border hover:border-contigo-primary/50",
      },
      size: {
        sm: "px-6 py-3 text-sm rounded-2xl",
        md: "px-8 py-4 text-base rounded-3xl",
        lg: "px-12 py-6 text-lg rounded-3xl",
        icon: "p-4 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface GlassButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(glassButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };