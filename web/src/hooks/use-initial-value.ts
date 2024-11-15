import { useState, useEffect } from "react";

/**
 * A hook that captures the initial non-null value and preserves it throughout component lifecycle.
 * Useful for cases where you want to store the first valid value and ignore subsequent updates.
 *
 * @template T The type of value to be captured
 * @param {T | null} currentValue - The current value that may change over time
 * @returns {T | null} The first non-null value that was captured, or null if no value has been captured yet
 *
 * @example
 * ```tsx
 * type Coordinates = { latitude: number; longitude: number };
 *
 * // Will only capture the first valid location
 * const initialLocation = useInitialValue<Coordinates>(currentLocation);
 * ```
 */
export const useInitialValue = <T>(currentValue: T | null) => {
  const [initialValue, setInitialValue] = useState<T | null>(null);

  useEffect(() => {
    if (currentValue && !initialValue) {
      setInitialValue(currentValue);
    }
  }, [currentValue, initialValue]);

  return initialValue;
};
