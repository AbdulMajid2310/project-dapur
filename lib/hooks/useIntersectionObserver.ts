// lib/hooks/useIntersectionObserver.ts
import { useEffect, useState, RefObject } from 'react';

function useIntersectionObserver(
  elementRef: RefObject<Element>,
  options?: IntersectionObserverInit
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        // Opsional: Hentikan pengamatan setelah elemen terlihat sekali
        observer.unobserve(element);
      }
    }, options);

    observer.observe(element);

    // Cleanup
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [elementRef, options]);

  return isIntersecting;
}

export default useIntersectionObserver;