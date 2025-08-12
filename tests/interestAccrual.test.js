import Account from '../src/models/Account.js';
import DepositAccount from '../src/models/DepositAccount.js';
import AccountManager from '../src/services/AccountManager.js';
import Ledger from '../src/services/Ledger.js';
import InterestAccrualService from '../src/services/InterestAccrualService.js';

test('interest accrual posts balanced journal entry', () => {
  const am = new AccountManager();
  am.accounts.clear();
  am.accounts.set('cash', new Account('cash', 'Cash', 'asset', 1000));
  am.accounts.set('capital', new Account('capital', 'Capital', 'equity', 0));
  am.accounts.set('savings', new DepositAccount('savings', 'Savings Deposits', 'liability', 1000, 0.365));
  am.accounts.set('interest_expense', new Account('interest_expense', 'Interest Expense', 'expense', 0));
  const ledger = new Ledger(am);
  const service = new InterestAccrualService(am, ledger);
  service.registerAccount('savings', 0.365);
  service.accrueDailyInterest();
  expect(am.getAccount('savings').balance).toBeCloseTo(1001);
  expect(am.getAccount('interest_expense').balance).toBeCloseTo(1);
  expect(ledger.getEntries().length).toBe(1);
});
