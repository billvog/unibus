"use client";

import React from "react";
import { toast } from "sonner";

import { Button } from "@web/components/ui/button";
import { Events } from "@web/lib/utils/constants";

const GraveError = () => {
  const onSendHelpClick = React.useCallback(() => {
    window.dispatchEvent(new CustomEvent(Events.Analytics.GraveErrorSendHelp));
    toast.success("Η αστρική βοήθεια στάλθηκε! 🛸");
  }, []);

  return (
    <div className="flex h-dvh w-screen flex-col items-center justify-center gap-4 p-10">
      <h1 className="text-center text-2xl font-extrabold sm:text-4xl">
        Αντιμετωπίζουμε κάποιο πρόβλημα 🙁
      </h1>
      <p className="text-center text-xs leading-normal sm:text-base">
        Αυτή τη στιγμή δεν μπορούμε να εμφανίσουμε την σελίδα. <br />
        Παρακαλώ δοκίμασε ξανά αργότερα.
      </p>
      <Button className="gap-2" onClick={onSendHelpClick}>
        Στείλε αστρική βοήθεια{" "}
        <span aria-label="alien" role="img">
          👽
        </span>
      </Button>
    </div>
  );
};

export default GraveError;
