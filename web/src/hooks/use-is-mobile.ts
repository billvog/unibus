import { useState, useEffect } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check if window exists (SSR safety)
      if (typeof window === "undefined") return false;

      const userAgent = navigator.userAgent.toLowerCase();

      const mobileChecks = [
        // Check user agent for mobile devices
        () =>
          /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(
            userAgent
          ),
        // Check if device has touch capability
        () => "maxTouchPoints" in navigator && navigator.maxTouchPoints > 0,
        // Check if it's a mobile-specific browser
        () => "standalone" in window.navigator,
        // Check screen orientation API
        () => typeof window.orientation !== "undefined",
      ];

      return mobileChecks.some((check) => check());
    };

    setIsMobile(checkMobile());
  }, []);

  return isMobile;
};
