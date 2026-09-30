(() => {
  const root = document.documentElement;
  const intro = document.getElementById('hlpb-intro');
  if (!intro || !root.classList.contains('hlpb-intro-active')) return;
  const number = document.getElementById('hlpb-intro-number');
  const bar = document.getElementById('hlpb-intro-bar');
  const start = performance.now();
  let loaded = document.readyState === 'complete';
  let done = false;
  window.addEventListener('load', () => { loaded = true; }, { once: true });
  function finish() {
    if (done) return;
    done = true;
    number.textContent = '100%';
    bar.style.width = '100%';
    try { sessionStorage.setItem('hlpb-intro-v1', '1'); } catch (e) {}
    window.setTimeout(() => {
      root.classList.remove('hlpb-intro-active');
      intro.remove();
    }, 240);
  }
  document.getElementById('hlpb-intro-skip').addEventListener('click', finish);
  function tick(now) {
    if (done) return;
    const elapsed = now - start;
    const value = loaded ? Math.min(100, Math.round(elapsed / 13)) : Math.min(90, Math.round(elapsed / 22));
    number.textContent = value + '%';
    bar.style.width = value + '%';
    if (loaded && elapsed >= 950) finish();
    else requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  window.setTimeout(finish, 4000);
})();
