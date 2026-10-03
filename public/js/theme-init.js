// Runs in <head> before paint: apply the saved theme, else follow the OS.
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var theme = null;
  try {
    theme = localStorage.getItem('theme');
  } catch (e) {}
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  root.setAttribute('data-theme', theme);
})();
