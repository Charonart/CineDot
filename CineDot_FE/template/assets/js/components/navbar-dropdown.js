/* ============================================================
   CINE Navbar Dropdown Script
   assets/js/components/navbar-dropdown.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Element References
  const dropdownItems = document.querySelectorAll('.nav-inner .nav-item-dropdown');
  const mobileDropdownItems = document.querySelectorAll('.nav-mobile-menu .nav-item-dropdown');

  /* ----------------------------------------------------------
     A. DYNAMIC MOVIE RENDER FOR PHIM MEGA DROPDOWN
     ---------------------------------------------------------- */
  const renderMegaCard = (movie) => {
    const ageClass = movie.ageRating ? movie.ageRating.toLowerCase() : 'p';
    
    // Create badges HTML for bottom-right poster wrap absolute positioning
    let badgesHTML = '';
    if (movie.rating) {
      badgesHTML += `<span class="mega-rating-badge"><span class="star">⭐</span> ${movie.rating.toFixed(1)}</span>`;
    }
    if (movie.ageRating) {
      badgesHTML += `<span class="mega-age-badge ${ageClass}">${movie.ageRating}</span>`;
    }

    const metaHTML = movie.category === 'coming-soon' 
      ? `<span class="release-date" style="font-size: 11px; font-weight: 700; color: var(--color-accent-deep, #6366f1); text-transform: uppercase; margin-right: 6px;">Sắp chiếu</span>`
      : '';
    
    const genreText = movie.genre ? movie.genre.split(' / ')[0] : 'Điện ảnh';

    return `
      <div class="mega-movie-card" data-movie-id="${movie.id}">
        <div class="mega-poster-wrap">
          <img src="${movie.poster}" alt="${movie.title}" class="mega-poster" loading="lazy" />
          <div class="mega-badges-group">
            ${badgesHTML}
          </div>
          <div class="mega-overlay">
            <a href="movie-detail.html?id=${movie.id}#schedule" class="btn-primary mega-action-btn" aria-label="Đặt vé">Đặt vé</a>
          </div>
        </div>
        <div class="mega-movie-info">
          <h3 class="mega-movie-title" onclick="window.location.href='movie-detail.html?id=${movie.id}'">${movie.title}</h3>
          <div class="mega-meta-row">
            ${metaHTML}
            <span>${genreText}</span>
          </div>
        </div>
      </div>
    `;
  };

  const loadMegaMovies = () => {
    // Look up grids on both desktop capsule and mobile drawer
    const nowShowingGrids = document.querySelectorAll('[id="megaNowShowingGrid"]');
    const comingSoonGrids = document.querySelectorAll('[id="megaComingSoonGrid"]');

    if (nowShowingGrids.length === 0 && comingSoonGrids.length === 0) return;

    if (!window.CINE_MOVIES_DB) {
      // Retry in 50ms if central database script is still downloading/parsing
      setTimeout(loadMegaMovies, 50);
      return;
    }

    const nowShowing = window.CINE_MOVIES_DB.filter(m => m.category === 'now-showing').slice(0, 4);
    const comingSoon = window.CINE_MOVIES_DB.filter(m => m.category === 'coming-soon').slice(0, 4);

    const nowShowingHTML = nowShowing.map(renderMegaCard).join('');
    const comingSoonHTML = comingSoon.map(renderMegaCard).join('');

    nowShowingGrids.forEach(grid => grid.innerHTML = nowShowingHTML);
    comingSoonGrids.forEach(grid => grid.innerHTML = comingSoonHTML);
  };

  // Run database dynamic injection
  loadMegaMovies();

  /* ----------------------------------------------------------
     B. INTERACTIVE ACTIONS (HOVER & FOCUS) FOR DESKTOP
     ---------------------------------------------------------- */
  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.nav-dropdown-trigger');
    const content = item.querySelector('.dropdown-content');
    let closeTimeout = null;

    if (!trigger || !content) return;

    // Set accessibility descriptors
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    const openDropdown = () => {
      // Clear any pending close timeouts for seamless visual transitioning
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
      }

      // Close all other dropdowns first (exclusive display behavior)
      dropdownItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherContent = otherItem.querySelector('.dropdown-content');
          const otherTrigger = otherItem.querySelector('.nav-dropdown-trigger');
          if (otherContent) otherContent.classList.remove('open');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          otherItem.classList.remove('active');
        }
      });

      // Open current
      content.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      item.classList.add('active');
    };

    const closeDropdown = () => {
      // Debounce closing with a 150ms delay to prevent cursor-move flickers
      closeTimeout = setTimeout(() => {
        content.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        item.classList.remove('active');
      }, 150);
    };

    // 1. Mouse Enter / Leave Events
    item.addEventListener('mouseenter', openDropdown);
    item.addEventListener('mouseleave', closeDropdown);

    // 2. Keyboard Focus Events (A11y compliance)
    trigger.addEventListener('focus', openDropdown);
    
    // Close when tabbing out of the dropdown container contents
    const focusableElements = content.querySelectorAll('a, button');
    if (focusableElements.length > 0) {
      const lastElement = focusableElements[focusableElements.length - 1];
      lastElement.addEventListener('blur', closeDropdown);
    } else {
      trigger.addEventListener('blur', closeDropdown);
    }
  });

  /* ----------------------------------------------------------
     C. COLLAPSIBLE ACCORDION FOR MOBILE MENU
     ---------------------------------------------------------- */
  mobileDropdownItems.forEach(item => {
    const trigger = item.querySelector('.nav-dropdown-trigger');
    const content = item.querySelector('.dropdown-content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', (e) => {
      // Prevent actual navbar top level navigation redirects on touch
      e.preventDefault();
      e.stopPropagation();

      const isOpen = item.classList.contains('active');

      // Close other mobile drawers
      mobileDropdownItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current collapsible drawer
      if (isOpen) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ----------------------------------------------------------
     D. GLOBAL CLOSURE HANDLERS (CLICK-OUTSIDE & ESC KEY)
     ---------------------------------------------------------- */
  const closeAllDropdowns = () => {
    dropdownItems.forEach(item => {
      const content = item.querySelector('.dropdown-content');
      const trigger = item.querySelector('.nav-dropdown-trigger');
      if (content) content.classList.remove('open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      item.classList.remove('active');
    });
  };

  // Close when hitting escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.keyCode === 27) {
      closeAllDropdowns();
    }
  });

  // Close when clicking anywhere outside of the dropdown capsule trigger wraps
  document.addEventListener('click', (e) => {
    let clickedInside = false;
    dropdownItems.forEach(item => {
      if (item.contains(e.target)) {
        clickedInside = true;
      }
    });

    if (!clickedInside) {
      closeAllDropdowns();
    }
  });
});
