/* ============================================================
   CINE Component — Scroll Text
   assets/js/components/scroll-text.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const scrollElements = document.querySelectorAll('.scroll-text-slide-left');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // Animate once for ultimate premium feel
        }
      });
    }, observerOptions);

    scrollElements.forEach((el) => {
      observer.observe(el);
    });
  } else {
    // Fallback: show immediately
    scrollElements.forEach((el) => el.classList.add('in-view'));
  }
});
