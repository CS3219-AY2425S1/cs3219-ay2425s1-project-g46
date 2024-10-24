import { useEffect, useMemo, useState } from "react";

const useSessionStorage = (initial_value, id) => {
  const setItem = (key, value) => {
    sessionStorage.setItem(key, value);
  };

  const getItem = (key) => {
    return sessionStorage.getItem(key);
  };

  const removeItem = (key) => {
    sessionStorage.removeItem(key);
  }

  const _initial_value = useMemo(() => {
    const session_storage_value_str = getItem(id);

    // If there is a value stored in sessionStorage, use that
    if (session_storage_value_str) {
      return JSON.parse(session_storage_value_str);
    }

    // Otherwise use initial_value that was passed to the function
    return initial_value;
  }, []);
  const [state, setState] = useState(_initial_value);

  useEffect(() => {
    const state_str = JSON.stringify(state); // Stringified state
    setItem(id, state_str); // Set stringified state as item in sessionStorage
  }, [state]);

  return [state, setState];
};

export default useSessionStorage;