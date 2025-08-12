export default class Transaction {
  constructor(id, description, entries = [], timestamp = null) {
    this.id = id;
    this.description = description;
    this.entries = entries;
    this.timestamp = timestamp || new Date();
    this.isPosted = false;
    
    // Validate that entries balance
    this.validate();
  }

  addEntry(accountId, debit = 0, credit = 0) {
    if (debit < 0 || credit < 0) {
      throw new Error('Debit and credit amounts must be non-negative');
    }
    
    if (debit === 0 && credit === 0) {
      throw new Error('At least one of debit or credit must be greater than 0');
    }
    
    if (debit > 0 && credit > 0) {
      throw new Error('An entry cannot have both debit and credit amounts');
    }

    this.entries.push({
      accountId,
      debit,
      credit
    });
    
    this.validate();
  }

  validate() {
    if (this.entries.length < 2) {
      throw new Error('Transaction must have at least 2 entries');
    }

    let totalDebits = 0;
    let totalCredits = 0;

    this.entries.forEach(entry => {
      totalDebits += entry.debit;
      totalCredits += entry.credit;
    });

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      throw new Error(`Transaction does not balance. Debits: ${totalDebits}, Credits: ${totalCredits}`);
    }

    return true;
  }

  post(accountManager) {
    if (this.isPosted) {
      throw new Error('Transaction has already been posted');
    }

    this.validate();

    // Apply the transaction to accounts
    this.entries.forEach(entry => {
      const account = accountManager.getAccount(entry.accountId);
      if (!account) {
        throw new Error(`Account ${entry.accountId} not found`);
      }

      if (entry.debit > 0) {
        account.debit(entry.debit);
      } else if (entry.credit > 0) {
        account.credit(entry.credit);
      }
    });

    this.isPosted = true;
    return true;
  }

  unpost(accountManager) {
    if (!this.isPosted) {
      throw new Error('Transaction has not been posted');
    }

    // Reverse the transaction
    this.entries.forEach(entry => {
      const account = accountManager.getAccount(entry.accountId);
      if (!account) {
        throw new Error(`Account ${entry.accountId} not found`);
      }

      if (entry.debit > 0) {
        account.credit(entry.debit);
      } else if (entry.credit > 0) {
        account.debit(entry.credit);
      }
    });

    this.isPosted = false;
    return true;
  }

  getTotal() {
    return this.entries.reduce((total, entry) => total + entry.debit, 0);
  }

  getFormattedTotal() {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.getTotal());
  }

  toJSON() {
    return {
      id: this.id,
      description: this.description,
      entries: this.entries,
      timestamp: this.timestamp.toISOString(),
      isPosted: this.isPosted
    };
  }

  static fromJSON(data) {
    const transaction = new Transaction(
      data.id,
      data.description,
      data.entries,
      new Date(data.timestamp)
    );
    transaction.isPosted = data.isPosted;
    return transaction;
  }

  static createDeposit(accountId, amount, description = 'Deposit') {
    return new Transaction(
      crypto.randomUUID(),
      description,
      [
        { accountId, debit: amount, credit: 0 },
        { accountId: 'cash', debit: 0, credit: amount }
      ]
    );
  }

  static createWithdrawal(accountId, amount, description = 'Withdrawal') {
    return new Transaction(
      crypto.randomUUID(),
      description,
      [
        { accountId, debit: 0, credit: amount },
        { accountId: 'cash', debit: amount, credit: 0 }
      ]
    );
  }

  static createTransfer(fromAccountId, toAccountId, amount, description = 'Transfer') {
    return new Transaction(
      crypto.randomUUID(),
      description,
      [
        { accountId: fromAccountId, debit: 0, credit: amount },
        { accountId: toAccountId, debit: amount, credit: 0 }
      ]
    );
  }
}
