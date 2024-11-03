"use client";

import { CircleAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

import { Alert, AlertTitle, AlertDescription } from "@web/components/ui/alert";

const ErrorMessage = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  if (status === "failed") {
    return (
      <Alert variant="destructive">
        <CircleAlert size={20} />
        <AlertTitle>Σφάλμα!</AlertTitle>
        <AlertDescription>
          Κάτι πήγε λάθος κατά την είσοδό σου. Παρακαλώ δοκίμασε ξανά.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default ErrorMessage;
