import React from "react";

import { Button } from "@web/components/ui/button";
import { cn } from "@web/lib/utils";

type ActionButtonProps = {
  icon: React.ReactNode;
  label: string | React.ReactNode;
  isCompact?: boolean;
  onClick: () => void;
} & React.ComponentProps<typeof Button>;

const ActionButton = ({
  icon,
  label,
  onClick,
  isCompact = false,
  ...props
}: ActionButtonProps) => {
  return (
    <Button
      size={isCompact ? "icon" : "sm"}
      variant="outline"
      className={cn(!props.loading && "gap-2")}
      onClick={onClick}
      {...props}
    >
      {!props.loading && icon}
      {!isCompact && (typeof label === "string" ? <span>{label}</span> : label)}
    </Button>
  );
};

export default ActionButton;
