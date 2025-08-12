import Account from '../src/models/Account.js';
import AccountManager from '../src/services/AccountManager.js';
import JournalEntry from '../src/models/JournalEntry.js';
import Posting from '../src/models/Posting.js';
import Ledger from '../src/services/Ledger.js';

test('unbalanced journal entry is rejected', () => {
  expect(() => {
    new JournalEntry(null, 'bad', [
      new Posting('cash', 100, 'debit'),
      new Posting('capital', 50, 'credit')
    ]);
  }).toThrow('JournalEntry is not balanced');
});

test('balanced entry posts and persists', () => {
  const am = new AccountManager();
  am.accounts.clear();
  am.accounts.set('cash', new Account('cash', 'Cash', 'asset', 100));
  am.accounts.set('capital', new Account('capital', 'Capital', 'equity', 100));
  const ledger = new Ledger(am);
  const entry = new JournalEntry(null, 'investment', [
    new Posting('cash', 50, 'debit'),
    new Posting('capital', 50, 'credit')
  ]);
  ledger.postEntry(entry);
  expect(am.getAccount('cash').balance).toBe(150);
  expect(ledger.getEntries().length).toBe(1);
});

test('ledger validation prevents imbalance', () => {
  const am = new AccountManager();
  am.accounts.clear();
  am.accounts.set('cash', new Account('cash', 'Cash', 'asset', 100));
  am.accounts.set('capital', new Account('capital', 'Capital', 'equity', 100));
  const ledger = new Ledger(am);
  // force validation failure
  am.validateBalanceSheet = () => ({ isBalanced: false });
  const entry = new JournalEntry(null, 'bad', [
    new Posting('cash', 10, 'debit'),
    new Posting('capital', 10, 'credit')
  ]);
  expect(() => ledger.postEntry(entry)).toThrow('Ledger out of balance');
  expect(am.getAccount('cash').balance).toBe(100);
});
