/* ============================================================
   CINE Component — Theme Selector (Segmented Button)
   assets/js/components/theme-selector.js
   ============================================================ */

(function() {
  // 1. Immediately apply theme to avoid flashing
  const savedTheme = localStorage.getItem('cine-theme') || 'system';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    let resolvedTheme = theme;
    if (theme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentTheme = localStorage.getItem('cine-theme') || 'system';
    if (currentTheme === 'system') {
      applyTheme('system');
    }
  });

  // 2. Inject and initialize Segmented Button in Navbar on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    const navActionsList = document.querySelectorAll('.nav-actions');

    navActionsList.forEach((navActions) => {
      // Create theme selector container
      const container = document.createElement('div');
      container.className = 'theme-selector-container';

      // Slider backdrop
      const slider = document.createElement('div');
      slider.className = 'theme-selector-slider';
      container.appendChild(slider);

      // Theme options
      const options = [
        { val: 'light', icon: '☀️', title: 'Chế độ sáng' },
        { val: 'dark', icon: '🌙', title: 'Chế độ tối' },
        { val: 'system', icon: '🖥️', title: 'Hệ thống' }
      ];

      options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'theme-tab-btn';
        btn.setAttribute('data-theme-val', opt.val);
        btn.setAttribute('title', opt.title);
        btn.textContent = opt.icon;

        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          setTheme(opt.val);
        });

        container.appendChild(btn);
      });

      // Inject selector into navbar before "Đăng nhập" (Temporarily hidden per user request)
      /*
      const loginBtn = navActions.querySelector('.nav-login');
      if (loginBtn) {
        navActions.insertBefore(container, loginBtn);
      } else {
        navActions.appendChild(container);
      }
      */

      function setTheme(themeVal) {
        localStorage.setItem('cine-theme', themeVal);
        applyTheme(themeVal);

        // Update UI states inside this selector
        const buttons = container.querySelectorAll('.theme-tab-btn');
        buttons.forEach((btn, idx) => {
          if (btn.getAttribute('data-theme-val') === themeVal) {
            btn.classList.add('active');
            container.setAttribute('data-active-index', idx);
          } else {
            btn.classList.remove('active');
          }
        });
      }

      // Initial active state set for this navbar's selector
      const activeTheme = localStorage.getItem('cine-theme') || 'system';
      setTheme(activeTheme);
    });
  });
})();
