let windowCount = 0;

const desktop = document.getElementById('desktop');
const icons = document.querySelectorAll('.app-icon');

icons.forEach(icon => {
  icon.addEventListener('click', () => {
    const app = icon.dataset.app;
    openWindow(app);
  });
});

export function openWindow(app) {
  const win = document.createElement('div');
  win.className = 'app-window';
  win.dataset.index = windowCount++;

  const header = document.createElement('header');
  header.textContent = formatTitle(app);

  const content = document.createElement('div');
  content.className = 'content';
  content.textContent = `${formatTitle(app)} content goes here.`;

  win.appendChild(header);
  win.appendChild(content);
  desktop.appendChild(win);
  return win;
}

function formatTitle(name) {
  return name
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
