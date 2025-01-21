"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import React from "react";
import { toast } from "sonner";

import { Button } from "@web/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@web/components/ui/dialog";
import { Events } from "@web/lib/utils/constants";

const UnsupportedLocationModal = () => {
  const { t } = useLingui();

  const [open, setOpen] = React.useState(true);

  const onOpenChange = React.useCallback((value: boolean) => {
    setOpen(value);
  }, []);

  const onSendHelpClick = React.useCallback(() => {
    window.dispatchEvent(
      new CustomEvent(Events.Analytics.UnsupportedLocationSendHelp),
    );
    toast.success(t`Η αστρική βοήθεια στάλθηκε!` + "  🛸");
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6">
        <DialogHeader>
          <DialogTitle className="text-balance leading-snug">
            <Trans>
              Χμμ.. φαίνεται πως το unibus{" "}
              <span className="underline decoration-red-400 decoration-wavy">
                δεν είναι διαθέσιμο στην περιοχή σου
              </span>
            </Trans>{" "}
            🙁
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p>
            <Trans>
              Δυστυχώς, προς το παρόν, το unibus δεν υποστηρίζεται στην περιοχή
              σου. Εργαζόμαστε συνεχώς για να προσθέσουμε νέες πόλεις και
              περιοχές!
            </Trans>
          </p>
          <p>
            <Trans>Ελπίζουμε να είμαστε κοντά σου σύντομα!</Trans>
          </p>
          <p>
            <Trans>Μέχρι τότε, μπορείς να στείλεις αστρική βοήθεια</Trans>{" "}
            <span aria-label="spaceship" role="img">
              🛸
            </span>
          </p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            <Trans>Κλείσιμο</Trans>
          </Button>
          <Button
            variant="default"
            className="space-x-1 font-bold"
            onClick={onSendHelpClick}
          >
            <span>
              <Trans>Στείλε αστρική βοήθεια</Trans>
            </span>
            <span aria-label="alien" role="img">
              👽
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnsupportedLocationModal;
