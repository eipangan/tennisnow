import { Dispatch, SetStateAction, useState } from 'react';

/**
 * get local date format
 */
export const getLocaleDateFormat = (): string => {
  const date = new Date('September 8, 2222');
  return date.toLocaleDateString(navigator.language, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
    .replace('09', 'M')
    .replace('9', 'M')
    .replace('08', 'DD')
    .replace('8', 'D')
    .replace('2222', 'YYYY')
    .replace('22', 'YY');
};

/**
 * shuffle contents of a string array
 *
 * @param a array of strings
 */
export const shuffle = (a: string[]): string[] => {
  let j;
  let x;
  let i;
  for (i = a.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
};

/**
 * use local storage
 *
 * @param key key to use to identify variable in local storage
 * @param initialValue initial value of the variable
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: any) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
    }
  };

  return [storedValue, setValue];
}
