// Site interactions. Loaded with `defer` on every page; no dependencies.
(function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ---- theme toggle ----
  var toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}
      document.dispatchEvent(new CustomEvent('themechange'));
    });
  }

  // ---- copy buttons on code blocks ----
  document.querySelectorAll('.prose pre').forEach(function (pre) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = 'copy';
    btn.addEventListener('click', function () {
      var code = pre.querySelector('code');
      navigator.clipboard.writeText((code || pre).innerText).then(
        function () {
          btn.textContent = 'copied ✓';
          setTimeout(function () {
            btn.textContent = 'copy';
          }, 1500);
        },
        function () {
          btn.textContent = 'failed';
        }
      );
    });
    pre.appendChild(btn);
  });

  // ---- scroll reveal ----
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  }

  // ---- card spotlight + 3D tilt ----
  if (finePointer) {
    document.querySelectorAll('.fx-card').forEach(function (card) {
      var tilt = !reduceMotion && card.hasAttribute('data-tilt');
      var frame = 0;
      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(function () {
          card.style.setProperty('--mx', x + 'px');
          card.style.setProperty('--my', y + 'px');
          if (tilt) {
            var rx = (y / rect.height - 0.5) * -7;
            var ry = (x / rect.width - 0.5) * 7;
            card.style.transform =
              'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-3px)';
          }
        });
      });
      card.addEventListener('pointerleave', function () {
        cancelAnimationFrame(frame);
        card.style.transform = '';
      });
    });
  }

  // ---- reading progress ----
  var bar = document.querySelector('[data-progress]');
  var article = document.querySelector('[data-article]');
  if (bar && article) {
    var ticking = false;
    var update = function () {
      var rect = article.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      bar.style.transform = 'scaleX(' + p + ')';
      ticking = false;
    };
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    window.addEventListener('resize', update);
    update();
  }

  // ---- table of contents: highlight the section being read ----
  var tocLinks = document.querySelectorAll('[data-toc] a');
  if (tocLinks.length) {
    var headings = [];
    tocLinks.forEach(function (a) {
      var el = document.getElementById(decodeURIComponent(a.hash.slice(1)));
      if (el && headings.indexOf(el) === -1) headings.push(el);
    });
    var tocTicking = false;
    var syncToc = function () {
      // Active = the last heading above a line 30% down the viewport.
      var line = window.innerHeight * 0.3;
      var current = headings[0];
      headings.forEach(function (h) {
        if (h.getBoundingClientRect().top <= line) current = h;
      });
      tocLinks.forEach(function (a) {
        a.classList.toggle('active', !!current && decodeURIComponent(a.hash.slice(1)) === current.id);
      });
      tocTicking = false;
    };
    window.addEventListener(
      'scroll',
      function () {
        if (!tocTicking) {
          tocTicking = true;
          requestAnimationFrame(syncToc);
        }
      },
      { passive: true }
    );
    syncToc();
  }
})();
