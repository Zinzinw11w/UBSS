import { useEffect, useState } from 'react';

// Detects if viewport width is under the given breakpoint (default 768px)
export default function useIsMobile(breakpoint = 768) {
  const getMatch = () => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia) {
      return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
    }
    return window.innerWidth <= breakpoint;
  };

  const [isMobile, setIsMobile] = useState(getMatch());

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handleChange = () => setIsMobile(getMatch());
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }
    window.addEventListener('resize', handleChange);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
      window.removeEventListener('resize', handleChange);
    };
  }, [breakpoint]);

  return isMobile;
}



