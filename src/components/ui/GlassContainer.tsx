import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const glassContainerVariants = cva(
  "glass-container",
  {
    variants: {
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-12",
      },
      glow: {
        none: "",
        soft: "shadow-lg shadow-contigo-primary/20",
        strong: "shadow-xl shadow-contigo-primary/30",
      },
    },
    defaultVariants: {
      size: "md",
      glow: "soft",
    },
  }
);

export interface GlassContainerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassContainerVariants> {}

const GlassContainer = forwardRef<HTMLDivElement, GlassContainerProps>(
  ({ className, size, glow, ...props }, ref) => {
    return (
      <div
        className={cn(glassContainerVariants({ size, glow, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

GlassContainer.displayName = "GlassContainer";

export { GlassContainer, glassContainerVariants };