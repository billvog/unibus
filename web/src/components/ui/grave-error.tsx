"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import React from "react";
import { toast } from "sonner";

import { Button } from "@web/components/ui/button";
import { Events } from "@web/lib/utils/constants";

const GraveError = () => {
  const { t } = useLingui();

  const onSendHelpClick = React.useCallback(() => {
    window.dispatchEvent(new CustomEvent(Events.Analytics.GraveErrorSendHelp));
    toast.success(t`Η αστρική βοήθεια στάλθηκε!` + " 🛸");
  }, []);

  return (
    <div className="flex h-dvh w-screen flex-col items-center justify-center gap-4 p-10">
      <h1 className="text-center text-2xl font-extrabold sm:text-4xl">
        <Trans>Αντιμετωπίζουμε κάποιο πρόβλημα</Trans> 🙁
      </h1>
      <p className="text-center text-xs leading-normal sm:text-base">
        <Trans>
          Αυτή τη στιγμή δεν μπορούμε να εμφανίσουμε την σελίδα. <br />
          Παρακαλώ δοκίμασε ξανά αργότερα.
        </Trans>
      </p>
      <Button className="gap-2" onClick={onSendHelpClick}>
        <Trans>Στείλε αστρική βοήθεια</Trans>{" "}
        <span aria-label="alien" role="img">
          👽
        </span>
      </Button>
    </div>
  );
};

export default GraveError;
