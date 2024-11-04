"use client";

import { useEffect } from "react";

export const useBodyScroll = (shouldDisableScroll: boolean) => {
  useEffect(() => {
    if (shouldDisableScroll) {
      document.body.style.overflowY = "hidden";
    }

    return () => {
      document.body.style.overflowY = "";
    };
  }, [shouldDisableScroll]);
};
