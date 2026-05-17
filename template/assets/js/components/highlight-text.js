/* ============================================================
   CINE Component — Highlight Text
   assets/js/components/highlight-text.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const highlightElements = document.querySelectorAll('.highlight-text');

  highlightElements.forEach((el) => {
    // 1. Wrap children if not already wrapped
    if (!el.querySelector('.highlight-text-content')) {
      const wrapper = document.createElement('span');
      wrapper.className = 'highlight-text-content';
      while (el.firstChild) {
        wrapper.appendChild(el.firstChild);
      }
      el.appendChild(wrapper);
    }

    const variant = el.getAttribute('data-variant') || 'underline';
    const strokeWidth = el.getAttribute('data-stroke-width') || '2';
    
    let svgElement = null;
    let pathElement = null;
    let pathLength = 0;

    const renderSVG = () => {
      const width = el.offsetWidth;
      const height = el.offsetHeight;

      if (width === 0 || height === 0) return;

      // Remove existing SVG if present
      const oldSvg = el.querySelector('.highlight-svg');
      if (oldSvg) oldSvg.remove();

      const padding = 8;
      const svgWidth = width + padding * 2;
      const svgHeight = height + padding * 2;

      // Create SVG
      svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgElement.setAttribute('class', 'highlight-svg');
      svgElement.setAttribute('aria-hidden', 'true');
      svgElement.style.top = `-${padding}px`;
      svgElement.style.left = `-${padding}px`;
      svgElement.style.width = `${svgWidth}px`;
      svgElement.style.height = `${svgHeight}px`;

      if (variant === 'marker') {
        const markerHeight = height + 4;
        const y1 = padding - 2;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('class', 'highlight-marker-rect');
        rect.setAttribute('x', `${padding - 2}`);
        rect.setAttribute('y', `${y1}`);
        rect.setAttribute('width', `${width + 4}`);
        rect.setAttribute('height', `${markerHeight}`);
        rect.setAttribute('rx', '2');
        svgElement.appendChild(rect);
      } else {
        pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('class', 'highlight-path');
        pathElement.style.strokeWidth = strokeWidth;

        let d = '';
        if (variant === 'underline') {
          const y = svgHeight - padding + 2;
          pathLength = width + 10;
          d = `M ${padding - 2} ${y} Q ${padding + width * 0.25} ${y - 3} ${padding + width * 0.5} ${y} T ${padding + width + 2} ${y}`;
        } else if (variant === 'box') {
          const boxPadding = 4;
          pathLength = (width + height + boxPadding * 2) * 2 + 20;
          d = `M ${padding - boxPadding} ${padding - boxPadding + 2} L ${padding + width + boxPadding} ${padding - boxPadding} L ${padding + width + boxPadding + 2} ${padding + height + boxPadding} L ${padding - boxPadding + 1} ${padding + height + boxPadding + 2} Z`;
        } else if (variant === 'circle') {
          const cx = padding + width / 2;
          const cy = padding + height / 2;
          const rx = width / 2 + 6;
          const ry = height / 2 + 6;
          pathLength = Math.PI * 2 * Math.max(rx, ry);
          d = `M ${cx - rx} ${cy} C ${cx - rx} ${cy - ry * 0.55} ${cx - rx * 0.55} ${cy - ry - 2} ${cx} ${cy - ry} C ${cx + rx * 0.55} ${cy - ry + 2} ${cx + rx + 1} ${cy - ry * 0.55} ${cx + rx} ${cy + 2} C ${cx + rx - 1} ${cy + ry * 0.55} ${cx + rx * 0.55} ${cy + ry + 1} ${cx - 2} ${cy + ry} C ${cx - rx * 0.55} ${cy + ry - 1} ${cx - rx + 2} ${cy + ry * 0.55} ${cx - rx} ${cy}`;
        }

        pathElement.setAttribute('d', d);
        pathElement.style.strokeDasharray = `${pathLength}`;
        pathElement.style.strokeDashoffset = `${pathLength}`;
        svgElement.appendChild(pathElement);
      }

      el.appendChild(svgElement);
    };

    // Initial render
    renderSVG();

    // Resize observer
    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(() => {
        renderSVG();
      });
      resizeObserver.observe(el);
    }

    // Intersection observer for animation triggering
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      }, { threshold: 0.5, rootMargin: '0px 0px -50px 0px' });
      observer.observe(el);
    } else {
      el.classList.add('is-visible');
    }
  });
});
