/* ============================================================
   CINE Component — Cinematic Video Player
   assets/js/components/video-player.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const players = document.querySelectorAll('.cine-video-player');

  players.forEach((player) => {
    const src = player.getAttribute('data-src') || '';
    const poster = player.getAttribute('data-poster') || '';
    const title = player.getAttribute('data-title') || 'CINE Trailer';

    // 1. Generate the inner HTML content dynamically for clean integration
    player.innerHTML = `
      <!-- Spinner -->
      <div class="cine-video-spinner">
        <div class="cine-spinner-icon"></div>
      </div>

      <!-- Poster / Center Play Overlay -->
      <div class="cine-poster-overlay" style="background-image: url('${poster}');">
        <button class="cine-center-play-btn" aria-label="Play">
          <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg>
        </button>
      </div>

      <!-- Video Element -->
      <video class="cine-video-element" src="${src}" playsinline></video>

      <!-- Controls Overlay -->
      <div class="cine-controls-overlay"></div>

      <!-- Controls Bar -->
      <div class="cine-controls-bar">
        <!-- Progress Bar -->
        <div class="cine-progress-area" role="slider" aria-label="Timeline">
          <div class="cine-progress-buffered"></div>
          <div class="cine-progress-fill"></div>
          <div class="cine-progress-scrubber"></div>
        </div>

        <!-- Controls Row -->
        <div class="cine-controls-row">
          <!-- Left Controls -->
          <div class="cine-controls-left">
            <!-- Play/Pause -->
            <button class="cine-control-btn cine-play-btn" aria-label="Play">
              <svg viewBox="0 0 24 24" class="play-icon"><polygon points="5,3 19,12 5,21" /></svg>
              <svg viewBox="0 0 24 24" class="pause-icon" style="display:none;"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            </button>

            <!-- Skip Back 10s -->
            <button class="cine-control-btn cine-rewind-btn" aria-label="Rewind 10s">
              <svg viewBox="0 0 24 24" class="stroke-only">
                <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0-.57-8.38l.41.81"/>
              </svg>
            </button>

            <!-- Skip Forward 10s -->
            <button class="cine-control-btn cine-forward-btn" aria-label="Forward 10s">
              <svg viewBox="0 0 24 24" class="stroke-only">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1 .57-8.38l-.41.81"/>
              </svg>
            </button>

            <!-- Volume Control -->
            <div class="cine-volume-container">
              <button class="cine-control-btn cine-mute-btn" aria-label="Mute">
                <svg viewBox="0 0 24 24" class="volume-up-icon"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                <svg viewBox="0 0 24 24" class="volume-mute-icon" style="display:none;"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
              </button>
              <input type="range" class="cine-volume-slider" min="0" max="1" step="0.05" value="1" aria-label="Volume">
            </div>

            <!-- Time Display -->
            <span class="cine-time-display">0:00 / 0:00</span>
          </div>

          <!-- Right Controls -->
          <div class="cine-controls-right">
            <!-- Fullscreen -->
            <button class="cine-control-btn cine-fullscreen-btn" aria-label="Fullscreen">
              <svg viewBox="0 0 24 24" class="stroke-only expand-icon">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
              <svg viewBox="0 0 24 24" class="stroke-only shrink-icon" style="display:none;">
                <path d="M4 14h6v6m10-6h-6v6M4 10h6V4m10 6h-6V4"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    // 2. Query element references inside the newly constructed player
    const video = player.querySelector('.cine-video-element');
    const posterOverlay = player.querySelector('.cine-poster-overlay');
    const centerPlayBtn = player.querySelector('.cine-center-play-btn');
    const playBtn = player.querySelector('.cine-play-btn');
    const playIcon = playBtn.querySelector('.play-icon');
    const pauseIcon = playBtn.querySelector('.pause-icon');
    const rewindBtn = player.querySelector('.cine-rewind-btn');
    const forwardBtn = player.querySelector('.cine-forward-btn');
    const muteBtn = player.querySelector('.cine-mute-btn');
    const volumeUpIcon = muteBtn.querySelector('.volume-up-icon');
    const volumeMuteIcon = muteBtn.querySelector('.volume-mute-icon');
    const volumeSlider = player.querySelector('.cine-volume-slider');
    const timeDisplay = player.querySelector('.cine-time-display');
    const fullscreenBtn = player.querySelector('.cine-fullscreen-btn');
    const expandIcon = fullscreenBtn.querySelector('.expand-icon');
    const shrinkIcon = fullscreenBtn.querySelector('.shrink-icon');
    const progressArea = player.querySelector('.cine-progress-area');
    const progressFill = player.querySelector('.cine-progress-fill');
    const progressScrubber = player.querySelector('.cine-progress-scrubber');
    const progressBuffered = player.querySelector('.cine-progress-buffered');

    let controlsTimeout = null;

    // Helper to format time strings
    const formatTime = (time) => {
      if (isNaN(time) || time === Infinity) return '0:00';
      const mins = Math.floor(time / 60);
      const secs = Math.floor(time % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Toggle Play/Pause state
    const togglePlay = () => {
      if (video.paused) {
        video.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        posterOverlay.classList.add('is-hidden');
      } else {
        video.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }
    };

    // Center Play Button & Poster click
    centerPlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });

    posterOverlay.addEventListener('click', togglePlay);
    playBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    // Mute / Unmute
    const toggleMute = () => {
      video.muted = !video.muted;
      if (video.muted) {
        volumeUpIcon.style.display = 'none';
        volumeMuteIcon.style.display = 'block';
        volumeSlider.value = 0;
      } else {
        volumeUpIcon.style.display = 'block';
        volumeMuteIcon.style.display = 'none';
        volumeSlider.value = video.volume;
      }
    };

    muteBtn.addEventListener('click', toggleMute);

    // Volume Slider changes
    volumeSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      video.volume = vol;
      if (vol === 0) {
        video.muted = true;
        volumeUpIcon.style.display = 'none';
        volumeMuteIcon.style.display = 'block';
      } else {
        video.muted = false;
        volumeUpIcon.style.display = 'block';
        volumeMuteIcon.style.display = 'none';
      }
    });

    // Skip Back / Skip Forward
    rewindBtn.addEventListener('click', () => {
      video.currentTime = Math.max(0, video.currentTime - 10);
    });

    forwardBtn.addEventListener('click', () => {
      video.currentTime = Math.min(video.duration, video.currentTime + 10);
    });

    // Fullscreen toggling
    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        if (player.requestFullscreen) {
          player.requestFullscreen();
        }
        expandIcon.style.display = 'none';
        shrinkIcon.style.display = 'block';
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
        expandIcon.style.display = 'block';
        shrinkIcon.style.display = 'none';
      }
    };

    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Timeline updates
    video.addEventListener('timeupdate', () => {
      const current = video.currentTime;
      const duration = video.duration;

      if (!isNaN(duration)) {
        const percent = (current / duration) * 100;
        progressFill.style.width = `${percent}%`;
        progressScrubber.style.left = `${percent}%`;
        timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
      }
    });

    // Buffered logic
    video.addEventListener('progress', () => {
      if (video.buffered.length > 0 && video.duration) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const percent = (bufferedEnd / video.duration) * 100;
        progressBuffered.style.width = `${percent}%`;
      }
    });

    // Duration load display
    video.addEventListener('loadedmetadata', () => {
      timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
      player.classList.remove('is-loading');
    });

    video.addEventListener('waiting', () => {
      player.classList.add('is-loading');
    });

    video.addEventListener('playing', () => {
      player.classList.remove('is-loading');
    });

    // Seek inside timeline clicking
    progressArea.addEventListener('click', (e) => {
      const rect = progressArea.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      video.currentTime = pos * video.duration;
    });

    // Timeline drag-seeking implementation
    let isDragging = false;
    progressArea.addEventListener('mousedown', () => { isDragging = true; });
    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('mousemove', (e) => {
      if (isDragging && video.duration) {
        const rect = progressArea.getBoundingClientRect();
        let pos = (e.clientX - rect.left) / rect.width;
        pos = Math.max(0, Math.min(1, pos));
        video.currentTime = pos * video.duration;
      }
    });

    // Controls display hiding on timeout
    const triggerControls = () => {
      player.classList.add('show-controls');
      clearTimeout(controlsTimeout);

      if (!video.paused) {
        controlsTimeout = setTimeout(() => {
          player.classList.remove('show-controls');
        }, 3000);
      }
    };

    player.addEventListener('mousemove', triggerControls);
    player.addEventListener('click', triggerControls);
    video.addEventListener('play', triggerControls);
    video.addEventListener('pause', triggerControls);

    // Initial trigger
    triggerControls();
  });
});
