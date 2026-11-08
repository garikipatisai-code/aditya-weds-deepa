(function () {
  var video = document.querySelector('.hero video');
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
    el.innerHTML = html;
  }

  update();
  setInterval(update, 1000);
})();
