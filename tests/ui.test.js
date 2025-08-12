/** @jest-environment jsdom */

describe('OS style UI', () => {
  let openWindow;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="topbar">Bank OS</div>
      <div id="desktop" class="desktop-grid"></div>
      <div id="dock">
        <button class="app-icon" data-app="teller">Teller</button>
      </div>
    `;
    ({ openWindow } = require('../src/main.js'));
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('creates unique windows without overlap', () => {
    openWindow('teller');
    openWindow('teller');
    const windows = document.querySelectorAll('.app-window');
    expect(windows.length).toBe(2);
    const indices = Array.from(windows).map(w => w.dataset.index);
    expect(new Set(indices).size).toBe(2);
  });
});
