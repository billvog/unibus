import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import React from "react";

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      default: "h-4 w-4",
      sm: "h-2 w-2",
      lg: "h-10 w-10",
    },
  },
});

export type SpinnerProps = React.SVGAttributes<SVGElement> &
  VariantProps<typeof spinnerVariants>;

const Spinner = ({ className, size, ...props }: SpinnerProps) => {
  return (
    <Loader2 className={cn(spinnerVariants({ className, size }))} {...props} />
  );
};

const fullscreenSpinnerVariants = cva(
  "flex h-full w-full flex-1 items-center justify-center",
  {
    variants: {
      display: {
        default: null,
        absolute: "absolute backdrop-filter backdrop-blur-sm z-50",
      },
    },
  },
);

export type FullscreenSpinnerProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof fullscreenSpinnerVariants>;

const FullscreenSpinner = ({
  className,
  display,
  ...props
}: FullscreenSpinnerProps) => {
  return (
    <div
      className={cn(fullscreenSpinnerVariants({ className, display }))}
      {...props}
    >
      <Spinner size="lg" />
    </div>
  );
};

export { Spinner, FullscreenSpinner, spinnerVariants };
