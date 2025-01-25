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
      new CustomEvent(Events.Analytics.UnsupportedLocationSendHelp)
    );
    toast.success(t`Stellar help sent!` + "  🛸");
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6">
        <DialogHeader>
          <DialogTitle className="text-balance leading-snug">
            <Trans>
              Hmm.. it seems unibus{" "}
              <span className="underline decoration-red-400 decoration-wavy">
                is not available in your region
              </span>
            </Trans>{" "}
            🙁
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p>
            <Trans>
              Unfortunately, unibus is currently not supported in your region.
              We are constantly working to add new cities and regions!
            </Trans>
          </p>
          <p>
            <Trans>We hope to be with you soon!</Trans>
          </p>
          <p>
            <Trans>Until then, you can send stellar help</Trans>{" "}
            <span aria-label="spaceship" role="img">
              🛸
            </span>
          </p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            <Trans>Close</Trans>
          </Button>
          <Button
            variant="default"
            className="space-x-1 font-bold"
            onClick={onSendHelpClick}
          >
            <span>
              <Trans>Send stellar help</Trans>
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
