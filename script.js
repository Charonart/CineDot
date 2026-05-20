/* ============================================================
   CINE — Premium Movie Booking Platform
   script.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. NAVBAR — scroll shadow + hamburger
  ---------------------------------------------------------- */

  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobileMenu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        mobileMenu.classList.remove('open');
      }
    });
  }

  /* ----------------------------------------------------------
     2. MOVIE SLIDER & PREMIUM TAB SYSTEM
  ---------------------------------------------------------- */

  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const sliderControls = document.getElementById('tabSliderControls');
  
  const slidersConfig = {};

  const getSliderIdForTab = (tabId) => {
    if (tabId === 'now-showing') return 'movieSlider';
    if (tabId === 'imax') return 'imaxSlider';
    if (tabId === 'nationwide') return 'nationwideSlider';
    return null;
  };

  const initSlider = (sliderId) => {
    const slider = document.getElementById(sliderId);
    if (!slider) return null;

    let currentIndex = 0;

    const getVisibleCount = () => {
      const w = window.innerWidth;
      if (w <= 480)  return 1;
      if (w <= 700)  return 2;
      if (w <= 1100) return 3;
      return 4;
    };

    const getTotalCards = () => slider.children.length;

    const getCardWidth = () => {
      const card = slider.children[0];
      if (!card) return 0;
      const style = window.getComputedStyle(card);
      return card.offsetWidth + 20; // width + gap
    };

    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    const updateSlider = () => {
      const visible = getVisibleCount();
      const total = getTotalCards();
      const maxIndex = Math.max(0, total - visible);
      currentIndex = clamp(currentIndex, 0, maxIndex);

      const cardWidth = getCardWidth();
      slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

      // Only update controls opacity if this is the active tab's slider
      const activeTabBtn = document.querySelector('.tab-btn.active');
      const activeTabId = activeTabBtn ? activeTabBtn.dataset.tab : '';
      if (getSliderIdForTab(activeTabId) === sliderId && prevBtn && nextBtn) {
        prevBtn.style.opacity = currentIndex === 0 ? '0.35' : '1';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.35' : '1';
      }
    };

    const slideNext = () => {
      const visible = getVisibleCount();
      const maxIndex = Math.max(0, getTotalCards() - visible);
      currentIndex = clamp(currentIndex + 1, 0, maxIndex);
      updateSlider();
    };

    const slidePrev = () => {
      currentIndex = Math.max(0, currentIndex - 1);
      updateSlider();
    };

    // Touch / swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          slideNext();
        } else {
          slidePrev();
        }
      }
    }, { passive: true });

    window.addEventListener('resize', updateSlider, { passive: true });
    
    // Run initial update
    updateSlider();

    return {
      slideNext,
      slidePrev,
      updateSlider
    };
  };

  // Initialize all active sliders
  ['movieSlider', 'imaxSlider', 'nationwideSlider'].forEach(id => {
    const sliderInst = initSlider(id);
    if (sliderInst) {
      slidersConfig[id] = sliderInst;
    }
  });

  const getActiveSliderInstance = () => {
    const activeTab = document.querySelector('.tab-btn.active');
    if (!activeTab) return null;
    const tabId = activeTab.dataset.tab;
    const sliderId = getSliderIdForTab(tabId);
    return slidersConfig[sliderId];
  };

  if (prevBtn && nextBtn) {
    nextBtn.addEventListener('click', () => {
      const activeSlider = getActiveSliderInstance();
      if (activeSlider) activeSlider.slideNext();
    });

    prevBtn.addEventListener('click', () => {
      const activeSlider = getActiveSliderInstance();
      if (activeSlider) activeSlider.slidePrev();
    });
  }

  // --- TAB NAVIGATION LOGIC ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabIndicator = document.querySelector('.tab-glow-indicator');

  const updateTabIndicator = (activeBtn) => {
    if (!tabIndicator || !activeBtn) return;
    tabIndicator.style.left = `${activeBtn.offsetLeft}px`;
    tabIndicator.style.width = `${activeBtn.offsetWidth}px`;
  };

  const switchTab = (targetBtn) => {
    if (targetBtn.classList.contains('active')) return;

    const tabId = targetBtn.dataset.tab;
    const currentActiveBtn = document.querySelector('.tab-btn.active');
    const currentActivePanel = document.querySelector('.tab-panel.active');
    const targetPanel = document.getElementById(`tab-${tabId}`);

    if (currentActiveBtn) currentActiveBtn.classList.remove('active');
    targetBtn.classList.add('active');
    updateTabIndicator(targetBtn);

    if (currentActivePanel) {
      currentActivePanel.classList.remove('show');
      
      // Wait for the opacity fade transition to finish (150ms) before changing layout
      setTimeout(() => {
        currentActivePanel.classList.remove('active');
        
        if (targetPanel) {
          targetPanel.classList.add('active');
          // Force layout reflow so standard transitions work
          targetPanel.offsetHeight;
          targetPanel.classList.add('show');
          
          // Re-adjust active slider layout and toggle controls visibility
          const sliderId = getSliderIdForTab(tabId);
          if (sliderId && slidersConfig[sliderId]) {
            slidersConfig[sliderId].updateSlider();
            if (sliderControls) {
              sliderControls.style.opacity = '1';
              sliderControls.style.pointerEvents = 'all';
            }
          } else {
            if (sliderControls) {
              sliderControls.style.opacity = '0';
              sliderControls.style.pointerEvents = 'none';
            }
          }
        }
      }, 150);
    } else {
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.classList.add('show');
      }
    }
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn));
  });

  // Handle initialization positioning of indicators and sliders
  const initialActiveBtn = document.querySelector('.tab-btn.active');
  if (initialActiveBtn) {
    const handleInitialLayout = () => {
      updateTabIndicator(initialActiveBtn);
      const activePanel = document.querySelector('.tab-panel.active');
      if (activePanel) {
        activePanel.classList.add('show');
      }
      // Re-trigger layout alignment on active slider
      const sliderId = getSliderIdForTab(initialActiveBtn.dataset.tab);
      if (sliderId && slidersConfig[sliderId]) {
        slidersConfig[sliderId].updateSlider();
      }
    };

    window.addEventListener('load', handleInitialLayout);
    // Double trigger for reliability if window load has already passed
    handleInitialLayout();
  }

  /* ----------------------------------------------------------
     3. TRAILER MODAL — open / close
  ---------------------------------------------------------- */

  const modal = document.getElementById('trailerModal');
  const closeModal = document.getElementById('closeModal');

  const openTrailerBtns = [
    document.getElementById('openTrailerBtn'),
    document.getElementById('openTrailerBtn2'),
    document.getElementById('openTrailerBtn3'),
  ];

  const openModal = () => {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModalFn = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    // Pause any active video player in the modal
    const video = modal.querySelector('video');
    if (video) {
      video.pause();
      const playIcon = modal.querySelector('.play-icon');
      const pauseIcon = modal.querySelector('.pause-icon');
      if (playIcon && pauseIcon) {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }
    }
  };

  openTrailerBtns.forEach((btn) => {
    if (btn) btn.addEventListener('click', openModal);
  });

  if (closeModal) closeModal.addEventListener('click', closeModalFn);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModalFn();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModalFn();
    });
  }

  /* ----------------------------------------------------------
     4. QUICK BOOKING — alert with selected values
  ---------------------------------------------------------- */

  const quickBookBtn = document.getElementById('quickBookBtn');

  if (quickBookBtn) {
    quickBookBtn.addEventListener('click', () => {
      const movie   = document.getElementById('bookMovie')?.value;
      const cinema  = document.getElementById('bookCinema')?.value;
      const date    = document.getElementById('bookDate')?.value;
      const time    = document.getElementById('bookTime')?.value;

      if (!movie || !cinema || !date || !time) {
        showToast('Vui lòng chọn đầy đủ thông tin để tiếp tục.', 'warning');
        return;
      }

      showToast(
        `🎬 Đặt vé thành công!\n${movie}\n${cinema}\n${date} · ${time}`,
        'success'
      );
    });
  }

  /* ----------------------------------------------------------
     5. TOAST NOTIFICATION
  ---------------------------------------------------------- */

  function showToast(message, type = 'success') {
    // Remove existing toast
    const existing = document.querySelector('.cine-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'cine-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: ${type === 'success' ? '#131413' : '#b45309'};
      color: #fff;
      padding: 16px 24px;
      border-radius: 14px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.5;
      white-space: pre-line;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      z-index: 9999;
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
      max-width: 340px;
      border: 1px solid rgba(255,255,255,0.1);
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
      });
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(12px)';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  /* ----------------------------------------------------------
     6. SCROLL-TRIGGERED FADE-UP ANIMATIONS
  ---------------------------------------------------------- */

  const fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // Stagger siblings slightly
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
    // Fallback: show everything
    fadeEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ----------------------------------------------------------
     7. NOTIFY ME BUTTONS
  ---------------------------------------------------------- */

  document.querySelectorAll('.coming-info .btn-outline, .movie-overlay .btn-outline').forEach((btn) => {
    btn.addEventListener('click', function () {
      const title = this.closest('.coming-card')?.querySelector('h3')?.textContent || this.closest('.movie-card')?.querySelector('h3')?.textContent || 'phim này';
      this.textContent = '✓ Đã nhận tin';
      this.style.background = '#131413';
      this.style.color = '#fff';
      this.style.borderColor = '#131413';
      this.disabled = true;
      showToast(`Bạn sẽ nhận được thông báo khi phim ${title} mở bán vé!`, 'success');
    });
  });

  /* ----------------------------------------------------------
     8. VIEW SHOWTIMES BUTTONS
  ---------------------------------------------------------- */

  document.querySelectorAll('.location-card .btn-outline').forEach((btn) => {
    btn.addEventListener('click', function () {
      const name = this.closest('.location-card')?.querySelector('h3')?.textContent || 'Rạp';
      showToast(`Đang tải lịch chiếu cho ${name}…`, 'success');
    });
  });

  /* ----------------------------------------------------------
     9. MEMBERSHIP JOIN BUTTON
  ---------------------------------------------------------- */

  const joinBtn = document.querySelector('.membership .btn-primary');
  if (joinBtn) {
    joinBtn.addEventListener('click', () => {
      showToast('Chào mừng! Đang chuyển hướng đến trang đăng ký thành viên…', 'success');
    });
  }

  /* ----------------------------------------------------------
     10. POINTS BAR ANIMATION
  ---------------------------------------------------------- */

  const pointsFill = document.querySelector('.points-fill');
  if (pointsFill && 'IntersectionObserver' in window) {
    const targetWidth = pointsFill.style.width;
    pointsFill.style.width = '0%';

    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            pointsFill.style.width = targetWidth;
          }, 400);
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    barObserver.observe(pointsFill);
  }

  /* ----------------------------------------------------------
     11. CINE MOVIE DETAIL PAGE SPECIFIC INTERACTIONS
  ---------------------------------------------------------- */

  const detailBookBtn = document.getElementById('detailBookBtn');
  const navbarBookBtn = document.getElementById('navbarBookBtn');
  const mobileNavbarBookBtn = document.getElementById('mobileNavbarBookBtn');
  const scheduleSection = document.getElementById('schedule');

  const scrollToSchedule = (e) => {
    if (scheduleSection) {
      e.preventDefault();
      scheduleSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (detailBookBtn) detailBookBtn.addEventListener('click', scrollToSchedule);
  if (navbarBookBtn) navbarBookBtn.addEventListener('click', scrollToSchedule);
  if (mobileNavbarBookBtn) mobileNavbarBookBtn.addEventListener('click', scrollToSchedule);

  // Date Tabs selection
  const dateTabs = document.querySelectorAll('.date-tab');
  dateTabs.forEach((tab) => {
    tab.addEventListener('click', function () {
      dateTabs.forEach((t) => t.classList.remove('active'));
      this.classList.add('active');
      const dateVal = this.textContent || this.dataset.date;
      showToast(`Đã hiển thị lịch chiếu cho ngày ${dateVal}`, 'success');
    });
  });

  // Showtime selection
  const timeBtns = document.querySelectorAll('.time-btn');
  timeBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      timeBtns.forEach((b) => b.classList.remove('selected'));
      this.classList.add('selected');
      const timeVal = this.textContent;
      const formatVal = this.dataset.format || '2D Lồng Tiếng';
      showToast(`🎬 Bạn đã chọn suất chiếu: ${timeVal} (${formatVal}) tại Galaxy CineX - Hanoi Centre!`, 'success');
    });
  });

})();