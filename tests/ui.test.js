const fs = require('fs');
const path = require('path');
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { JSDOM } = require('jsdom');
const { initUI } = require('../src/ui.js');

describe('OS-like UI', () => {
  let dom;
  let document;

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    dom = new JSDOM(html, { url: 'http://localhost/' });
    document = dom.window.document;
    global.window = dom.window;
    global.document = document;
    initUI(document);
  });

  test('displays desktop icons', () => {
    const icons = document.querySelectorAll('.app-icon');
    expect(icons.length).toBe(3);
  });

  test('opens window when icon is clicked', () => {
    const customersIcon = document.querySelector('[data-app="customers"]');
    customersIcon.click();
    const header = document.querySelector('.window-header');
    expect(header.textContent).toContain('Customers');
  });
});
