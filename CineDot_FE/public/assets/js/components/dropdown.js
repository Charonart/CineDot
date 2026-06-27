/* ============================================================
   CINE — Premium Dropdown Component System
   assets/js/components/dropdown.js
   ============================================================ */

(function () {
  'use strict';

  class CineDropdown {
    /**
     * @param {HTMLSelectElement} selectEl - The native select element to upgrade
     * @param {Object} options - Configuration overrides
     */
    constructor(selectEl, options = {}) {
      if (!selectEl || selectEl.tagName !== 'SELECT') {
        console.error('CineDropdown requires a native <select> element.', selectEl);
        return;
      }

      this.selectEl = selectEl;
      
      // Configuration values
      this.options = {
        label: options.label || selectEl.getAttribute('data-label') || '',
        placeholder: options.placeholder || selectEl.getAttribute('placeholder') || 'Chọn',
        searchable: options.searchable !== undefined ? options.searchable : (
          selectEl.getAttribute('data-searchable') === 'true' || 
          (selectEl.hasAttribute('data-searchable') && selectEl.getAttribute('data-searchable') !== 'false') || 
          (selectEl.options.length > 8 && selectEl.getAttribute('data-searchable') !== 'false')
        ),
        onChange: options.onChange || null,
        error: options.error || selectEl.getAttribute('data-error') || null,
        ...options
      };

      this.isOpen = false;
      this.highlightedIndex = -1;
      this.items = [];

      this._init();
    }

    /**
     * Build DOM structures and bind listeners
     */
    _init() {
      // 1. Hide the native select cleanly
      this.selectEl.classList.add('cine-dropdown-select-native');

      // 2. Create the custom wrapper
      this.wrapper = document.createElement('div');
      this.wrapper.className = 'cine-dropdown';
      if (this.selectEl.disabled) {
        this.wrapper.classList.add('is-disabled');
      }
      if (this.options.error) {
        this.wrapper.classList.add('has-error');
      }

      // Copy class name from select if present
      if (this.selectEl.className && this.selectEl.className !== 'cine-dropdown-select-native') {
        const classes = this.selectEl.className.split(' ').filter(c => c && c !== 'cine-dropdown-select-native');
        classes.forEach(c => this.wrapper.classList.add(c));
      }

      // 3. Build trigger button
      this.trigger = document.createElement('button');
      this.trigger.type = 'button';
      this.trigger.className = 'cine-dropdown-trigger';
      this.trigger.setAttribute('aria-haspopup', 'listbox');
      this.trigger.setAttribute('aria-expanded', 'false');
      if (this.selectEl.disabled) {
        this.trigger.disabled = true;
      }

      // If a label is specified, add it
      if (this.options.label) {
        const labelSpan = document.createElement('span');
        labelSpan.className = 'cine-dropdown-label';
        labelSpan.textContent = this.options.label;
        this.trigger.appendChild(labelSpan);
      }

      // Selected value / placeholder text area
      this.valueSpan = document.createElement('span');
      this.valueSpan.className = 'cine-dropdown-value';
      this.trigger.appendChild(this.valueSpan);

      // Caret icon
      const chevron = document.createElement('span');
      chevron.className = 'cine-dropdown-chevron';
      chevron.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      `;
      this.trigger.appendChild(chevron);

      this.wrapper.appendChild(this.trigger);

      // 4. Build dropdown menu list
      this.menu = document.createElement('div');
      this.menu.className = 'cine-dropdown-menu';
      this.menu.setAttribute('role', 'listbox');
      if (this.selectEl.hasAttribute('data-type')) {
        this.menu.setAttribute('data-type', this.selectEl.getAttribute('data-type'));
      } else if (this.selectEl.id === 'bookMovie') {
        this.menu.setAttribute('data-type', 'movie');
      }
      
      // Build search input if searchable
      if (this.options.searchable) {
        this._buildSearch();
      }

      // Items list container
      this.listContainer = document.createElement('div');
      this.listContainer.className = 'cine-dropdown-list';
      this.menu.appendChild(this.listContainer);

      // Empty result notice
      this.emptyNotice = document.createElement('div');
      this.emptyNotice.className = 'cine-dropdown-empty';
      this.emptyNotice.textContent = 'Không tìm thấy kết quả phù hợp';
      this.menu.appendChild(this.emptyNotice);

      this.wrapper.appendChild(this.menu);

      // If there is an error message, build it
      if (this.options.error) {
        this.errorSpan = document.createElement('span');
        this.errorSpan.className = 'cine-dropdown-error-msg';
        this.errorSpan.textContent = this.options.error;
        this.wrapper.appendChild(this.errorSpan);
      }

      // Insert custom component in DOM next to the native select
      this.selectEl.parentNode.insertBefore(this.wrapper, this.selectEl.nextSibling);

      // 5. Populate options list
      this.refreshOptions();

      // 6. Register core event listeners
      this._bindEvents();

      // 7. Watch for native select mutations (syncing disabled status & dynamic options)
      this._setupObserver();
    }

    /**
     * Build searchable input header
     */
    _buildSearch() {
      const searchWrap = document.createElement('div');
      searchWrap.className = 'cine-dropdown-search-wrap';

      this.searchInput = document.createElement('input');
      this.searchInput.type = 'text';
      this.searchInput.className = 'cine-dropdown-search-input';
      this.searchInput.placeholder = 'Tìm kiếm...';
      
      searchWrap.appendChild(this.searchInput);
      this.menu.appendChild(searchWrap);

      // Add filter logic
      this.searchInput.addEventListener('input', () => this.filterOptions(this.searchInput.value));
      this.searchInput.addEventListener('click', (e) => e.stopPropagation());
    }

    /**
     * Re-pull option nodes from the native select element
     */
    refreshOptions() {
      this.listContainer.innerHTML = '';
      this.items = [];
      this.highlightedIndex = -1;

      const options = Array.from(this.selectEl.options);
      let selectedText = '';
      let hasSelection = false;

      options.forEach((opt, idx) => {
        // Skip empty placeholder options if they have no text
        if (idx === 0 && opt.value === '' && !opt.textContent.trim()) {
          return;
        }

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'cine-dropdown-item';
        button.setAttribute('role', 'option');
        button.setAttribute('data-value', opt.value);
        button.setAttribute('data-index', idx);
        
        // Item content
        const textSpan = document.createElement('span');
        textSpan.textContent = opt.textContent;
        button.appendChild(textSpan);

        // Check mark SVG
        const checkIcon = document.createElement('span');
        checkIcon.className = 'cine-dropdown-check-icon';
        checkIcon.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        button.appendChild(checkIcon);

        if (opt.selected) {
          button.classList.add('is-selected');
          button.setAttribute('aria-selected', 'true');
          selectedText = opt.textContent;
          hasSelection = opt.value !== '';
        }

        // Click selection listener
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectOption(opt.value);
          this.close();
          this.trigger.focus();
        });

        this.listContainer.appendChild(button);
        this.items.push({
          element: button,
          value: opt.value,
          text: opt.textContent.toLowerCase(),
          originalIndex: idx
        });
      });

      // Update text in trigger
      if (hasSelection && selectedText) {
        this.valueSpan.textContent = selectedText;
        this.valueSpan.classList.remove('is-placeholder');
      } else {
        this.valueSpan.textContent = this.options.placeholder;
        this.valueSpan.classList.add('is-placeholder');
      }
    }

    /**
     * Handle item filter when searching
     * @param {string} query
     */
    filterOptions(query) {
      const q = query.trim().toLowerCase();
      let matchCount = 0;

      this.items.forEach(item => {
        if (item.text.includes(q)) {
          item.element.style.display = 'flex';
          matchCount++;
        } else {
          item.element.style.display = 'none';
          item.element.classList.remove('is-highlighted');
        }
      });

      // Show empty state if no matches
      if (matchCount === 0) {
        this.emptyNotice.classList.add('is-visible');
      } else {
        this.emptyNotice.classList.remove('is-visible');
      }

      // Reset highlighted index on filter changes
      this.highlightedIndex = -1;
    }

    /**
     * Select a specific value
     * @param {string} value
     */
    selectOption(value) {
      const oldValue = this.selectEl.value;
      this.selectEl.value = value;

      // Update native option selection
      Array.from(this.selectEl.options).forEach(opt => {
        opt.selected = (opt.value === value);
      });

      this.refreshOptions();

      // Trigger change notification if value has updated
      if (oldValue !== value) {
        this.selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        if (this.options.onChange) {
          this.options.onChange(value, this.getSelectedItemData());
        }
      }
    }

    /**
     * Get details of currently active item
     */
    getSelectedItemData() {
      const selectedOpt = this.selectEl.options[this.selectEl.selectedIndex];
      if (!selectedOpt) return null;
      return {
        label: selectedOpt.textContent,
        value: selectedOpt.value,
        scheduleId: selectedOpt.getAttribute('data-schedule-id') || null,
        status: selectedOpt.getAttribute('data-status') || 'available',
        format: selectedOpt.getAttribute('data-format') || null
      };
    }

    /**
     * Toggle dropdown visibility
     */
    toggle() {
      if (this.selectEl.disabled) return;
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }
    /**
     * Dynamically update opening direction (upward/downward) based on available viewport space
     */
    updateDirection() {
      if (!this.isOpen) return;

      const triggerRect = this.trigger.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      // Ensure menu height is evaluated correctly (include search wrapper and list height)
      const preferredHeight = Math.min(this.menu.scrollHeight || 300, 420);

      this.wrapper.classList.remove('is-open-up', 'is-open-down');

      if (spaceBelow >= preferredHeight || spaceBelow >= spaceAbove) {
        this.wrapper.classList.add('is-open-down');
        this.menu.style.maxHeight = Math.max(180, spaceBelow - 16) + 'px';
      } else {
        this.wrapper.classList.add('is-open-up');
        this.menu.style.maxHeight = Math.max(180, spaceAbove - 16) + 'px';
      }
    }

    /**
     * Open menu
     */
    open() {
      if (this.isOpen || this.selectEl.disabled) return;

      // Close other open CineDropdowns first
      document.querySelectorAll('.cine-dropdown.is-open').forEach(el => {
        if (el.__cineDropdown) el.__cineDropdown.close();
      });

      this.isOpen = true;
      this.wrapper.classList.add('is-open');
      this.trigger.setAttribute('aria-expanded', 'true');

      // Recalculate direction instantly
      this.updateDirection();

      // Toggle is-open on parent booking-field if present
      const parentField = this.selectEl.closest('.booking-field');
      if (parentField) {
        parentField.classList.add('is-open');
      }

      // Reset search if present
      if (this.options.searchable && this.searchInput) {
        this.searchInput.value = '';
        this.filterOptions('');
        setTimeout(() => this.searchInput.focus(), 50);
      }

      this.highlightedIndex = -1;
      this._highlightItem(this.items.findIndex(item => item.value === this.selectEl.value));
    }

    /**
     * Close menu
     */
    close() {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.wrapper.classList.remove('is-open');
      this.wrapper.classList.remove('is-open-up');
      this.wrapper.classList.remove('is-open-down');
      this.trigger.setAttribute('aria-expanded', 'false');
      this.menu.style.maxHeight = ''; // reset custom height overrides

      // Remove is-open on parent booking-field if present
      const parentField = this.selectEl.closest('.booking-field');
      if (parentField) {
        parentField.classList.remove('is-open');
      }

      // Clear search query
      if (this.options.searchable && this.searchInput) {
        this.searchInput.value = '';
      }
    }

    /**
     * Highlight an item during keyboard navigation
     * @param {number} idx
     */
    _highlightItem(idx) {
      // Remove all highlights first
      this.items.forEach(item => item.element.classList.remove('is-highlighted'));

      const visibleItems = this.items.filter(item => item.element.style.display !== 'none');
      if (visibleItems.length === 0) return;

      if (idx < 0) idx = 0;
      if (idx >= visibleItems.length) idx = visibleItems.length - 1;

      this.highlightedIndex = idx;
      const targetItem = visibleItems[idx];
      targetItem.element.classList.add('is-highlighted');

      // Auto scroll container to keep item in view
      const itemEl = targetItem.element;
      const container = this.menu;
      
      const itemTop = itemEl.offsetTop;
      const itemBottom = itemTop + itemEl.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      if (itemTop < containerTop) {
        container.scrollTop = itemTop;
      } else if (itemBottom > containerBottom) {
        container.scrollTop = itemBottom - container.clientHeight;
      }
    }

    /**
     * Bind trigger click and keyboard controls
     */
    _bindEvents() {
      // Toggle on click
      this.trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });

      // Keyboard support on Trigger button
      this.trigger.addEventListener('keydown', (e) => {
        if (this.selectEl.disabled) return;

        switch (e.key) {
          case 'Enter':
          case ' ':
          case 'ArrowDown':
            e.preventDefault();
            this.open();
            break;
          case 'Escape':
            e.preventDefault();
            this.close();
            break;
        }
      });

      // Keyboard navigation within the Menu
      this.menu.addEventListener('keydown', (e) => {
        if (!this.isOpen) return;

        const visibleItems = this.items.filter(item => item.element.style.display !== 'none');

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            this._highlightItem(this.highlightedIndex + 1);
            break;
          case 'ArrowUp':
            e.preventDefault();
            this._highlightItem(this.highlightedIndex - 1);
            break;
          case 'Enter':
            e.preventDefault();
            if (this.highlightedIndex >= 0 && visibleItems[this.highlightedIndex]) {
              const selectedVal = visibleItems[this.highlightedIndex].value;
              this.selectOption(selectedVal);
              this.close();
              this.trigger.focus();
            }
            break;
          case 'Escape':
          case 'Tab':
            this.close();
            this.trigger.focus();
            break;
        }
      });

      // Bind outside clicks to close the dropdown
      document.addEventListener('click', (e) => {
        if (!this.wrapper.contains(e.target)) {
          this.close();
        }
      });

      // Recalculate direction dynamically on scroll or resize when the dropdown is open
      window.addEventListener('resize', () => {
        if (this.isOpen) this.updateDirection();
      });

      window.addEventListener('scroll', () => {
        if (this.isOpen) this.updateDirection();
      }, { passive: true });
    }

    /**
     * Listen for direct dynamic modifications to the native <select> element
     */
    _setupObserver() {
      this.wrapper.__cineDropdown = this;

      // Monitor attributes (disabled, class) and child modifications (options updated)
      this.observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
            const isDisabled = this.selectEl.disabled;
            this.trigger.disabled = isDisabled;
            if (isDisabled) {
              this.wrapper.classList.add('is-disabled');
              this.close();
            } else {
              this.wrapper.classList.remove('is-disabled');
            }
          }

          if (mutation.type === 'childList') {
            this.refreshOptions();
          }
        });
      });

      this.observer.observe(this.selectEl, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['disabled']
      });
    }

    /**
     * Helper to dynamically update the error state
     * @param {string|null} errorMsg
     */
    setError(errorMsg) {
      this.options.error = errorMsg;
      if (errorMsg) {
        this.wrapper.classList.add('has-error');
        if (!this.errorSpan) {
          this.errorSpan = document.createElement('span');
          this.errorSpan.className = 'cine-dropdown-error-msg';
          this.wrapper.appendChild(this.errorSpan);
        }
        this.errorSpan.textContent = errorMsg;
      } else {
        this.wrapper.classList.remove('has-error');
        if (this.errorSpan) {
          this.errorSpan.remove();
          this.errorSpan = null;
        }
      }
    }

    /**
     * Destroy component cleanly
     */
    destroy() {
      if (this.observer) this.observer.disconnect();
      this.wrapper.remove();
      this.selectEl.classList.remove('cine-dropdown-select-native');
    }
  }

  // Global static method to auto upgrade all marked selects
  CineDropdown.upgradeAll = function (selector = 'select[data-dropdown]') {
    const selects = document.querySelectorAll(selector);
    selects.forEach(select => {
      if (!select.nextSibling || !select.nextSibling.__cineDropdown) {
        new CineDropdown(select);
      }
    });
  };

  // Expose component to the global namespace
  window.CineDropdown = CineDropdown;

  // Auto-upgrade elements on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    CineDropdown.upgradeAll();
  });
})();
