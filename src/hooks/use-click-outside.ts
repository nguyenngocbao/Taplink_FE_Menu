import { useEffect } from 'react';

export function useClickOutside(
  callback: (e) => void,
  elements: Array<HTMLElement>
) {
  useEffect(() => {
    const handleOnClickOutside = event => {
      if (elements.some(element => element?.contains(event.target))) {
        return;
      }
      callback(event);
    };

    document.addEventListener('click', handleOnClickOutside);
    return () => {
      document.removeEventListener('click', handleOnClickOutside);
    };
  }, [callback]);

  return null;
}
