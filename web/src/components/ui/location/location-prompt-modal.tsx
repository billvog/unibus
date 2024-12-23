"use client";

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
            Το unibus είναι καλύτερο όταν έχεις{" "}
            <span className="underline decoration-blue-500 decoration-wavy">
              ενεργοποιημένη την τοποθεσία σου
            </span>
            📍
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="space-y-2 text-sm">
            <span className="font-bold">Υποσχόμαστε πως:</span>
            <ul className="list-inside list-decimal space-y-1">
              <li>Δεν αποθηκεύουμε την τοποθεσία σου</li>
              <li>
                Θα τη χρησιμοποιήσουμε μόνο για να σου προσφέρουμε την καλύτερη
                εμπειρία 😎
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-3 rounded-lg border-2 border-gray-100 bg-gray-50 p-3">
            <span className="text-xl">🕵️‍♂️</span>
            <span className="text-balance text-xs">
              Μπορείς να μάθεις πως χρησιμοποιούμε τα δεδομένα σου στην{" "}
              <Link href="/company/privacy-policy" className="link">
                πολιτική απορρήτου μας
              </Link>
              .
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Αργότερα
          </Button>
          <Button onClick={() => onEnableLocation()}>
            <span className="font-bold">Ενεργοποίηση</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPromptModal;
