import React from "react";

export const useKeyPress = (key: string, callback: () => void) => {
  React.useEffect(() => {
    function onKeyPress(event: KeyboardEvent) {
      if (event.key === key) {
        event.preventDefault();
        callback();
        return;
      }
    }

    document.addEventListener("keydown", onKeyPress);

    return () => {
      document.removeEventListener("keydown", onKeyPress);
    };
  }, [key]);
};
