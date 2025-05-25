
import { useState, useEffect } from 'react';

// FIX: Update initialValue type to T | (() => T) and adjust useState initializer logic
function useLocalStorage<T,>(
  key: string,
  initialValueInput: T | (() => T) // Changed parameter name for clarity
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // This function is the initializer for useState.
    // It should return the initial state of type T.

    // First, try to get the value from localStorage
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          // Assuming the item in localStorage is a JSON string representation of T
          return JSON.parse(item) as T;
        }
        // If item is not found in localStorage, proceed to use initialValueInput
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        // If error reading, proceed to use initialValueInput
      }
    }

    // If localStorage is not available, item not found, or error during read:
    // Resolve initialValueInput to get the default value.
    if (initialValueInput instanceof Function) {
      return initialValueInput();
    } else {
      return initialValueInput;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;