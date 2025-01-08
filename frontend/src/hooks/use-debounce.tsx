import { useRef } from "react";

export function useDebounce<T>(callback: (value?: T) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = (value?: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(value);
    }, delay);
  };

  return debouncedCallback;
}
