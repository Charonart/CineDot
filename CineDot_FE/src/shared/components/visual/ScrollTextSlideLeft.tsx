'use client';

import React, { useRef, useState, useEffect } from 'react';

export interface ScrollTextSlideLeftProps {
  children: React.ReactNode;
  as?: 'span' | 'div' | 'h2' | 'p';
  className?: string;
  inView?: boolean;
}

export const ScrollTextSlideLeft: React.FC<ScrollTextSlideLeftProps> = ({
  children,
  as: Component = 'div',
  className = '',
  inView = true,
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const [activeInView, setActiveInView] = useState(inView);

  useEffect(() => {
    // If explicitly set to true or false by parent, let that take precedence
    if (inView) {
      setActiveInView(true);
      return;
    }

    const el = elementRef.current;
    if (!el) return;

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveInView(true);
            observer.unobserve(el);
          }
        },
        {
          root: null,
          rootMargin: '0px 0px -100px 0px',
          threshold: 0.1,
        }
      );

      observer.observe(el);
      return () => {
        observer.disconnect();
      };
    } else {
      // Fallback: show immediately if IntersectionObserver is not supported
      setActiveInView(true);
    }
  }, [inView]);

  return (
    <Component
      ref={elementRef as unknown as React.Ref<HTMLDivElement>}
      className={`scroll-text-slide-left ${activeInView ? 'in-view' : ''} ${className}`}
    >
      {children}
    </Component>
  );
};
