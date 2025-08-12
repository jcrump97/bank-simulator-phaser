import JournalEntry from '../models/JournalEntry.js';
import Posting from '../models/Posting.js';

export default class InterestAccrualService {
  constructor(accountManager, ledger) {
    this.accountManager = accountManager;
    this.ledger = ledger;
    this.accounts = [];
  }

  registerAccount(accountId, rate) {
    this.accounts.push({ accountId, rate });
  }

  accrueDailyInterest() {
    this.accounts.forEach(({ accountId, rate }) => {
      const account = this.accountManager.getAccount(accountId);
      if (!account) return;
      const interest = account.balance * rate / 365;
      if (interest <= 0) return;
      const entry = new JournalEntry(null, `Interest accrual for ${accountId}`, [
        new Posting(accountId, interest, 'credit'),
        new Posting('interest_expense', interest, 'debit')
      ]);
      this.ledger.postEntry(entry);
    });
  }
}
