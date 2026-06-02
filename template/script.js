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

  // Handle all dynamically added trailer buttons on movie cards
  document.addEventListener('click', (e) => {
    const trailerBtn = e.target.closest('.trailer-btn');
    if (trailerBtn) {
      e.preventDefault();
      e.stopPropagation();
      // Optional: const movieId = trailerBtn.dataset.movieId;
      // In a real app, you would load the video source based on movieId here
      openModal();
    }
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
     4. QUICK BOOKING — DYNAMIC CASCADE BOOKING SYSTEM
  ---------------------------------------------------------- */

  const bookMovie = document.getElementById('bookMovie');
  const bookCinema = document.getElementById('bookCinema');
  const bookDate = document.getElementById('bookDate');
  const bookTime = document.getElementById('bookTime');
  const quickBookBtn = document.getElementById('quickBookBtn');

  const bookingDb = {
    movies: [
      { id: "movie_1", title: "Người Nhện: Phần 2", status: "now-showing" },
      { id: "movie_2", title: "Godzilla x Kong", status: "now-showing" },
      { id: "movie_3", title: "Ghostbusters: Frozen Empire", status: "now-showing" },
      { id: "movie_4", title: "Civil War", status: "now-showing" },
      { id: "movie_5", title: "Furiosa", status: "now-showing" },
      { id: "movie_6", title: "Inside Out 2", status: "now-showing" },
      { id: "movie_7", title: "Deadpool & Wolverine", status: "coming-soon" },
      { id: "movie_8", title: "Alien: Romulus", status: "coming-soon" }
    ],
    cinemas: [
      { id: "cinema_1", name: "CINE Landmark — Quận 1" },
      { id: "cinema_2", name: "CINE Crescent — Quận 7" },
      { id: "cinema_3", name: "CINE Aeon — Bình Dương" },
      { id: "cinema_4", name: "CINE Vincom — Quận 3" }
    ],
    dates: [
      { id: "date_1", label: "Hôm nay — 27/05" },
      { id: "date_2", label: "Ngày mai — 28/05" },
      { id: "date_3", label: "Thứ Năm — 29/05" },
      { id: "date_4", label: "Thứ Sáu — 30/05" }
    ],
    times: {
      "movie_1": ["10:15", "13:30", "16:45", "19:00", "21:30"],
      "movie_2": ["09:00", "11:45", "14:30", "17:15", "20:00", "22:45"],
      "movie_3": ["10:00", "12:30", "15:00", "18:30", "21:00"],
      "movie_4": ["11:00", "13:45", "16:30", "19:15", "22:00"],
      "movie_5": ["08:30", "11:00", "14:15", "17:00", "19:45", "22:30"],
      "movie_6": ["09:30", "12:00", "14:30", "17:00", "19:30", "21:45"]
    }
  };

  function initQuickBookingCascade() {
    if (!bookMovie || !bookCinema || !bookDate || !bookTime || !quickBookBtn) return;

    // Helper to populate a select
    const populateSelect = (selectEl, defaultText, items = [], isTime = false) => {
      selectEl.innerHTML = `<option value="">${defaultText}</option>`;
      items.forEach(item => {
        const option = document.createElement('option');
        if (isTime) {
          option.value = item;
          option.textContent = item;
        } else {
          option.value = item.id;
          option.textContent = item.title || item.name || item.label;
        }
        selectEl.appendChild(option);
      });
    };

    // Helper to update visual cascade classes on booking fields (Issue 1 & 2)
    const updateFieldVisualStates = () => {
      const fields = [
        { select: bookMovie, field: bookMovie.closest('.booking-field') },
        { select: bookCinema, field: bookCinema.closest('.booking-field') },
        { select: bookDate, field: bookDate.closest('.booking-field') },
        { select: bookTime, field: bookTime.closest('.booking-field') }
      ];

      fields.forEach(({ select, field }) => {
        if (!field) return;
        
        // Clear all state classes
        field.classList.remove('is-active', 'is-disabled', 'is-selected');
        
        if (select.disabled) {
          field.classList.add('is-disabled');
        } else if (select.value) {
          field.classList.add('is-selected');
        } else {
          field.classList.add('is-active');
        }
      });
    };

    // Helper to update button state
    const updateSubmitButtonState = () => {
      const isComplete = bookMovie.value && bookCinema.value && bookDate.value && bookTime.value;
      quickBookBtn.disabled = !isComplete;
      updateFieldVisualStates();
    };

    // 1. Initial State - filter only now-showing movies (Issue 5)
    const nowShowingMovies = bookingDb.movies.filter(m => m.status === 'now-showing');
    populateSelect(bookMovie, "Chọn phim", nowShowingMovies);
    populateSelect(bookCinema, "Chọn rạp");
    populateSelect(bookDate, "Chọn ngày");
    populateSelect(bookTime, "Chọn giờ");
    
    bookCinema.disabled = true;
    bookDate.disabled = true;
    bookTime.disabled = true;
    updateSubmitButtonState();

    // 2. Cascade Events
    // Movie Select Changed
    bookMovie.addEventListener('change', () => {
      const movieId = bookMovie.value;
      
      // Clear fields
      populateSelect(bookCinema, "Chọn rạp");
      populateSelect(bookDate, "Chọn ngày");
      populateSelect(bookTime, "Chọn giờ");
      
      if (movieId) {
        populateSelect(bookCinema, "Chọn rạp", bookingDb.cinemas);
        bookCinema.disabled = false;
      } else {
        bookCinema.disabled = true;
      }
      
      bookDate.disabled = true;
      bookTime.disabled = true;
      updateSubmitButtonState();
    });

    // Cinema Select Changed
    bookCinema.addEventListener('change', () => {
      const cinemaId = bookCinema.value;
      
      // Clear fields
      populateSelect(bookDate, "Chọn ngày");
      populateSelect(bookTime, "Chọn giờ");
      
      if (cinemaId) {
        populateSelect(bookDate, "Chọn ngày", bookingDb.dates);
        bookDate.disabled = false;
      } else {
        bookDate.disabled = true;
      }
      
      bookTime.disabled = true;
      updateSubmitButtonState();
    });

    // Date Select Changed
    bookDate.addEventListener('change', () => {
      const dateId = bookDate.value;
      const movieId = bookMovie.value;
      
      // Clear fields
      populateSelect(bookTime, "Chọn giờ");
      
      if (dateId && movieId) {
        const times = bookingDb.times[movieId] || [];
        populateSelect(bookTime, "Chọn giờ", times, true);
        bookTime.disabled = false;
      } else {
        bookTime.disabled = true;
      }
      
      updateSubmitButtonState();
    });

    // Time Select Changed
    bookTime.addEventListener('change', () => {
      updateSubmitButtonState();
    });

    // Submit Action
    quickBookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const movieText = bookMovie.options[bookMovie.selectedIndex]?.textContent;
      const cinemaText = bookCinema.options[bookCinema.selectedIndex]?.textContent;
      const dateText = bookDate.options[bookDate.selectedIndex]?.textContent;
      const timeText = bookTime.value;

      if (!bookMovie.value || !bookCinema.value || !bookDate.value || !bookTime.value) {
        showToast('Vui lòng chọn đầy đủ thông tin để đặt vé.', 'warning');
        return;
      }

      showToast(
        `🎬 Đặt vé thành công!\n${movieText}\n${cinemaText}\n${dateText} · Suất ${timeText}`,
        'success'
      );
    });
  }

  // Initialize booking cascade
  initQuickBookingCascade();

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

    toast.textContent = message;

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

  // Date Tabs selection & Horizontal Slider initialization
  function initDateSlider() {
    const dateSlider = document.querySelector('.date-slider');
    const prevBtn = document.querySelector('.date-nav.prev');
    const nextBtn = document.querySelector('.date-nav.next');

    if (!dateSlider) return;

    // Generate 7 days (today + next 6 days) dynamically
    const today = new Date();
    const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

    dateSlider.innerHTML = '';

    for (let i = 0; i < 7; i++) {
      const current = new Date();
      current.setDate(today.getDate() + i);

      const day = String(current.getDate()).padStart(2, '0');
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const formattedDate = `${day}/${month}`;
      
      let dayLabel = '';
      if (i === 0) {
        dayLabel = 'Hôm nay';
      } else {
        dayLabel = weekdays[current.getDay()];
      }

      const tab = document.createElement('button');
      tab.className = i === 0 ? 'date-tab active' : 'date-tab';
      tab.dataset.date = `${current.getFullYear()}-${month}-${day}`;
      tab.innerHTML = `
        <span>${dayLabel}</span>
        <strong>${formattedDate}</strong>
      `;

      tab.addEventListener('click', function () {
        document.querySelectorAll('.date-tab').forEach((t) => t.classList.remove('active'));
        this.classList.add('active');
        showToast(`Đã hiển thị lịch chiếu cho ngày ${dayLabel} ${formattedDate}`, 'success');
      });

      dateSlider.appendChild(tab);
    }

    // Scroll buttons logic
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        dateSlider.scrollBy({ left: -240, behavior: 'smooth' });
      });
      nextBtn.addEventListener('click', () => {
        dateSlider.scrollBy({ left: 240, behavior: 'smooth' });
      });
    }
  }

  // Initialize date slider on load
  initDateSlider();

  // Showtime selection
  const timeBtns = document.querySelectorAll('.time-btn');
  timeBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      if (
        this.disabled ||
        this.classList.contains('is-sold-out') ||
        this.classList.contains('is-past') ||
        this.classList.contains('is-locked')
      ) {
        return;
      }

      timeBtns.forEach((b) => b.classList.remove('selected'));
      this.classList.add('selected');
      
      // Get only the main time digits inside span
      const timeSpan = this.querySelector('span');
      const timeVal = timeSpan ? timeSpan.textContent : this.textContent.trim();
      
      // Inject 'Tiếp tục chọn ghế' CTA if not exists
      let nextStepCta = document.getElementById('nextStepCtaWrap');
      if (!nextStepCta) {
        const scheduleBox = this.closest('.cinema-schedule-box');
        if (scheduleBox) {
          nextStepCta = document.createElement('div');
          nextStepCta.id = 'nextStepCtaWrap';
          nextStepCta.className = 'showtime-next-step';
          scheduleBox.appendChild(nextStepCta);
        }
      }
      
      if (nextStepCta) {
        // Read mock schedule ID if exists, else fallback
        const scheduleId = this.dataset.scheduleId || Math.floor(Math.random() * 1000);
        nextStepCta.innerHTML = `<button class="btn-primary btn-large" onclick="window.location.href='seat-selection.html?scheduleId=${scheduleId}'">Tiếp tục chọn ghế (${timeVal})</button>`;
      }
    });
  });

  // Search Modal Logic
  const searchIcons = document.querySelectorAll('.nav-actions .lucide-search');
  const searchModal = document.getElementById('searchModal');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  const openSearch = () => {
    if (!searchModal) return;
    searchModal.classList.add('active');
    setTimeout(() => searchInput.focus(), 100);
  };

  const closeSearch = () => {
    if (!searchModal) return;
    searchModal.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
  };

  // Attach search open event
  searchIcons.forEach(icon => icon.parentElement.addEventListener('click', (e) => {
    e.preventDefault();
    openSearch();
  }));

  if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', closeSearch);
  }

  // Close on ESC or Outside click
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
  });
  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearch();
    });
  }

  // Debounce search input
  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim().toLowerCase();
      
      if (!query) {
        searchResults.innerHTML = '';
        return;
      }
      
      searchTimeout = setTimeout(() => {
        // Basic mock search
        const mockDb = [
          'Người Nhện: Phần 2', 'Godzilla x Kong', 'Ghostbusters: Frozen Empire',
          'Civil War', 'Furiosa', 'Inside Out 2', 'Deadpool & Wolverine', 'Alien: Romulus'
        ];
        
        const results = mockDb.filter(title => title.toLowerCase().includes(query));
        
        if (results.length > 0) {
          const html = results.map(r => `<div style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer;" onclick="window.location.href='movie-detail.html'">${r}</div>`).join('');
          searchResults.innerHTML = `<div style="font-size: 14px; margin-bottom: 10px; color: rgba(255,255,255,0.6)">Kết quả phim: <span style="font-size: 12px; margin-left: 10px;">(Ghi chú: Sẽ cập nhật tìm rạp ở phase sau)</span></div>` + html;
        } else {
          searchResults.innerHTML = `<div class="search-empty">Không tìm thấy phim phù hợp.</div>`;
        }
      }, 300);
    });
  }

})();
