'use client';

import React, { useRef, useState, useEffect } from 'react';

export interface HighlightTextProps {
  children: React.ReactNode;
  as?: 'span' | 'em' | 'strong' | 'span';
  variant?: 'underline' | 'box' | 'circle' | 'marker';
  color?: 'primary' | 'secondary' | 'accent' | 'destructive';
  strokeWidth?: number;
  className?: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
  children,
  as: Component = 'span',
  variant = 'underline',
  color = 'primary',
  strokeWidth = 2,
  className = '',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateDimensions = () => {
      setDimensions({
        width: el.offsetWidth,
        height: el.offsetHeight
      });
    };

    // Calculate dimensions
    updateDimensions();

    // Trigger visual state animation
    const animTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Watch for size updates
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(() => {
        updateDimensions();
      });
      resizeObserver.observe(el);
      return () => {
        resizeObserver.disconnect();
        clearTimeout(animTimer);
      };
    }

    return () => clearTimeout(animTimer);
  }, []);

  // Standard constants from template script
  const padding = 8;
  const svgWidth = dimensions ? dimensions.width + padding * 2 : 0;
  const svgHeight = dimensions ? dimensions.height + padding * 2 : 0;

  let pathD = '';
  let pathLength = 0;
  const isMarker = variant === 'marker';

  if (dimensions && !isMarker) {
    const { width, height } = dimensions;

    if (variant === 'underline') {
      const y = svgHeight - padding + 2;
      pathLength = width + 10;
      pathD = `M ${padding - 2} ${y} Q ${padding + width * 0.25} ${y - 3} ${padding + width * 0.5} ${y} T ${padding + width + 2} ${y}`;
    } else if (variant === 'box') {
      const boxPadding = 4;
      pathLength = (width + height + boxPadding * 2) * 2 + 20;
      pathD = `M ${padding - boxPadding} ${padding - boxPadding + 2} L ${padding + width + boxPadding} ${padding - boxPadding} L ${padding + width + boxPadding + 2} ${padding + height + boxPadding} L ${padding - boxPadding + 1} ${padding + height + boxPadding + 2} Z`;
    } else if (variant === 'circle') {
      const cx = padding + width / 2;
      const cy = padding + height / 2;
      const rx = width / 2 + 6;
      const ry = height / 2 + 6;
      pathLength = Math.PI * 2 * Math.max(rx, ry);
      pathD = `M ${cx - rx} ${cy} C ${cx - rx} ${cy - ry * 0.55} ${cx - rx * 0.55} ${cy - ry - 2} ${cx} ${cy - ry} C ${cx + rx * 0.55} ${cy - ry + 2} ${cx + rx + 1} ${cy - ry * 0.55} ${cx + rx} ${cy + 2} C ${cx + rx - 1} ${cy + ry * 0.55} ${cx + rx * 0.55} ${cy + ry + 1} ${cx - 2} ${cy + ry} C ${cx - rx * 0.55} ${cy + ry - 1} ${cx - rx + 2} ${cy + ry * 0.55} ${cx - rx} ${cy}`;
    }
  }

  const computedClass = `highlight-text ${isVisible ? 'is-visible' : ''} ${className}`;

  return (
    <Component 
      ref={containerRef as unknown as React.Ref<HTMLSpanElement>}
      className={computedClass}
      data-variant={variant}
      data-color={color}
    >
      <span className="highlight-text-content">{children}</span>

      {dimensions && dimensions.width > 0 && dimensions.height > 0 && (
        <svg 
          className="highlight-svg" 
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: `-${padding}px`,
            left: `-${padding}px`,
            width: `${svgWidth}px`,
            height: `${svgHeight}px`,
            pointerEvents: 'none',
            overflow: 'visible',
            zIndex: 1,
          }}
        >
          {isMarker ? (
            <rect
              className="highlight-marker-rect"
              x={padding - 2}
              y={padding - 2}
              width={dimensions.width + 4}
              height={dimensions.height + 4}
              rx="2"
            />
          ) : (
            <path
              className="highlight-path"
              d={pathD}
              strokeWidth={strokeWidth}
              style={{
                strokeDasharray: `${pathLength}`,
                strokeDashoffset: isVisible ? 0 : pathLength,
              }}
            />
          )}
        </svg>
      )}
    </Component>
  );
};
