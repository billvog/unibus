"use client";

import { useEffect } from "react";

export const useBodyScroll = (shouldScroll: boolean) => {
  useEffect(() => {
    if (!shouldScroll) {
      document.body.style.overflowY = "hidden";
    }

    return () => {
      document.body.style.overflowY = "";
    };
  }, [shouldScroll]);
};
