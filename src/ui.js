export function initUI(rootDocument = document) {
  const desktop = rootDocument.getElementById('desktop');
  const windowContainer = rootDocument.getElementById('window-container');
  let activeWindow = null;

  function createWindow(title, content) {
    if (activeWindow) {
      windowContainer.removeChild(activeWindow);
      activeWindow = null;
    }
    const win = rootDocument.createElement('div');
    win.className = 'window';

    const header = rootDocument.createElement('div');
    header.className = 'window-header';
    const titleSpan = rootDocument.createElement('span');
    titleSpan.textContent = title;
    const closeBtn = rootDocument.createElement('button');
    closeBtn.textContent = '\u00D7';
    closeBtn.addEventListener('click', () => {
      windowContainer.removeChild(win);
      activeWindow = null;
    });
    header.appendChild(titleSpan);
    header.appendChild(closeBtn);

    const body = rootDocument.createElement('div');
    body.className = 'window-content';
    body.textContent = content;

    win.appendChild(header);
    win.appendChild(body);
    windowContainer.appendChild(win);
    activeWindow = win;
  }

  desktop.addEventListener('click', (e) => {
    const icon = e.target.closest('.app-icon');
    if (!icon) return;
    const app = icon.dataset.app;
    if (app === 'customers') {
      createWindow('Customers', 'Customer management coming soon.');
    } else if (app === 'accounts') {
      createWindow('Accounts', 'Account information coming soon.');
    } else if (app === 'transactions') {
      createWindow('Transactions', 'Transaction details coming soon.');
    }
  });
}

// initialize when DOM is ready
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => initUI());
}
