(function () {
  var overlay = document.getElementById('si-envelope');
  var openBtn = document.getElementById('si-open-invitation');
  var video = document.querySelector('.si-video video');

  function hideSplash() {
    if (!overlay) return;
    overlay.classList.add('fade-out');
    overlay.addEventListener('transitionend', function onEnd() {
      overlay.style.display = 'none';
      overlay.removeEventListener('transitionend', onEnd);
    }, { once: true });
    setTimeout(function () {
      overlay.style.display = 'none';
    }, 900);
    if (video) {
      video.play().catch(function () {});
    }
  }

  if (openBtn) {
    openBtn.addEventListener('click', hideSplash);
  }

  if (video) {
    var tryPlay = function () {
      video.play().catch(function () {});
    };
    video.addEventListener('loadedmetadata', tryPlay, { once: true });
    document.addEventListener('click', tryPlay, { once: true });
    document.addEventListener('touchstart', tryPlay, { once: true });
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
    else video.addEventListener('canplay', markVideoReady, { once: true });
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
    void el.offsetHeight;
    el.classList.add('flipping');
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

  if (wrap) {
    update();
    setInterval(update, 1000);
  }

  var form = document.getElementById('rsvp');
  var confirmMsg = document.getElementById('rsvp-confirm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var errorEl = document.getElementById('rsvp-error');
      var data = new FormData(form);
      var name = (data.get('name') || '').trim();
      var attending = data.get('attending') || '';
      var message = data.get('message') || '';
      if (!name || attending === '') {
        if (errorEl) {
          errorEl.hidden = false;
          confirmMsg.hidden = true;
        }
        return;
      }
      if (errorEl) {
        errorEl.hidden = true;
      }
      var text = 'RSVP: ' + name + ' — Attending: ' + attending + (message ? ' — Message: ' + message : '');
      var whatsappUrl = 'https://wa.me/?text=' + encodeURIComponent(text);
      var win = window.open(whatsappUrl, '_blank');
      if (win) win.opener = null;
      if (!win) {
        location.href = whatsappUrl;
      }
      form.reset();
      if (confirmMsg) {
        confirmMsg.hidden = false;
        confirmMsg.textContent = 'Thank you, ' + name + '! Your RSVP has been confirmed.';
        setTimeout(function () {
          confirmMsg.hidden = true;
        }, 5000);
      }
    });
  }

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
      var link = location.href;
      navigator.clipboard.writeText(link).then(function () {
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
  var musicMuted = true;
  var musicCtx = null;
  var musicGain = null;
  var musicTimer = 0;
  var musicIdx = 0;
  var musicNotes = [523.25, 659.25, 783.99, 1046.50, 783.99, 659.25];

  function musicStart() {
    if (!musicCtx) {
      var Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return;
      musicCtx = new Ctor();
      musicGain = musicCtx.createGain();
      musicGain.gain.value = 0.35;
      musicGain.connect(musicCtx.destination);
    }
    if (musicCtx.state === 'suspended') musicCtx.resume();
    musicTick();
  }

  function musicTick() {
    if (musicMuted || !musicCtx) return;
    var note = musicNotes[musicIdx];
    musicIdx = (musicIdx + 1) % musicNotes.length;
    var osc = musicCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, musicCtx.currentTime);
    osc.connect(musicGain);
    osc.start();
    osc.stop(musicCtx.currentTime + 0.45);
    musicTimer = setTimeout(musicTick, 600);
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', function () {
      musicMuted = !musicMuted;
      musicBtn.textContent = musicMuted ? 'Unmute Music' : 'Mute Music';
      musicBtn.setAttribute('aria-pressed', String(!musicMuted));
      if (!musicMuted) musicStart();
      else clearTimeout(musicTimer);
    });
  }

  // Magnetic CTAs: pointer pull + vibrate on tap.
  (function () {
    var magnets = document.querySelectorAll('.si-magnetic');
    magnets.forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) * 0.35;
        var dy = (e.clientY - cy) * 0.35;
        el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      el.addEventListener('pointerleave', function () {
        el.style.transform = '';
      });
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

    function openLightbox(fig) {
      var img = fig.querySelector('img');
      var cap = fig.querySelector('.si-gal-caption');
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
      lightboxCap.textContent = cap ? cap.textContent : '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
      document.body.style.overflow = '';
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
    var startY = 0;
    lightbox.addEventListener('touchstart', function (e) {
      startY = e.changedTouches[0].clientY;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (e.changedTouches[0].clientY - startY > 70) closeLightbox();
    }, { passive: true });
  })();

  // Marigold motif: spawn capped at 24, floating in the background.
  (function () {
    var container = document.getElementById('si-marigolds');
    var cap = 24;
    if (!container) return;
    for (var i = 0; i < cap; i++) {
      var m = document.createElement('div');
      m.className = 'si-marigold';
      m.style.left = Math.random() * 100 + '%';
      m.style.top = Math.random() * 100 + '%';
      m.style.width = clampSize();
      m.style.height = m.style.width;
      m.style.animationDelay = Math.random() * 7 + 's';
      m.style.transform = 'rotate(' + (Math.random() * 360) + 'deg) scale(' + (0.5 + Math.random()) + ')';
      container.appendChild(m);
    }
    function clampSize() {
      return Math.max(14, Math.min(30, window.innerWidth * 0.055)) + 'px';
    }
  })();

  // Lenis smooth-scroll init + scroll-progress bar — guarded: no-op if Lenis isn't loaded.
  var progress = document.getElementById('si-progress');
  var progressFill = document.getElementById('si-progress-fill');
  function setProgress(pct) {
    if (progressFill) {
      progressFill.style.width = Math.max(0, Math.min(100, pct)) + '%';
    }
  }
  if (typeof window.Lenis !== 'undefined') {
    document.documentElement.classList.add('lenis');
    (function () {
      var lenis = new window.Lenis();
      function raf(time) {
        lenis.raf(time);
        if (progressFill) setProgress(lenis.progress * 100);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
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
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
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
