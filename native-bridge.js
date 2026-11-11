// Native enhancements for the Capacitor build. Safe no-op in a plain browser.
(function () {
  const cap = window.Capacitor;
  const P = cap && cap.Plugins ? cap.Plugins : {};
  const isNative = !!(cap && cap.isNativePlatform && cap.isNativePlatform());
  if (!isNative) return;

  const H = P.Haptics, SB = P.StatusBar, App = P.App;
  const buzz = (style) => { try { H && H.impact({ style }); } catch (e) {} };
  const notify = (type) => { try { H && H.notification({ type }); } catch (e) {} };

  // Hidden status bar (landscape is locked in AndroidManifest by the build workflow)
  try { SB && SB.hide(); } catch (e) {}

  // Keep screen on via Wake Lock API (re-acquire after returning from background)
  let wl = null;
  const lock = async () => { try { wl = await navigator.wakeLock.request('screen'); } catch (e) {} };
  lock();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) lock(); });

  // Haptics: wrap existing global game functions (declared at top level of index.html)
  function wrap(name, fn) {
    const orig = window[name];
    if (typeof orig !== 'function') return;
    window[name] = function () { try { fn.apply(null, arguments); } catch (e) {} return orig.apply(this, arguments); };
  }
  window.addEventListener('load', () => {
    wrap('playChime', () => notify('SUCCESS'));
    wrap('endGame', (ok) => notify(ok ? 'SUCCESS' : 'ERROR'));
  });

  // Light tick while dragging the throttle lever (throttled, only on notch changes)
  let lastNotch = null;
  const slot = document.getElementById('lever-slot') || document.querySelector('[id*=lever]');
  if (slot) {
    slot.addEventListener('touchmove', () => {
      const h = document.getElementById('lever-handle');
      const k = h ? Math.round(h.getBoundingClientRect().top / 12) : null;
      if (k !== lastNotch) { lastNotch = k; buzz('LIGHT'); }
    }, { passive: true });
  }

  // Audio: suspend when app goes to background, resume when back
  document.addEventListener('visibilitychange', () => {
    try {
      if (typeof audioCtx === 'undefined' || !audioCtx) return;
      if (document.hidden) audioCtx.suspend(); else audioCtx.resume();
    } catch (e) {}
  });
  try { App && App.addListener('backButton', () => { /* ignore Android back during play */ }); } catch (e) {}
})();
