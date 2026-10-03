// Home-page hero: a drifting particle network that reaches toward the cursor.
// Pauses when off-screen or the tab is hidden; static single frame under reduced motion.
(function () {
  var canvas = document.querySelector('[data-hero-canvas]');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w = 0;
  var h = 0;
  var points = [];
  var mouse = { x: -9999, y: -9999 };
  var colors = { a: '#a78bfa', b: '#22d3ee' };
  var running = false;
  var onScreen = true;
  var raf = 0;
  var LINK = 130;

  function readColors() {
    var cs = getComputedStyle(document.documentElement);
    colors.a = cs.getPropertyValue('--accent').trim() || colors.a;
    colors.b = cs.getPropertyValue('--accent-2').trim() || colors.b;
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.round(Math.min(90, (w * h) / 9000));
    points = [];
    for (var i = 0; i < count; i++) {
      points.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.6,
        c: Math.random() < 0.5 ? 'a' : 'b',
      });
    }
    if (!running) draw();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      if (running) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        // gentle pull toward the cursor
        var mdx = mouse.x - p.x;
        var mdy = mouse.y - p.y;
        var md = Math.hypot(mdx, mdy);
        if (md < 180 && md > 1) {
          p.x += (mdx / md) * 0.25;
          p.y += (mdy / md) * 0.25;
        }
      }
      for (var j = i + 1; j < points.length; j++) {
        var q = points[j];
        var d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < LINK) {
          ctx.globalAlpha = (1 - d / LINK) * 0.35;
          ctx.strokeStyle = colors[p.c];
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
      var dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < 180) {
        ctx.globalAlpha = (1 - dm / 180) * 0.7;
        ctx.strokeStyle = colors.b;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = colors[p.c];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (running) raf = requestAnimationFrame(draw);
  }

  function start() {
    if (reduceMotion || running || !onScreen || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(draw);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  var host = canvas.parentElement;
  host.addEventListener('pointermove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  host.addEventListener('pointerleave', function () {
    mouse.x = mouse.y = -9999;
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      onScreen ? start() : stop();
    }).observe(canvas);
  }
  document.addEventListener('visibilitychange', function () {
    document.hidden ? stop() : start();
  });
  document.addEventListener('themechange', function () {
    readColors();
    if (!running) draw();
  });
  window.addEventListener('resize', resize);

  readColors();
  resize();
  start();
})();
