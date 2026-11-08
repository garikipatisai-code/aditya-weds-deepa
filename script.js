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

  var target = new Date('2026-11-20T20:56:00+05:30');
  var el = document.getElementById('countdown');
  var labels = ['Days', 'Hours', 'Min', 'Sec'];

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function update() {
    var diff = target - new Date();
    var html;
    if (diff <= 0) {
      html =
        '<span class="cd-value">00</span><span class="cd-label">Days</span>' +
        '<span class="cd-value">00</span><span class="cd-label">Hours</span>' +
        '<span class="cd-value">00</span><span class="cd-label">Min</span>' +
        '<span class="cd-value">00</span><span class="cd-label">Sec</span>' +
        '<p class="countdown-note">Ceremony has begun · Friday, 20 November 2026 at 8:56 PM IST</p>';
    } else {
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      var secs = Math.floor((diff % 60000) / 1000);
      html =
        '<span class="cd-value">' + pad(days) + '</span><span class="cd-label">' + labels[0] + '</span>' +
        '<span class="cd-value">' + pad(hours) + '</span><span class="cd-label">' + labels[1] + '</span>' +
        '<span class="cd-value">' + pad(mins) + '</span><span class="cd-label">' + labels[2] + '</span>' +
        '<span class="cd-value">' + pad(secs) + '</span><span class="cd-label">' + labels[3] + '</span>';
    }
    if (el) el.innerHTML = html;
  }

  if (el) {
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
  if (musicBtn) {
    musicBtn.addEventListener('click', function () {
      musicMuted = !musicMuted;
      musicBtn.textContent = musicMuted ? 'Unmute Music' : 'Mute Music';
      musicBtn.setAttribute('aria-pressed', String(!musicMuted));
    });
  }

  // Lenis smooth-scroll init — guarded: no-op if the Lenis script isn't loaded.
  if (typeof window.Lenis !== 'undefined') {
    document.documentElement.classList.add('lenis');
    (function () {
      var lenis = new window.Lenis();
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    })();
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function (el) {
    io.observe(el);
  });
})();
