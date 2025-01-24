"use client";

import { Trans } from "@lingui/react/macro";
import Link from "next/link";
import React from "react";

import { Button } from "@web/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@web/components/ui/dialog";
import { useUserLocation } from "@web/components/user-location-context";

const LocationPromptModal = () => {
  const { enableLocation } = useUserLocation();

  const [open, setOpen] = React.useState(true);

  const onOpenChange = React.useCallback((value: boolean) => {
    setOpen(value);
  }, []);

  const onEnableLocation = React.useCallback(() => {
    // Enable location
    enableLocation();
    // Close modal
    onOpenChange(false);
  }, [enableLocation, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6">
        <DialogHeader>
          <DialogTitle className="text-balance leading-snug">
            <Trans>
              unibus is better when you have{" "}
              <span className="underline decoration-blue-500 decoration-wavy">
                your location enabled
              </span>
            </Trans>
            📍
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="space-y-2 text-sm">
            <span className="font-bold">
              <Trans>We promise that</Trans>:
            </span>
            <ul className="list-inside list-decimal space-y-1">
              <li>
                <Trans>We don't store your location</Trans>
              </li>
              <li>
                <Trans>
                  We will only use it to give you the best experience
                </Trans>{" "}
                😎
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-3 rounded-lg border-2 border-gray-100 bg-gray-50 p-3">
            <span className="text-xl">🕵️‍♂️</span>
            <span className="text-balance text-xs">
              <Trans>
                You can learn how we use your data in our{" "}
                <Link
                  className="link"
                  href="/company/privacy-policy"
                  target="_blank"
                >
                  privacy policy
                </Link>
                .
              </Trans>
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            <Trans>Later</Trans>
          </Button>
          <Button onClick={() => onEnableLocation()}>
            <span className="font-bold">
              <Trans>Enable now</Trans>
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPromptModal;
