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

// CRC Malmesbury — pop-up forms → pre-filled WhatsApp message
// Any <dialog class="modal"> holding a <form data-whatsapp="27..."> works the same way:
// fields marked `required` are checked, fields with data-label are listed under the intro.
var whatsappIntros = {
  'serve-form': function (fields) {
    var ministry = fields.ministry.value;
    return ministry === 'unsure'
      ? 'Hi there.\nI am interested to start serving, but I am not sure where yet,\n' +
        'can you help me find the right ministry please.'
      : 'Hi there.\nI am interested to start serving in ' + ministry + ',\n' +
        'can you tell me more about it please.';
  },
  'homecell-form': function () {
    return 'Hi there, I am interested in joining a Homecell,\n' +
      'can you tell me a bit more please.';
  }
};

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('dialog.modal').forEach(function (dialog) {
    var form = dialog.querySelector('form[data-whatsapp]');
    if (!form || typeof dialog.showModal !== 'function') return;

    var error = form.querySelector('.modal__error');

    document.querySelectorAll('[data-open-dialog="' + dialog.id + '"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        dialog.showModal();
      });
    });

    dialog.querySelector('[data-close-dialog]').addEventListener('click', function () { dialog.close(); });

    // Click on the backdrop closes it
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstEmpty = null;
      form.querySelectorAll('[required]').forEach(function (field) {
        var empty = !field.value.trim();
        field.setAttribute('aria-invalid', empty ? 'true' : 'false');
        if (empty && !firstEmpty) firstEmpty = field;
      });
      if (firstEmpty) {
        error.hidden = false;
        firstEmpty.focus();
        return;
      }
      error.hidden = true;

      var details = [];
      form.querySelectorAll('[data-label]').forEach(function (field) {
        var value = field.value.trim();
        if (value) details.push(field.dataset.label + ': ' + value);
      });

      var message = whatsappIntros[form.id](form.elements) + '\n\n' + details.join('\n');
      var url = 'https://wa.me/' + form.dataset.whatsapp + '?text=' + encodeURIComponent(message);
      window.open(url, '_blank', 'noopener');
      dialog.close();
      form.reset();
    });
  });
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
