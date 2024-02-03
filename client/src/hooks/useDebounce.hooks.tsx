import { useState, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDebounce(value: any, delay = 300) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [debounceValue, setDebounceValue] = useState<any>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounceValue;
}

export default useDebounce;
