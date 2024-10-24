import { useEffect, useMemo, useState } from "react";

const useLocalStorage = (initial_value, id) => {
  const setItem = (key, value) => {
    localStorage.setItem(key, value);
  };

  const getItem = (key) => {
    return localStorage.getItem(key);
  };

  const removeItem = (key) => {
    localStorage.removeItem(key);
  }

  const _initial_value = useMemo(() => {
    const local_storage_value_str = getItem(id);

    // If there is a value stored in localStorage, use that
    if (local_storage_value_str) {
      return JSON.parse(local_storage_value_str);
    }

    // Otherwise use initial_value that was passed to the function
    return initial_value;
  }, []);
  const [state, setState] = useState(_initial_value);

  useEffect(() => {
    const state_str = JSON.stringify(state); // Stringified state
    setItem(id, state_str); // Set stringified state as item in localStorage
  }, [state]);

  return [state, setState];
};

export default useLocalStorage;