// components/home/lazySection.tsx
import React, { Suspense, useRef, lazy } from 'react';
import useIntersectionObserver from '@/lib/hooks/useIntersectionObserver';

const SectionLoader = () => (
  <div className="flex justify-center items-center p-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
  </div>
);

interface LazySectionProps {
  componentImport: () => Promise<{ default: React.ComponentType<any> }>;
}

const LazySection: React.FC<LazySectionProps> = ({ componentImport }) => {
  const ref = useRef<HTMLDivElement>(null);

  const isVisible = useIntersectionObserver(ref as React.RefObject<Element>, { threshold: 0.1 });

  const LazyComponent = lazy(componentImport);

  return (
    <div ref={ref} className="lazy-section-container">
      {isVisible && (
        <Suspense fallback={<SectionLoader />}>
          <LazyComponent />
        </Suspense>
      )}
    </div>
  );
};

export default LazySection;
