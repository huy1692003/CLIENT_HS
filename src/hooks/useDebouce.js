import { useState, useEffect } from 'react';

/**
 * Hook dùng để debounce một giá trị
 * @param {any} value - Giá trị cần debounce (thường là từ input)
 * @param {number} delay - Thời gian chờ debounce (ms)
 * @returns {any} - Giá trị đã debounce
 */
export function useDebouncedValue(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}
