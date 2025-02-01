interface SafariNavigator extends Navigator {
  standalone?: boolean;
}

export const isPwa = (): boolean => {
  const standaloneMatch = window.matchMedia(
    "(display-mode: standalone)"
  ).matches;

  const safariStandalone =
    "standalone" in window.navigator
      ? ((window.navigator as SafariNavigator).standalone ?? false)
      : false;

  return standaloneMatch || safariStandalone;
};
