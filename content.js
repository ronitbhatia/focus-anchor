(() => {
  const STORAGE_KEY = location.href.split('#')[0]; // ignore hash

  // SPA guard – clear stored offset for new pushState
  const clearStored = () => chrome.storage.local.remove(STORAGE_KEY);
  window.addEventListener('popstate', clearStored);
  // YouTube, GitHub etc. use history.pushState
  const origPush = history.pushState;
  history.pushState = function (...a) {
    origPush.apply(history, a);
    clearStored();
  };

  // Restore scroll (smooth)
  chrome.storage.local.get([STORAGE_KEY]).then(res => {
    const y = res[STORAGE_KEY] || 0;
    if (y && !location.hash && !location.href.includes(':~:text=')) {
      // Ghost scrollbar flash
      document.documentElement.classList.add('fa-restore');
      setTimeout(() => document.documentElement.classList.remove('fa-restore'), 1000);
      // Smooth scroll
      scrollTo({top: y, behavior: 'smooth'});
    }
  });

  // Continuous save
  let last = 0;
  const save = () => {
    const y = window.scrollY;
    if (Math.abs(y - last) > 50) {
      chrome.storage.local.set({[STORAGE_KEY]: y});
      last = y;
    }
  };
  window.addEventListener('scroll', save, {passive: true});

  // Respond to background
  chrome.runtime.onMessage.addListener((msg, _s, send) => {
    if (msg.action === 'getPos') send({scrollY: window.scrollY});
  });
})();