'use strict';

// ============================================================
// NAVIGATION
// ============================================================
const Nav = {
  el:         document.getElementById('nav'),
  hamburger:  document.getElementById('hamburger'),
  navLinks:   document.getElementById('navLinks'),
  overlay:    null,

  init() {
    this._createOverlay();
    this._bindScroll();
    this._bindHamburger();
    this._bindSmoothScroll();
  },

  _createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:190',
      'background:rgba(0,0,0,0.55)', 'opacity:0',
      'pointer-events:none', 'transition:opacity 0.4s ease',
      'backdrop-filter:blur(2px)'
    ].join(';');
    document.body.appendChild(this.overlay);
    this.overlay.addEventListener('click', () => this._close());
  },

  _bindScroll() {
    window.addEventListener('scroll', () => {
      this.el.classList.toggle('is-scrolled', window.scrollY > 60);
    }, { passive: true });
  },

  _bindHamburger() {
    this.hamburger.addEventListener('click', () => {
      const isOpen = this.navLinks.classList.contains('is-open');
      isOpen ? this._close() : this._open();
    });
  },

  _open() {
    this.navLinks.classList.add('is-open');
    this.hamburger.classList.add('is-open');
    this.hamburger.setAttribute('aria-expanded', 'true');
    this.hamburger.setAttribute('aria-label', 'メニューを閉じる');
    this.overlay.style.opacity = '1';
    this.overlay.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
  },

  _close() {
    this.navLinks.classList.remove('is-open');
    this.hamburger.classList.remove('is-open');
    this.hamburger.setAttribute('aria-expanded', 'false');
    this.hamburger.setAttribute('aria-label', 'メニューを開く');
    this.overlay.style.opacity = '0';
    this.overlay.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  },

  _bindSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        this._close();
        const top = target.getBoundingClientRect().top + window.scrollY - this.el.offsetHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }
};

// ============================================================
// PARALLAX — Hero background
// ============================================================
const Parallax = {
  bg:       document.getElementById('heroBg'),
  heroBBox: null,

  init() {
    if (!this.bg) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Only run on non-touch devices where parallax feels natural
    if ('ontouchstart' in window) return;

    this.heroBBox = this.bg.parentElement;
    window.addEventListener('scroll', this._onScroll.bind(this), { passive: true });
  },

  _onScroll() {
    const scrollY = window.scrollY;
    const heroH = this.heroBBox.offsetHeight;
    if (scrollY > heroH) return;
    this.bg.style.transform = `translateY(${scrollY * 0.38}px)`;
  }
};

// ============================================================
// SCROLL REVEAL — Intersection Observer
// ============================================================
const ScrollReveal = {
  init() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -72px 0px',
      threshold:  0.08
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
};

// ============================================================
// RESERVATION FORM — Validation & Submission
// ============================================================
const ReservationForm = {
  form:       document.getElementById('reservationForm'),
  submitBtn:  document.getElementById('submitBtn'),
  successMsg: document.getElementById('formSuccess'),

  rules: {
    name: {
      test:    v => v.trim().length >= 2,
      message: 'お名前は2文字以上で入力してください'
    },
    email: {
      test:    v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
      message: '正しいメールアドレスを入力してください'
    },
    date: {
      test(v) {
        if (!v) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(v) >= today;
      },
      message: '本日以降の日付を選択してください'
    },
    time: {
      test:    v => v !== '',
      message: 'ご来店時間を選択してください'
    },
    guests: {
      test:    v => v !== '',
      message: '人数を選択してください'
    }
  },

  init() {
    if (!this.form) return;
    this._setMinDate();

    this.form.addEventListener('submit', this._onSubmit.bind(this));

    Object.keys(this.rules).forEach(field => {
      const input = document.getElementById(field);
      if (!input) return;
      input.addEventListener('blur',  () => this._validateField(field));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-error')) this._validateField(field);
      });
    });
  },

  _setMinDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
  },

  _validateField(field) {
    const input   = document.getElementById(field);
    const errorEl = document.getElementById(`${field}Error`);
    const rule    = this.rules[field];
    if (!input || !errorEl || !rule) return true;

    const valid = rule.test(input.value);
    input.classList.toggle('is-error', !valid);
    errorEl.textContent = valid ? '' : rule.message;
    return valid;
  },

  _validateAll() {
    return Object.keys(this.rules)
      .map(f => this._validateField(f))
      .every(Boolean);
  },

  async _onSubmit(e) {
    e.preventDefault();
    if (!this._validateAll()) {
      // Focus first error field
      const firstError = this.form.querySelector('.is-error');
      if (firstError) firstError.focus();
      return;
    }

    this.submitBtn.classList.add('is-loading');
    this.submitBtn.disabled = true;

    // Simulate async API call
    await new Promise(resolve => setTimeout(resolve, 1600));

    this.submitBtn.classList.remove('is-loading');
    this.submitBtn.disabled = false;
    this.form.reset();

    this.successMsg.classList.add('is-visible');
    this.successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(() => this.successMsg.classList.remove('is-visible'), 9000);
  }
};

// ============================================================
// BENTO CARD — Subtle tilt on hover (desktop only)
// ============================================================
const BentoTilt = {
  init() {
    if ('ontouchstart' in window) return;
    document.querySelectorAll('.bento-card').forEach(card => {
      card.addEventListener('mousemove', e => this._onMove(e, card));
      card.addEventListener('mouseleave', () => this._onLeave(card));
    });
  },

  _onMove(e, card) {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const tiltX  = -(dy * 3.5).toFixed(2);
    const tiltY  =  (dx * 3.5).toFixed(2);
    card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.018)`;
    card.style.transition = 'transform 0.08s linear';
  },

  _onLeave(card) {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  }
};

// ============================================================
// ACTIVE NAV LINK — Highlight based on scroll position
// ============================================================
const ActiveNav = {
  sections: [],
  links:    [],

  init() {
    this.sections = ['concept', 'menu', 'gallery', 'reservation']
      .map(id => document.getElementById(id))
      .filter(Boolean);
    this.links = document.querySelectorAll('.nav__link:not(.nav__link--cta)');
    window.addEventListener('scroll', this._onScroll.bind(this), { passive: true });
  },

  _onScroll() {
    const offset = document.getElementById('nav').offsetHeight + 20;
    let current  = '';

    this.sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - offset) current = sec.id;
    });

    this.links.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
    });
  }
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  Nav.init();
  Parallax.init();
  ScrollReveal.init();
  ReservationForm.init();
  BentoTilt.init();
  ActiveNav.init();

  if (typeof lucide !== 'undefined') lucide.createIcons();
});
