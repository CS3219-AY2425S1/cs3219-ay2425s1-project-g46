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
  }, [state, id]);

  const removeState = () => {
    removeItem(id);
    setState(initial_value); // Optionally reset the state to the initial value
  };

  return [state, setState, removeState];
};

export default useLocalStorage;