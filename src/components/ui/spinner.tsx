import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
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

const FullscreenSpinner = () => {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
};

export { Spinner, FullscreenSpinner, spinnerVariants };
