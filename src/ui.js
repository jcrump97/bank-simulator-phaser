import AccountManager from './services/AccountManager.js';
import Ledger from './services/Ledger.js';
import JournalEntry from './models/JournalEntry.js';
import KPIService from './services/KPIService.js';

const accountManager = new AccountManager();
const ledger = new Ledger(accountManager);
const kpiService = new KPIService(accountManager);

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
    if (typeof content === 'string') {
      body.textContent = content;
    } else {
      body.appendChild(content);
    }

    win.appendChild(header);
    win.appendChild(body);
    windowContainer.appendChild(win);
    activeWindow = win;
  }

  function buildTransactionForm() {
    const container = rootDocument.createElement('div');
    const form = rootDocument.createElement('form');

    const accountSelect = rootDocument.createElement('select');
    accountManager.getAccountsByType('liability').forEach(acc => {
      const option = rootDocument.createElement('option');
      option.value = acc.id;
      option.textContent = acc.name;
      accountSelect.appendChild(option);
    });

    const amountInput = rootDocument.createElement('input');
    amountInput.type = 'number';
    amountInput.min = '0.01';
    amountInput.step = '0.01';

    const depositBtn = rootDocument.createElement('button');
    depositBtn.textContent = 'Deposit';
    depositBtn.type = 'submit';

    const withdrawBtn = rootDocument.createElement('button');
    withdrawBtn.textContent = 'Withdraw';
    withdrawBtn.type = 'button';

    const message = rootDocument.createElement('div');

    function process(type) {
      const accountId = accountSelect.value;
      const amount = parseFloat(amountInput.value);
      if (!accountId || !amount) return;
      const postings = type === 'deposit'
        ? [
            { accountId: 'cash', type: 'debit', amount },
            { accountId, type: 'credit', amount }
          ]
        : [
            { accountId: 'cash', type: 'credit', amount },
            { accountId, type: 'debit', amount }
          ];
      const entry = new JournalEntry(`txn-${Date.now()}`, `${type} ${accountId}`, postings);
      try {
        ledger.postEntry(entry);
        kpiService.onEntryPosted(entry);
        message.textContent = 'Posted';
      } catch (err) {
        message.textContent = 'Error: ' + err.message;
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      process('deposit');
    });
    withdrawBtn.addEventListener('click', (e) => {
      e.preventDefault();
      process('withdraw');
    });

    form.appendChild(accountSelect);
    form.appendChild(amountInput);
    form.appendChild(depositBtn);
    form.appendChild(withdrawBtn);
    container.appendChild(form);
    container.appendChild(message);
    return container;
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
      createWindow('Transactions', buildTransactionForm());
    }
  });
}

// initialize when DOM is ready
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => initUI());
}
