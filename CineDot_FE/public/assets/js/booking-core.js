/* booking-core.js - Handles Mock Data & Booking Logic */

const MOCK_DATA = {
  movies: [
    { id: 1, title: 'Người Nhện: Phần 2' },
    { id: 2, title: 'Godzilla x Kong' },
    { id: 3, title: 'Ghostbusters: Frozen Empire' },
    { id: 4, title: 'Civil War' },
    { id: 5, title: 'Furiosa' },
    { id: 6, title: 'Inside Out 2' }
  ],
  cinemas: [
    { id: 101, name: 'CINE Landmark — Quận 1', movieIds: [1, 2, 3, 5] },
    { id: 102, name: 'CINE Crescent — Quận 7', movieIds: [1, 2, 4, 6] },
    { id: 103, name: 'CINE Aeon — Bình Dương', movieIds: [2, 3, 4, 5, 6] },
    { id: 104, name: 'CINE Vincom — Quận 3', movieIds: [1, 3, 5, 6] }
  ],
  dates: [
    { id: '2024-05-17', label: 'Hôm nay — 17/05' },
    { id: '2024-05-18', label: 'Ngày mai — 18/05' },
    { id: '2024-05-19', label: 'Chủ Nhật — 19/05' }
  ],
  showtimes: [
    // Movie 1, Cinema 101, Date 17/05
    { scheduleId: 1001, movieId: 1, cinemaId: 101, dateId: '2024-05-17', time: '10:15', format: 'IMAX', language: 'Phụ đề', status: 'available' },
    { scheduleId: 1002, movieId: 1, cinemaId: 101, dateId: '2024-05-17', time: '13:30', format: '2D', language: 'Phụ đề', status: 'almost-full' },
    { scheduleId: 1003, movieId: 1, cinemaId: 101, dateId: '2024-05-17', time: '19:00', format: 'IMAX', language: 'Phụ đề', status: 'sold-out' },
    
    // Movie 2, Cinema 102, Date 18/05
    { scheduleId: 2001, movieId: 2, cinemaId: 102, dateId: '2024-05-18', time: '14:00', format: '4DX', language: 'Lồng tiếng', status: 'available' },
    { scheduleId: 2002, movieId: 2, cinemaId: 102, dateId: '2024-05-18', time: '20:30', format: 'IMAX', language: 'Phụ đề', status: 'available' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const state = {
    movieId: '',
    cinemaId: '',
    dateId: '',
    scheduleId: ''
  };

  const elMovie = document.getElementById('bookMovie');
  const elCinema = document.getElementById('bookCinema');
  const elDate = document.getElementById('bookDate');
  const elTime = document.getElementById('bookTime');
  const elBtn = document.getElementById('quickBookBtn');
  
  if (!elMovie || !elCinema || !elDate || !elTime || !elBtn) return;

  // Add helper msg container
  const strip = document.querySelector('.booking-strip');
  let helperMsg = document.getElementById('bookingHelper');
  if (!helperMsg && strip) {
    helperMsg = document.createElement('div');
    helperMsg.id = 'bookingHelper';
    helperMsg.className = 'booking-helper-msg';
    strip.insertBefore(helperMsg, strip.firstChild);
  }

  const updateHelper = (msg, type = 'info') => {
    if (!helperMsg) return;
    helperMsg.textContent = msg;
    helperMsg.className = `booking-helper-msg ${type}`;
    if (msg === '') helperMsg.style.display = 'none';
    else helperMsg.style.display = 'block';
  };

  const renderOptions = (selectEl, defaultText, options) => {
    selectEl.innerHTML = `<option value="">${defaultText}</option>`;
    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      if (opt.disabled) option.disabled = true;
      selectEl.appendChild(option);
    });
  };

  // Init
  const initBookingPanel = () => {
    renderOptions(elMovie, 'Chọn phim', MOCK_DATA.movies.map(m => ({ value: m.id, label: m.title })));
    resetCinema();
    updateHelper('Vui lòng chọn phim trước', 'info');
    validateBooking();
  };

  const resetCinema = () => {
    state.cinemaId = '';
    elCinema.disabled = true;
    renderOptions(elCinema, 'Chọn rạp', []);
    resetDate();
  };

  const resetDate = () => {
    state.dateId = '';
    elDate.disabled = true;
    renderOptions(elDate, 'Chọn ngày', []);
    resetTime();
  };

  const resetTime = () => {
    state.scheduleId = '';
    elTime.disabled = true;
    renderOptions(elTime, 'Chọn giờ', []);
    validateBooking();
  };

  const validateBooking = () => {
    if (state.movieId && state.cinemaId && state.dateId && state.scheduleId) {
      elBtn.disabled = false;
      elBtn.classList.remove('disabled');
      updateHelper('', 'success'); // Hide msg
    } else {
      elBtn.disabled = true;
      elBtn.classList.add('disabled');
    }
  };

  // Listeners
  elMovie.addEventListener('change', (e) => {
    state.movieId = e.target.value;
    if (!state.movieId) {
      resetCinema();
      updateHelper('Vui lòng chọn phim trước', 'info');
      return;
    }
    
    // Filter cinemas
    const availableCinemas = MOCK_DATA.cinemas.filter(c => c.movieIds.includes(parseInt(state.movieId)));
    if (availableCinemas.length === 0) {
      resetCinema();
      updateHelper('Rạp chưa có lịch chiếu cho phim đã chọn', 'error');
    } else {
      elCinema.disabled = false;
      renderOptions(elCinema, 'Chọn rạp', availableCinemas.map(c => ({ value: c.id, label: c.name })));
      resetDate();
      updateHelper('Chọn rạp để xem ngày chiếu', 'info');
    }
  });

  elCinema.addEventListener('change', (e) => {
    state.cinemaId = e.target.value;
    if (!state.cinemaId) {
      resetDate();
      updateHelper('Chọn rạp để xem ngày chiếu', 'info');
      return;
    }

    // Filter dates (mock: all dates available if cinema selected, normally filter by showtimes)
    const availableShowtimes = MOCK_DATA.showtimes.filter(s => s.movieId == state.movieId && s.cinemaId == state.cinemaId);
    
    if (availableShowtimes.length === 0) {
      resetDate();
      updateHelper('Rạp này chưa có lịch chiếu cho phim đã chọn', 'error');
    } else {
      const dateSet = new Set(availableShowtimes.map(s => s.dateId));
      const validDates = MOCK_DATA.dates.filter(d => dateSet.has(d.id));
      
      elDate.disabled = false;
      renderOptions(elDate, 'Chọn ngày', validDates.map(d => ({ value: d.id, label: d.label })));
      resetTime();
      updateHelper('Chọn ngày để xem suất chiếu', 'info');
    }
  });

  elDate.addEventListener('change', (e) => {
    state.dateId = e.target.value;
    if (!state.dateId) {
      resetTime();
      updateHelper('Chọn ngày để xem suất chiếu', 'info');
      return;
    }

    const availableShowtimes = MOCK_DATA.showtimes.filter(
      s => s.movieId == state.movieId && s.cinemaId == state.cinemaId && s.dateId == state.dateId
    );

    if (availableShowtimes.length === 0) {
      resetTime();
      updateHelper('Ngày này chưa có suất chiếu', 'error');
    } else {
      elTime.disabled = false;
      const timeOptions = availableShowtimes.map(s => {
        let label = `${s.time} (${s.format})`;
        let disabled = s.status === 'sold-out';
        if (s.status === 'almost-full') label += ' - Gần hết';
        if (s.status === 'sold-out') label += ' - Hết vé';
        return { value: s.scheduleId, label, disabled };
      });
      renderOptions(elTime, 'Chọn giờ', timeOptions);
      updateHelper('Vui lòng chọn suất chiếu', 'info');
    }
  });

  elTime.addEventListener('change', (e) => {
    state.scheduleId = e.target.value;
    if (!state.scheduleId) {
      updateHelper('Vui lòng chọn suất chiếu', 'info');
    } else {
      const st = MOCK_DATA.showtimes.find(s => s.scheduleId == state.scheduleId);
      if (st && st.status === 'sold-out') {
        updateHelper('Suất chiếu đã hết vé', 'error');
        state.scheduleId = '';
        elTime.value = '';
      } else {
        updateHelper('Đã chọn đầy đủ thông tin', 'success');
      }
    }
    validateBooking();
  });

  elBtn.addEventListener('click', () => {
    if (!elBtn.disabled && state.scheduleId) {
      // Chuyển hướng
      window.location.href = `seat-selection.html?scheduleId=${state.scheduleId}`;
    }
  });

  initBookingPanel();
});
