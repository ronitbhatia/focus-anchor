// Service Worker (MV3)
const MAX_ENTRIES = 500;
const PRUNE_AMOUNT = 100;

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  if (removeInfo.isWindowClosing) return;

  const tab = await chrome.tabs.get(tabId).catch(() => null);
  if (!tab || !tab.url || tab.url.startsWith('chrome://')) return;

  const res = await chrome.tabs.sendMessage(tabId, {action: 'getPos'}).catch(() => ({}));
  const scrollY = res?.scrollY ?? 0;

  await chrome.storage.local.set({[tab.url]: scrollY});
  await enforceStorageCap();
});

async function enforceStorageCap() {
  const data = await chrome.storage.local.get();
  const keys = Object.keys(data);
  if (keys.length <= MAX_ENTRIES) return;

  // sort by key (URL) ascending – oldest first
  const toDelete = keys.slice(0, PRUNE_AMOUNT);
  await chrome.storage.local.remove(toDelete);
}