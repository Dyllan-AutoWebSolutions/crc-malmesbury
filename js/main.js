// CRC Malmesbury — card "hover" on touch / tablet
// No mouse means no :hover, so on touch devices and screens up to 1024px a card
// gets .is-in-view (same styles as hover) while it crosses the middle of the screen.
document.addEventListener('DOMContentLoaded', function () {
  var cards = document.querySelectorAll('.card--link, .card--feature, .card--accent, .card--title-link');
  if (!cards.length || !('IntersectionObserver' in window)) return;

  var touchOrSmall = window.matchMedia('(hover: none), (max-width: 1024px)');
  var observer = null;

  function start() {
    // Thin band through the vertical centre of the viewport
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-in-view', entry.isIntersecting);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    cards.forEach(function (card) { observer.observe(card); });
  }

  function stop() {
    if (observer) observer.disconnect();
    observer = null;
    cards.forEach(function (card) { card.classList.remove('is-in-view'); });
  }

  function sync() {
    if (touchOrSmall.matches) { if (!observer) start(); } else { stop(); }
  }

  sync();
  if (touchOrSmall.addEventListener) {
    touchOrSmall.addEventListener('change', sync);
  } else if (touchOrSmall.addListener) {
    touchOrSmall.addListener(sync);
  }
});

// CRC Malmesbury — mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');

  if (!nav || !toggle) return;

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  nav.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
});
