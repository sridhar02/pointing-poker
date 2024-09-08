import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue?: T) {
  // State to store the current value
  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // If item exists in local storage, parse and return it, otherwise return initialValue or undefined
      return (item ? JSON.parse(item) : initialValue) as T;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Use `useEffect` to update `localStorage` whenever the stored value changes
  useEffect(() => {
    try {
      if (storedValue === undefined) {
        // If stored value is undefined, remove the key from localStorage
        window.localStorage.removeItem(key);
      } else {
        // Otherwise, set the value in localStorage
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]);

  // Return the state and a function to update it
  return [storedValue, setStoredValue] as const;
}

export default useLocalStorage;
