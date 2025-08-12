const fs = require('fs');
const path = require('path');
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { JSDOM } = require('jsdom');

jest.mock('../src/services/Ledger.js', () => {
  return jest.fn().mockImplementation((accountManager) => ({
    postEntry: (entry) => {
      entry.postings.forEach(p => {
        const account = accountManager.getAccount(p.accountId);
        if (p.type === 'debit') {
          account.debit(p.amount);
        } else {
          account.credit(p.amount);
        }
      });
      return entry;
    }
  }));
});

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

  test('shows transaction form', () => {
    const txIcon = document.querySelector('[data-app="transactions"]');
    txIcon.click();
    const form = document.querySelector('.window-content form');
    expect(form).not.toBeNull();
  });

  test('updates balance and KPIs after transaction', () => {
    const txIcon = document.querySelector('[data-app="transactions"]');
    txIcon.click();

    const form = document.querySelector('.window-content form');
    const accountSelect = form.querySelector('select');
    const amountInput = form.querySelector('input');

    accountSelect.value = 'checking_liability';
    amountInput.value = '100';

    form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));

    const info = document.querySelector('.info-section');
    expect(info.textContent).toContain('Balance: 50100.00');
    expect(info.textContent).toContain('Profit: 0.00');
    expect(info.textContent).toContain('Liquidity: 60000.00');
  });
});
