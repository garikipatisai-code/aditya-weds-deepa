(function () {
  'use strict';

  /* ============ CORE (zero third-party deps) ============ */

  // --- OPEN handler ---
  var openBtn = document.getElementById('si-open-invitation');
  var video = document.querySelector('.si-video-wrap video');
  var opened = false;
  var reduceMotionMql = null;
  try {
    reduceMotionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
  } catch (e) { reduceMotionMql = null; }
  function reduceMotionOn() {
    return !!(reduceMotionMql && reduceMotionMql.matches);
  }

  // --- Countdown (starts immediately; ticks even with all CDNs blocked) ---
  var target = new Date('2026-11-20T20:56:00+05:30');
  var wrap = document.getElementById('countdown');
  var flipEls = {};
  if (wrap) {
    wrap.querySelectorAll('.flip[data-digit]').forEach(function (el) {
      flipEls[el.dataset.digit] = el;
    });
  }
  function pad(n) { return String(n).padStart(2, '0'); }
  function flipDigit(unit, value) {
    var el = flipEls[unit];
    if (!el) return;
    if (el.dataset.cur === value) return;
    var top = el.querySelector('.flip-top');
    var bot = el.querySelector('.flip-bottom');
    el.dataset.cur = value;
    if (bot) bot.textContent = value;
    el.classList.remove('flipping');
    requestAnimationFrame(function () { el.classList.add('flipping'); });
    el.addEventListener('animationend', function onEnd() {
      el.classList.remove('flipping');
      if (top) top.textContent = value;
      el.removeEventListener('animationend', onEnd);
    }, { once: true });
  }
  function update() {
    var diff = target - new Date();
    var vals;
    if (diff <= 0) {
      vals = { days: '00', hours: '00', mins: '00', secs: '00' };
      var note = document.querySelector('.si-cd-note');
      if (note) note.textContent = 'Ceremony has begun · Friday, 20 November 2026 at 8:56 PM IST';
    } else {
      vals = {
        days: pad(Math.floor(diff / 86400000)),
        hours: pad(Math.floor((diff % 86400000) / 3600000)),
        mins: pad(Math.floor((diff % 3600000) / 60000)),
        secs: pad(Math.floor((diff % 60000) / 1000))
      };
    }
    Object.keys(vals).forEach(function (unit) { flipDigit(unit, vals[unit]); });
  }
  var cdInterval = null;
  function cdStart() {
    try { update(); } catch (e) {}
    if (cdInterval) return;
    cdInterval = setInterval(function () { try { update(); } catch (e) {} }, 1000);
  }
  function cdStop() { if (cdInterval) { clearInterval(cdInterval); cdInterval = null; } }
  cdStart();
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) cdStop(); else cdStart();
  });

  // --- Video: unmuted by default; autoplay attempt (blocked pre-gesture is fine) ---
  function tryAutoplayUnmuted() {
    if (!video || reduceMotionOn()) return;
    try {
      var p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    } catch (e) {}
  }
  if (video) {
    try {
      video.muted = false;
      video.removeAttribute('muted');
    } catch (e) {}
    video.addEventListener('loadedmetadata', tryAutoplayUnmuted, { once: true });
    document.addEventListener('click', tryAutoplayUnmuted, { once: true });
    document.addEventListener('touchstart', tryAutoplayUnmuted, { once: true });
    // prefers-reduced-motion: keep paused (a11y wins).
    if (reduceMotionMql) {
      function onReduceMotion(mql) {
        try {
          if (mql.matches) {
            video.pause();
            video.removeAttribute('autoplay');
            video.loop = false;
          }
        } catch (e) {}
      }
      try {
        if (typeof reduceMotionMql.addEventListener === 'function') {
          reduceMotionMql.addEventListener('change', onReduceMotion);
        } else if (typeof reduceMotionMql.addListener === 'function') {
          reduceMotionMql.addListener(onReduceMotion);
        }
      } catch (e) {}
      onReduceMotion(reduceMotionMql);
    }
  }

  if (openBtn) {
    openBtn.addEventListener('click', function () {
      try { document.body.dataset.state = 'open'; } catch (e) {}
      var invitation = document.getElementById('si-invitation');
      if (invitation) invitation.removeAttribute('hidden');
      try { window.scrollTo(0, 0); } catch (e) {}
      try {
        if (typeof window.ScrollTrigger !== 'undefined' && window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
          requestAnimationFrame(function () {
            try { window.ScrollTrigger.refresh(); } catch (e) {}
          });
        }
      } catch (e) {}
      if (video) {
        try { video.muted = false; } catch (e) {}
        if (!reduceMotionOn()) {
          try {
            var p = video.play();
            if (p && typeof p.catch === 'function') p.catch(function () {});
          } catch (e) {}
        }
        var note2 = document.getElementById('si-video-unmute');
        if (note2) note2.hidden = true;
      }
      opened = true;
      try { syncMusicToggle(); } catch (e) {}
      cdStart();
    });
  }

  // --- Preloader ---
  var preloader = document.getElementById('si-preloader');
  var preloaderBar = document.querySelector('.si-preloader-bar');
  function markVideoReady() {
    if (!preloader) return;
    try {
      if (preloaderBar) preloaderBar.classList.add('ready');
      preloader.classList.add('fade-out');
      preloader.addEventListener('transitionend', function onEnd() {
        preloader.style.display = 'none';
        preloader.removeEventListener('transitionend', onEnd);
      }, { once: true });
      setTimeout(function () { preloader.style.display = 'none'; }, 600);
    } catch (e) {}
  }
  if (video) {
    try {
      if (video.readyState >= 2) markVideoReady();
      else {
        video.addEventListener('canplay', markVideoReady, { once: true });
        setTimeout(markVideoReady, 4000);
      }
    } catch (e) {}
  }

  // --- Video pause/play button ---
  var pauseBtn = document.getElementById('si-video-pause');
  if (pauseBtn && video) {
    pauseBtn.addEventListener('click', function () {
      try {
        if (video.paused) {
          var p = video.play();
          if (p && typeof p.catch === 'function') p.catch(function () {});
          pauseBtn.textContent = 'Pause';
        } else {
          video.pause();
          pauseBtn.textContent = 'Play';
        }
      } catch (e) {}
    });
  }

  // --- Music toggle (reflects video muted state) ---
  var musicBtn = document.getElementById('music-toggle');
  var iconOn = musicBtn ? musicBtn.querySelector('.si-icon-unmuted') : null;
  var iconOff = musicBtn ? musicBtn.querySelector('.si-icon-muted') : null;
  function syncMusicToggle() {
    if (!musicBtn || !video) return;
    var unmuted = !video.muted;
    if (iconOn) iconOn.hidden = !unmuted;
    if (iconOff) iconOff.hidden = unmuted;
    musicBtn.setAttribute('aria-label', unmuted ? 'Mute video' : 'Unmute video');
    musicBtn.setAttribute('aria-pressed', String(unmuted));
  }
  if (musicBtn && video) {
    try { syncMusicToggle(); } catch (e) {}
    musicBtn.addEventListener('click', function () {
      try {
        video.muted = !video.muted;
        syncMusicToggle();
        if (!video.muted && !reduceMotionOn()) {
          var p = video.play();
          if (p && typeof p.catch === 'function') p.catch(function () {});
        }
      } catch (e) {}
    });
    try {
      video.addEventListener('volumechange', syncMusicToggle);
    } catch (e) {}
  }

  // --- Share ---
  var btnWa = document.getElementById('si-share-whatsapp');
  if (btnWa) {
    btnWa.addEventListener('click', function () {
      try {
        var text = 'Join us for the wedding of Venkata Aditya Kumar and Naga Deepa on 20 Nov 2026 at 8:56 PM IST.';
        var win = window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
        if (win) win.opener = null;
      } catch (e) {}
    });
  }
  var btnCal = document.getElementById('si-share-calendar');
  if (btnCal) {
    btnCal.addEventListener('click', function () {
      try {
        var ics = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Wedding Invitation//EN',
          'BEGIN:VEVENT',
          'UID:wedding-2026-11-20@invitation',
          'DTSTAMP:20261108T000000Z',
          'DTSTART;TZID=Asia/Kolkata:20261120T205600',
          'DTEND;TZID=Asia/Kolkata:20261120T220000',
          'SUMMARY:Wedding Ceremony — Venkata Aditya Kumar & Naga Deepa',
          'LOCATION:Nunnapaneni Venkataramana Conventions, Near RTC, Chilakaluripet',
          'DESCRIPTION:You are warmly invited to the wedding ceremony.',
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\r\n');
        var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'Wedding-Ceremony-20-Nov-2026.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (e) {}
    });
  }
  var btnCopy = document.getElementById('si-share-copy');
  var toast = document.getElementById('si-share-toast');
  if (btnCopy) {
    btnCopy.addEventListener('click', function () {
      try {
        var u = new URL(location.href); u.hash = ''; u.search = '';
        navigator.clipboard.writeText(u.href).then(function () {
          if (toast) {
            toast.hidden = false;
            setTimeout(function () { toast.hidden = true; }, 2000);
          }
        }).catch(function () {});
      } catch (e) {}
    });
  }

  // --- Magnetic CTAs: haptic tap ---
  try {
    var magnets = document.querySelectorAll('.si-magnetic');
    magnets.forEach(function (el) {
      el.addEventListener('pointerdown', function () { el.classList.add('is-active'); });
      el.addEventListener('pointerup', function () { el.classList.remove('is-active'); });
      el.addEventListener('click', function () {
        try { if (navigator.vibrate) navigator.vibrate(10); } catch (e) {}
      });
    });
  } catch (e) {}

  // --- Gallery lightbox ---
  try {
    var lightbox = document.getElementById('si-lightbox');
    if (lightbox) {
      var lightboxImg = document.getElementById('si-lightbox-img');
      var lightboxCap = document.getElementById('si-lightbox-caption');
      var lightboxClose = document.getElementById('si-lightbox-close');
      var lastFocus = null;
      var focusable = 'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])';
      function openLightbox(fig) {
        var img = fig.querySelector('img');
        if (!img || !lightboxImg) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
        if (lightboxCap) lightboxCap.textContent = img.alt || '';
        lastFocus = document.activeElement;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (lightboxClose) lightboxClose.focus();
      }
      function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        if (lightboxImg) lightboxImg.src = '';
        document.body.style.overflow = '';
        if (lastFocus) { try { lastFocus.focus(); } catch (e) {} lastFocus = null; }
      }
      document.querySelectorAll('.si-gal-figure').forEach(function (fig) {
        fig.addEventListener('click', function () {
          openLightbox(fig);
          try { if (navigator.vibrate) navigator.vibrate(10); } catch (e) {}
        });
      });
      if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });
      lightbox.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); return; }
        if (e.key !== 'Tab') return;
        var els = lightbox.querySelectorAll(focusable);
        var arr = Array.prototype.slice.call(els, 0);
        var idx = arr.indexOf(document.activeElement);
        if (e.shiftKey) {
          if (idx <= 0) { e.preventDefault(); arr[arr.length - 1].focus(); }
        } else if (idx === arr.length - 1) {
          e.preventDefault();
          arr[0].focus();
        }
      });
      var startY = 0;
      lightbox.addEventListener('touchstart', function (e) {
        startY = e.changedTouches[0].clientY;
      }, { passive: true });
      lightbox.addEventListener('touchend', function (e) {
        if (e.changedTouches[0].clientY - startY > 70) closeLightbox();
      }, { passive: true });
    }
  } catch (e) {}

  /* ============ ENHANCEMENTS (each isolated; CDN failure must not kill core) ============ */

  // --- Lenis smooth-scroll + scroll-progress bar ---
  try {
    var progress = document.getElementById('si-progress');
    var progressFill = document.getElementById('si-progress-fill');
    var setProgress = function (pct) {
      if (progressFill) {
        progressFill.style.transform = 'scaleX(' + Math.max(0, Math.min(1, pct / 100)) + ')';
      }
    };
    if (typeof window.Lenis !== 'undefined' && window.Lenis) {
      try {
        document.documentElement.classList.add('lenis');
        var lenis = new window.Lenis();
        if (typeof window.ScrollTrigger !== 'undefined' && window.ScrollTrigger && typeof window.ScrollTrigger.update === 'function') {
          lenis.on('scroll', window.ScrollTrigger.update);
        }
        if (typeof window.gsap !== 'undefined' && window.gsap && window.gsap.ticker) {
          window.gsap.ticker.add(function (t) {
            try { lenis.raf(t * 1000); if (progressFill) setProgress(lenis.progress * 100); } catch (e) {}
          });
          window.gsap.ticker.lagSmoothing(0);
        } else {
          var raf = function (time) {
            try { lenis.raf(time); if (progressFill) setProgress(lenis.progress * 100); } catch (e) {}
            requestAnimationFrame(raf);
          };
          requestAnimationFrame(raf);
        }
      } catch (e) {}
    } else if (progress) {
      window.addEventListener('scroll', function () {
        try {
          var root = document.documentElement;
          var pct = (window.scrollY / Math.max(1, root.scrollHeight - root.clientHeight)) * 100;
          setProgress(pct);
        } catch (e) {}
      }, { passive: true });
    }
  } catch (e) {}

  // --- GSAP scroll reveals, with IntersectionObserver fallback ---
  try {
    var reveals = document.querySelectorAll('.reveal');
    if (typeof window.gsap !== 'undefined' && window.gsap &&
        typeof window.ScrollTrigger !== 'undefined' && window.ScrollTrigger) {
      try {
        window.gsap.registerPlugin(window.ScrollTrigger);
        reveals.forEach(function (el) {
          window.gsap.fromTo(el,
            { y: 20, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none', once: true }
            });
        });
      } catch (e) {
        throw e;
      }
    } else {
      throw new Error('gsap unavailable, use fallback');
    }
  } catch (e) {
    try {
      var revealsFb = document.querySelectorAll('.reveal');
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        revealsFb.forEach(function (el) { io.observe(el); });
      } else {
        revealsFb.forEach(function (el) { el.classList.add('revealed'); });
      }
    } catch (e2) {}
  }
})();
