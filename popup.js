chrome.storage.local.get(null, data => {
  const list = document.getElementById('list');
  Object.entries(data)
    .sort(([,a],[,b]) => b-a) // newest first
    .slice(0, 20)            // show only 20
    .forEach(([url, pos]) => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${url}" target="_blank">${new URL(url).hostname}</a> ${Math.round(pos)} px`;
      list.appendChild(li);
    });
});