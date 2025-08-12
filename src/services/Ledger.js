import JournalEntry from '../models/JournalEntry.js';

export default class Ledger {
  constructor(accountManager) {
    this.accountManager = accountManager;
    this.entries = [];
  }

  postEntry(entry) {
    const journalEntry = entry instanceof JournalEntry ? entry : new JournalEntry(entry.id, entry.description, entry.postings, entry.timestamp);
    // Apply postings
    const applied = [];
    journalEntry.postings.forEach(p => {
      const account = this.accountManager.getAccount(p.accountId);
      if (!account) {
        throw new Error(`Account ${p.accountId} not found`);
      }
      if (p.type === 'debit') {
        account.debit(p.amount);
        applied.push({account, amount: p.amount, type: 'debit'});
      } else {
        account.credit(p.amount);
        applied.push({account, amount: p.amount, type: 'credit'});
      }
    });

    const balance = this.accountManager.validateBalanceSheet();
    if (!balance.isBalanced) {
      // revert
      applied.forEach(a => {
        if (a.type === 'debit') {
          a.account.credit(a.amount);
        } else {
          a.account.debit(a.amount);
        }
      });
      throw new Error('Ledger out of balance after posting');
    }

    this.entries.push(journalEntry);
    return journalEntry;
  }

  getEntries() {
    return [...this.entries];
  }

  toJSON() {
    return {
      entries: this.entries.map(e => e.toJSON())
    };
  }

  static fromJSON(data, accountManager) {
    const ledger = new Ledger(accountManager);
    ledger.entries = data.entries.map(e => JournalEntry.fromJSON(e));
    return ledger;
  }
}
