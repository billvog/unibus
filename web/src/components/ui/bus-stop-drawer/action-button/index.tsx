import React from "react";

import { Button } from "@web/components/ui/button";

type ActionButtonProps = {
  icon: React.ReactNode;
  label: string | React.ReactNode;
  isCompact?: boolean;
  onClick: () => void;
};

const ActionButton = ({
  icon,
  label,
  onClick,
  isCompact = false,
}: ActionButtonProps) => {
  return (
    <Button
      size={isCompact ? "icon" : "sm"}
      variant="outline"
      className="gap-2"
      onClick={onClick}
    >
      {icon}
      {!isCompact && (typeof label === "string" ? <span>{label}</span> : label)}
    </Button>
  );
};

export default ActionButton;
