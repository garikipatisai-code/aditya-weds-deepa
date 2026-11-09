(function () {
  var openBtn = document.getElementById('si-open-invitation');
  var video = document.querySelector('.si-video-wrap video');
  var opened = false;

  if (openBtn) {
    openBtn.addEventListener('click', function () {
      document.body.dataset.state = 'open';
      var invitation = document.getElementById('si-invitation');
      if (invitation) invitation.removeAttribute('hidden');
      window.scrollTo(0, 0);
      if (typeof window.ScrollTrigger !== 'undefined') {
        requestAnimationFrame(function () {
          window.ScrollTrigger.refresh();
        });
      }
      if (video) {
        video.load();
        video.muted = false;
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          video.play().catch(function () {});
        }
        var note = document.getElementById('si-video-unmute');
        if (note) note.hidden = true;
      }
      opened = true;
      cdStart();
    });
  }

  if (video) {
    var tryPlay = function (unmute) {
      video.muted = !unmute;
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.play().catch(function () {});
      }
    };
    video.addEventListener('loadedmetadata', function () { tryPlay(false); }, { once: true });
    document.addEventListener('click', function () { tryPlay(false); }, { once: true });
    document.addEventListener('touchstart', function () { tryPlay(false); }, { once: true });

    // Reduced motion: pause video when prefers-reduced-motion is set.
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function onReduceMotion(mql) {
      if (mql.matches) {
        video.pause();
        video.removeAttribute('autoplay');
        video.loop = false;
      } else {
        tryPlay();
      }
    }
    if (typeof reduceMotion.addEventListener === 'function') {
      reduceMotion.addEventListener('change', onReduceMotion);
    } else {
      reduceMotion.addListener(onReduceMotion);
    }
    onReduceMotion(reduceMotion);
  }

  // Preloader bar: shows until video is play-ready, then fades.
  var preloader = document.getElementById('si-preloader');
  var preloaderBar = document.querySelector('.si-preloader-bar');
  function markVideoReady() {
    if (!preloader) return;
    if (preloaderBar) preloaderBar.classList.add('ready');
    preloader.classList.add('fade-out');
    preloader.addEventListener('transitionend', function onEnd() {
      preloader.style.display = 'none';
      preloader.removeEventListener('transitionend', onEnd);
    }, { once: true });
    setTimeout(function () { preloader.style.display = 'none'; }, 600);
  }
  if (video) {
    if (video.readyState >= 2) markVideoReady();
    else {
      video.addEventListener('canplay', markVideoReady, { once: true });
      setTimeout(markVideoReady, 4000);
    }
  }

  var pauseBtn = document.getElementById('si-video-pause');
  if (pauseBtn && video) {
    pauseBtn.addEventListener('click', function () {
      if (video.paused) {
        video.play().catch(function () {});
        pauseBtn.textContent = 'Pause';
      } else {
        video.pause();
        pauseBtn.textContent = 'Play';
      }
    });
  }

  var target = new Date('2026-11-20T20:56:00+05:30');
  var wrap = document.getElementById('countdown');
  var flipEls = {};
  if (wrap) {
    wrap.querySelectorAll('.flip[data-digit]').forEach(function (el) {
      flipEls[el.dataset.digit] = el;
    });
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function flipDigit(unit, value) {
    var el = flipEls[unit];
    if (!el) return;
    if (el.dataset.cur === value) return;
    var top = el.querySelector('.flip-top');
    var bot = el.querySelector('.flip-bottom');
    el.dataset.cur = value;
    bot.textContent = value;
    el.classList.remove('flipping');
    requestAnimationFrame(function () {
      el.classList.add('flipping');
    });
    el.addEventListener('animationend', function onEnd() {
      el.classList.remove('flipping');
      top.textContent = value;
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
    Object.keys(vals).forEach(function (unit) {
      flipDigit(unit, vals[unit]);
    });
  }

  var cdInterval;
  function cdStart() { update(); cdInterval = setInterval(update, 1000); }
  function cdStop() { clearInterval(cdInterval); }
  document.addEventListener('visibilitychange', function () {
    if (!opened) return;
    if (document.hidden) cdStop(); else cdStart();
  });

  var btnWa = document.getElementById('si-share-whatsapp');
  if (btnWa) {
    btnWa.addEventListener('click', function () {
      var text = 'Join us for the wedding of Venkata Aditya Kumar and Naga Deepa on 20 Nov 2026 at 8:56 PM IST.';
      var url = 'https://wa.me/?text=' + encodeURIComponent(text);
      var win = window.open(url, '_blank');
      if (win) win.opener = null;
    });
  }

  var btnCal = document.getElementById('si-share-calendar');
  if (btnCal) {
    btnCal.addEventListener('click', function () {
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
    });
  }

  var btnCopy = document.getElementById('si-share-copy');
  var toast = document.getElementById('si-share-toast');
  if (btnCopy) {
    btnCopy.addEventListener('click', function () {
      var u=new URL(location.href);u.hash='';u.search='';
      navigator.clipboard.writeText(u.href).then(function () {
        if (toast) {
          toast.hidden = false;
          setTimeout(function () {
            toast.hidden = true;
          }, 2000);
        }
      });
    });
  }

  var musicBtn = document.getElementById('music-toggle');
  if (musicBtn && video) {
    var iconOn = musicBtn.querySelector('.si-icon-unmuted');
    var iconOff = musicBtn.querySelector('.si-icon-muted');
    function updateMusicToggle() {
      var unmuted = !video.muted;
      if (iconOn) iconOn.hidden = !unmuted;
      if (iconOff) iconOff.hidden = unmuted;
      musicBtn.setAttribute('aria-label', unmuted ? 'Mute video' : 'Unmute video');
      musicBtn.setAttribute('aria-pressed', String(unmuted));
    }
    updateMusicToggle();
    musicBtn.addEventListener('click', function () {
      video.muted = !video.muted;
      updateMusicToggle();
      if (!video.muted) {
        video.play().catch(function () {});
      }
    });
  }

  // Magnetic CTAs: haptic tap (pointer pull removed).
  (function () {
    var magnets = document.querySelectorAll('.si-magnetic');
    magnets.forEach(function (el) {
      el.addEventListener('pointerdown', function () {
        el.classList.add('is-active');
      });
      el.addEventListener('pointerup', function () {
        el.classList.remove('is-active');
      });
      el.addEventListener('click', function () {
        if (navigator.vibrate) navigator.vibrate(10);
      });
    });
  })();

  // Gallery lightbox: open on figure tap, close button / backdrop / swipe down.
  (function () {
    var lightbox = document.getElementById('si-lightbox');
    var lightboxImg = document.getElementById('si-lightbox-img');
    var lightboxCap = document.getElementById('si-lightbox-caption');
    var lightboxClose = document.getElementById('si-lightbox-close');
    if (!lightbox) return;

    var lastFocus = null;
    var focusable = 'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function openLightbox(fig) {
      var img = fig.querySelector('img');
      var cap = fig.querySelector('.si-gal-caption');
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
      lightboxCap.textContent = cap ? cap.textContent : '';
      lastFocus = document.activeElement;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
      document.body.style.overflow = '';
      if (lastFocus) {
        lastFocus.focus();
        lastFocus = null;
      }
    }

    document.querySelectorAll('.si-gal-figure').forEach(function (fig) {
      fig.addEventListener('click', function () {
        openLightbox(fig);
        if (navigator.vibrate) navigator.vibrate(10);
      });
    });
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
        return;
      }
      if (e.key !== 'Tab') return;
      var els = lightbox.querySelectorAll(focusable);
      var arr = Array.prototype.slice.call(els, 0);
      var idx = arr.indexOf(document.activeElement);
      if (e.shiftKey) {
        if (idx <= 0) {
          e.preventDefault();
          arr[arr.length - 1].focus();
        }
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
  })();

  // Lenis smooth-scroll init + scroll-progress bar — guarded: no-op if Lenis isn't loaded.
  var progress = document.getElementById('si-progress');
  var progressFill = document.getElementById('si-progress-fill');
  function setProgress(pct) {
    if (progressFill) {
      progressFill.style.transform = 'scaleX(' + Math.max(0, Math.min(1, pct / 100)) + ')';
    }
  }
  if (typeof window.Lenis !== 'undefined') {
    document.documentElement.classList.add('lenis');
    (function () {
      var lenis = new window.Lenis();
      if (typeof window.ScrollTrigger !== 'undefined') {
        lenis.on('scroll', window.ScrollTrigger.update);
      }
      if (typeof window.gsap !== 'undefined') {
        window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); if (progressFill) setProgress(lenis.progress * 100); });
        window.gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          lenis.raf(time);
          if (progressFill) setProgress(lenis.progress * 100);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    })();
  } else if (progress) {
    window.addEventListener('scroll', function () {
      var root = document.documentElement;
      var pct = (window.scrollY / Math.max(1, root.scrollHeight - root.clientHeight)) * 100;
      setProgress(pct);
    }, { passive: true });
  }

  // GSAP scroll reveals, with IntersectionObserver fallback when GSAP isn't loaded.
  var reveals = document.querySelectorAll('.reveal');
  if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
    window.gsap.registerPlugin(window.ScrollTrigger);
    reveals.forEach(function (el) {
      window.gsap.fromTo(el,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none', once: true }
      }
    );
    });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(function (el) {
      io.observe(el);
    });
  }
})();
