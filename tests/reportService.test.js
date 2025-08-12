import AccountManager from '../src/services/AccountManager.js';
import { generateTrialBalance } from '../src/services/ReportService.js';
import Account from '../src/models/Account.js';

test('trial balance is balanced', () => {
  const am = new AccountManager();
  am.accounts.clear();
  am.accounts.set('cash', new Account('cash', 'Cash', 'asset', 100));
  am.accounts.set('capital', new Account('capital', 'Capital', 'equity', 100));
  const report = generateTrialBalance(am);
  expect(report.balanced).toBe(true);
  expect(report.totalDebit).toBeCloseTo(report.totalCredit, 2);
});
