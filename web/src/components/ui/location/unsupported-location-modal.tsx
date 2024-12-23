"use client";

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
  const [open, setOpen] = React.useState(true);

  const onOpenChange = React.useCallback((value: boolean) => {
    setOpen(value);
  }, []);

  const onSendHelpClick = React.useCallback(() => {
    window.dispatchEvent(
      new CustomEvent(Events.Analytics.UnsupportedLocationSendHelp),
    );
    toast.success("Η αστρική βοήθεια στάλθηκε! 🛸");
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6">
        <DialogHeader>
          <DialogTitle className="text-balance leading-snug">
            Χμμ.. φαίνεται πως το unibus{" "}
            <span className="underline decoration-red-400 decoration-wavy">
              δεν είναι διαθέσιμο στην περιοχή σου
            </span>{" "}
            🙁
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p>
            Δυστυχώς, προς το παρόν, το unibus δεν υποστηρίζεται στην περιοχή
            σου. Εργαζόμαστε συνεχώς για να προσθέσουμε νέες πόλεις και
            περιοχές!
          </p>
          <p>Ελπίζουμε να είμαστε κοντά σου σύντομα!</p>
          <p>
            Μέχρι τότε, μπορείς να στείλεις αστρική βοήθεια{" "}
            <span aria-label="spaceship" role="img">
              🛸
            </span>
          </p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Κλείσιμο
          </Button>
          <Button
            variant="default"
            className="space-x-1 font-bold"
            onClick={onSendHelpClick}
          >
            <span>Στείλε αστρική βοήθεια</span>
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
