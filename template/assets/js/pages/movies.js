/* ============================================================
   CINE Page Script — Movie Listing (movies.js)
   assets/js/pages/movies.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Element References
  const moviesGrid = document.getElementById('moviesGrid');
  const tabsNav = document.getElementById('movieListingTabs');
  const tabButtons = tabsNav ? tabsNav.querySelectorAll('.tab-btn') : [];
  const tabIndicator = document.getElementById('toolbarTabIndicator');
  
  const pageEyebrow = document.getElementById('pageEyebrow');
  const pageTitle = document.getElementById('pageTitle');
  const pageDescription = document.getElementById('pageDescription');
  
  const trailerModal = document.getElementById('trailerModal');
  const closeModal = document.getElementById('closeModal');

  // NAVBAR scroll shadow & hamburger
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobileMenu');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (navbar && !navbar.contains(e.target)) {
        mobileMenu.classList.remove('open');
      }
    });
  }

  // CLOSE TRAILER MODAL
  const closeModalFn = () => {
    if (!trailerModal) return;
    trailerModal.classList.remove('open');
    document.body.style.overflow = '';
    const video = trailerModal.querySelector('video.cine-video-element');
    if (video) {
      video.pause();
      const playIcon = trailerModal.querySelector('.play-icon');
      const pauseIcon = trailerModal.querySelector('.pause-icon');
      if (playIcon && pauseIcon) {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }
    }
  };

  if (closeModal) closeModal.addEventListener('click', closeModalFn);
  if (trailerModal) {
    trailerModal.addEventListener('click', (e) => {
      if (e.target === trailerModal) closeModalFn();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModalFn();
    });
  }

  // SEARCH MODAL CONTROLS
  const openSearchBtnNav = document.getElementById('openSearchBtnNav');
  const searchModal = document.getElementById('searchModal');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  const openSearch = () => {
    if (!searchModal) return;
    searchModal.classList.add('active');
    if (searchInput) setTimeout(() => searchInput.focus(), 100);
  };

  const closeSearch = () => {
    if (!searchModal) return;
    searchModal.classList.remove('active');
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.innerHTML = '';
  };

  if (openSearchBtnNav) {
    openSearchBtnNav.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });
  }
  if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', closeSearch);
  }
  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearch();
    });
  }

  // Debounced search logic with suggestions
  let searchTimeout;
  if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim().toLowerCase();
      
      if (!query) {
        searchResults.innerHTML = '';
        return;
      }
      
      searchTimeout = setTimeout(() => {
        const results = (window.CINE_MOVIES_DB || []).filter(movie => 
          movie.title.toLowerCase().includes(query)
        );
        
        if (results.length > 0) {
          const html = results.map(r => `
            <div style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; display: flex; align-items: center; gap: 12px;" 
                 onclick="window.location.href='movie-detail.html?id=${r.id}'">
              <img src="${r.poster}" style="width: 40px; height: 55px; object-fit: cover; border-radius: 4px;" alt="">
              <div>
                <div style="font-weight: 600; color: #fff; font-size: 14px;">${r.title}</div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 2px;">${r.genre} • ${r.ageRating}</div>
              </div>
            </div>
          `).join('');
          searchResults.innerHTML = `<div style="font-size: 13px; margin-bottom: 10px; color: rgba(255,255,255,0.6)">Kết quả tìm kiếm:</div>` + html;
        } else {
          searchResults.innerHTML = `<div style="color: rgba(255,255,255,0.4); padding: 20px 0; text-align: center; font-size: 13px;">Không tìm thấy phim phù hợp.</div>`;
        }
      }, 250);
    });
  }
  
  // Pagination & Filter States
  let activeCategory = 'now-showing';
  let filteredMovies = [];

  // Metadata mappings for clean spacing & design headers
  const categoryHeaders = {
    'now-showing': {
      eyebrow: 'Khám phá phim chiếu rạp',
      title: 'PHIM <span class="highlight-text" data-variant="underline" data-color="primary">ĐANG CHIẾU</span>',
      desc: 'Cập nhật danh sách phim chiếu rạp mới nhất, bom tấn hành động đỉnh cao và thế giới đầy màu sắc tại CINE.'
    },
    'coming-soon': {
      eyebrow: 'Hóng bom tấn sắp đổ bộ',
      title: 'PHIM <span class="highlight-text" data-variant="underline" data-color="primary">SẮP CHIẾU</span>',
      desc: 'Điểm mặt những tác phẩm bom tấn, phim gia đình, và hoạt hình sắp sửa ra mắt khán giả Việt Nam tại hệ thống rạp CINE.'
    },
    'imax': {
      eyebrow: 'Trải nghiệm đỉnh cao công nghệ',
      title: 'PHIM <span class="highlight-text" data-variant="underline" data-color="primary">IMAX SPECIAL</span>',
      desc: 'Đắm chìm vào thế giới điện ảnh kỳ vĩ với màn hình khổng lồ, hệ thống âm thanh vòm đỉnh cao độc quyền chỉ có tại phòng chiếu IMAX.'
    },
    'nationwide': {
      eyebrow: 'Khám phá tất cả tác phẩm',
      title: 'TOÀN BỘ <span class="highlight-text" data-variant="underline" data-color="primary">PHIM CINE</span>',
      desc: 'Tìm kiếm nhanh chóng mọi tác phẩm điện ảnh bom tấn đang và sắp trình chiếu trên toàn bộ hệ thống rạp CINE toàn quốc.'
    }
  };

  /* ----------------------------------------------------------
     2. DYNAMIC TAB INDICATOR POSITIONING
  ---------------------------------------------------------- */
  const updateTabIndicator = (activeBtn) => {
    if (!tabIndicator || !activeBtn) return;
    tabIndicator.style.left = `${activeBtn.offsetLeft}px`;
    tabIndicator.style.width = `${activeBtn.offsetWidth}px`;
  };

  // Adjust indicator on window resize to prevent alignment shifts
  window.addEventListener('resize', () => {
    const activeBtn = tabsNav ? tabsNav.querySelector('.tab-btn.active') : null;
    if (activeBtn) updateTabIndicator(activeBtn);
  }, { passive: true });

  /* ----------------------------------------------------------
     3. MOVIE CARD GENERATION AND EVENT BINDINGS
  ---------------------------------------------------------- */
  const renderCardHTML = (movie) => {
    // Classification Badge styling class mapping
    const ageClass = movie.ageRating ? movie.ageRating.toLowerCase() : 'p';
    
    // Rating or release date representation
    const metaInfo = movie.category === 'coming-soon' 
      ? `<span class="release-date" style="font-size: 11px; font-weight: 600; color: var(--color-accent-deep); text-transform: uppercase;">Sắp chiếu hè</span>`
      : `<span class="rating">★ ${movie.rating || '9.0'}</span>`;

    return `
      <div class="movie-card" data-movie-id="${movie.id}">
        <div class="movie-poster-wrap">
          <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" loading="lazy" />
          
          <!-- Classification Badge -->
          <span class="age-rating-badge ${ageClass}">${movie.ageRating}</span>
          
          <!-- Hover Actions Overlay -->
          <div class="movie-overlay">
            <a href="movie-detail.html?id=${movie.id}#schedule" class="btn-primary movie-action-btn dat-ve-btn" aria-label="Đặt vé">Đặt vé</a>
            <button class="btn-ghost movie-action-btn trailer-btn" aria-label="Xem trailer" 
              data-src="${movie.trailerSrc}" data-poster="${movie.poster}" data-title="${movie.title}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 6px;">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Trailer
            </button>
          </div>
          
          ${movie.format ? `<span class="movie-format-badge">${movie.format.split(' ')[0]}</span>` : ''}
        </div>
        <div class="movie-info">
          <h3 style="cursor: pointer;" class="movie-title-link">${movie.title}</h3>
          <div class="movie-meta-row">
            ${metaInfo}
            <span class="genre-tag">${movie.genre ? movie.genre.split(' / ')[0] : 'Điện ảnh'}</span>
          </div>
        </div>
      </div>
    `;
  };

  /* ----------------------------------------------------------
     4. DATA FILTER AND RENDER ENGINE
  ---------------------------------------------------------- */
  const updateGrid = (smooth = true) => {
    if (!moviesGrid) return;

    if (smooth) {
      moviesGrid.classList.remove('show');
    }

    // A. Filter database by active category tab
    let list = [];
    if (activeCategory === 'nationwide') {
      list = window.CINE_MOVIES_DB || [];
    } else {
      list = (window.CINE_MOVIES_DB || []).filter(m => m.category === activeCategory);
    }

    filteredMovies = list;

    // D. Empty State validation
    if (filteredMovies.length === 0) {
      moviesGrid.innerHTML = `
        <div class="movies-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
            <line x1="7" y1="2" x2="7" y2="22" />
            <line x1="17" y1="2" x2="17" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="2" y1="7" x2="7" y2="7" />
            <line x1="2" y1="17" x2="7" y2="17" />
            <line x1="17" y1="17" x2="22" y2="17" />
            <line x1="17" y1="7" x2="22" y2="7" />
          </svg>
          <h3>Không tìm thấy phim phù hợp</h3>
          <p>Thử đổi danh mục để tìm kiếm thêm phim chiếu rạp.</p>
        </div>
      `;
      if (smooth) {
        setTimeout(() => moviesGrid.classList.add('show'), 50);
      } else {
        moviesGrid.classList.add('show');
      }
      return;
    }

    // E. Render all filtered records directly
    moviesGrid.innerHTML = filteredMovies.map(renderCardHTML).join('');

    // Re-run any micro-animations hooks if available (like highlight text underline rendering)
    if (window.CineHighlightText && typeof window.CineHighlightText.renderAll === 'function') {
      window.CineHighlightText.renderAll();
    }

    // G. Grid Reveal Animation
    if (smooth) {
      setTimeout(() => moviesGrid.classList.add('show'), 50);
    } else {
      moviesGrid.classList.add('show');
    }
  };

  /* ----------------------------------------------------------
     5. DYNAMIC TRAILER PLAYER MODAL HANDLER
  ---------------------------------------------------------- */
  const playTrailer = (src, poster, title) => {
    if (!trailerModal) return;

    // A. Query standard custom video player child elements
    const video = trailerModal.querySelector('video.cine-video-element');
    const posterOverlay = trailerModal.querySelector('.cine-poster-overlay');
    
    if (video) {
      // Pause current playback if playing
      video.pause();
      
      // Update video source dynamically
      video.src = src;
      video.load();
      
      // Update background poster image
      if (posterOverlay) {
        posterOverlay.style.backgroundImage = `url('${poster}')`;
        posterOverlay.classList.remove('is-hidden');
      }

      // Reset controls play buttons visual representations
      const playIcon = trailerModal.querySelector('.play-icon');
      const pauseIcon = trailerModal.querySelector('.pause-icon');
      if (playIcon && pauseIcon) {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }

      // Open Modal Overlay
      trailerModal.classList.add('open');
      document.body.style.overflow = 'hidden';

      // B. Trigger autoplay after a short buffer delay
      setTimeout(() => {
        video.play().then(() => {
          if (playIcon && pauseIcon) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
          }
          if (posterOverlay) {
            posterOverlay.classList.add('is-hidden');
          }
        }).catch(err => {
          console.warn("Autoplay block by browser policies. Waiting for user interaction.", err);
        });
      }, 250);
    }
  };

  // Global listener for card clicks & button actions (event delegation for performance)
  if (moviesGrid) {
    moviesGrid.addEventListener('click', (e) => {
      // 1. Click on trailer action button
      const trailerBtn = e.target.closest('.trailer-btn');
      if (trailerBtn) {
        e.preventDefault();
        e.stopPropagation();
        const src = trailerBtn.getAttribute('data-src');
        const poster = trailerBtn.getAttribute('data-poster');
        const title = trailerBtn.getAttribute('data-title');
        playTrailer(src, poster, title);
        return;
      }

      // 2. Click on card title link or poster layout for redirection to detail
      const card = e.target.closest('.movie-card');
      const titleLink = e.target.closest('.movie-title-link');
      const posterWrap = e.target.closest('.movie-poster-wrap');
      
      if (card && (titleLink || posterWrap) && !e.target.closest('.movie-action-btn')) {
        const movieId = card.getAttribute('data-movie-id');
        if (movieId) {
          window.location.href = `movie-detail.html?id=${movieId}`;
        }
      }
    });
  }

  /* ----------------------------------------------------------
     6. TAB SWITCHING ROUTING ROUTINE
  ---------------------------------------------------------- */
  const handleCategorySwitch = (category, updateUrl = true) => {
    if (activeCategory === category && updateUrl) return;

    activeCategory = category;

    // A. Sync active tab button visual representations
    const targetBtn = tabsNav ? tabsNav.querySelector(`.tab-btn[data-tab="${category}"]`) : null;
    if (targetBtn) {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      targetBtn.classList.add('active');
      updateTabIndicator(targetBtn);
    }

    // B. Dynamically update Header Title & Description
    const metadata = categoryHeaders[category] || categoryHeaders['now-showing'];
    if (pageEyebrow) pageEyebrow.textContent = metadata.eyebrow;
    if (pageTitle) pageTitle.innerHTML = metadata.title;
    if (pageDescription) pageDescription.textContent = metadata.desc;

    // C. Update browser address bar query param (dynamic routing SPA style)
    if (updateUrl && window.history.pushState) {
      const newUrl = `${window.location.pathname}?category=${category}`;
      window.history.pushState({ category }, '', newUrl);
    }

    // D. Refresh data grid
    updateGrid(true);
  };

  // Tab click bindings
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-tab');
      if (cat) handleCategorySwitch(cat, true);
    });
  });

  /* ----------------------------------------------------------
     7. INITIALIZATION FLOW
  ---------------------------------------------------------- */
  const initPage = () => {
    // Read category from URL query parameters (?category=now-showing)
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category');
    
    // Supported tabs fallback validation
    const supportedTabs = ['now-showing', 'coming-soon', 'imax', 'nationwide'];
    const targetCat = supportedTabs.includes(catParam) ? catParam : 'now-showing';
    
    // Set active tab and position glow indicator
    activeCategory = targetCat;
    
    // Double render execution for browser load reliability
    setTimeout(() => {
      const activeBtn = tabsNav ? tabsNav.querySelector(`.tab-btn[data-tab="${targetCat}"]`) : null;
      if (activeBtn) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
        updateTabIndicator(activeBtn);
      }
      handleCategorySwitch(targetCat, false);
    }, 150);
  };

  // Browser navigation popstate listener (handles back/forward clicks cleanly)
  window.addEventListener('popstate', (e) => {
    const cat = e.state && e.state.category ? e.state.category : 'now-showing';
    handleCategorySwitch(cat, false);
  });

  // Execute scroll-triggered animations for fade-up elements
  const fadeEls = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-up'));
            const idx = siblings.indexOf(entry.target);
            const delay = Math.min(idx * 60, 300);

            setTimeout(() => {
              entry.target.classList.add('in-view');
            }, delay);

            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach((el) => io.observe(el));
  } else {
    fadeEls.forEach((el) => el.classList.add('in-view'));
  }

  // Execute initialization
  initPage();
});
