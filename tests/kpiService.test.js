import AccountManager from '../src/services/AccountManager.js';
import Ledger from '../src/services/Ledger.js';
import JournalEntry from '../src/models/JournalEntry.js';
import Posting from '../src/models/Posting.js';
import KPIService from '../src/services/KPIService.js';
import Account from '../src/models/Account.js';

test('updates profit and liquidity after posting', () => {
  const am = new AccountManager();
  am.accounts.clear();
  am.accounts.set('cash', new Account('cash', 'Cash', 'asset', 100));
  am.accounts.set('capital', new Account('capital', 'Capital', 'equity', 100));
  const ledger = new Ledger(am);
  const kpi = new KPIService(am);
  const entry = new JournalEntry(null, 'deposit', [
    new Posting('cash', 100, 'debit'),
    new Posting('capital', 100, 'credit')
  ]);
  ledger.postEntry(entry);
  kpi.onEntryPosted(entry);
  const kpis = kpi.getKPIs();
  expect(kpis.profit).toBe(am.getNetIncome());
  expect(kpis.liquidity).toBe(am.getTotalAssets() - am.getTotalLiabilities());
});
