import Transaction from '../models/Transaction.js';

export default class TransactionManager {
  constructor(accountManager) {
    this.accountManager = accountManager;
    this.transactions = [];
    this.nextTransactionId = 1;
  }

  createTransaction(description, entries) {
    const transaction = new Transaction(
      this.generateTransactionId(),
      description,
      entries
    );
    
    this.transactions.push(transaction);
    return transaction;
  }

  generateTransactionId() {
    return `TXN-${Date.now()}-${this.nextTransactionId++}`;
  }

  postTransaction(transactionId) {
    const transaction = this.transactions.find(t => t.id === transactionId);
    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    return transaction.post(this.accountManager);
  }

  unpostTransaction(transactionId) {
    const transaction = this.transactions.find(t => t.id === transactionId);
    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    return transaction.unpost(this.accountManager);
  }

  deleteTransaction(transactionId) {
    const index = this.transactions.findIndex(t => t.id === transactionId);
    if (index === -1) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    const transaction = this.transactions[index];
    if (transaction.isPosted) {
      throw new Error('Cannot delete posted transaction. Unpost it first.');
    }

    this.transactions.splice(index, 1);
    return true;
  }

  getTransaction(transactionId) {
    return this.transactions.find(t => t.id === transactionId);
  }

  getAllTransactions() {
    return [...this.transactions];
  }

  getTransactionsByAccount(accountId) {
    return this.transactions.filter(transaction => 
      transaction.entries.some(entry => entry.accountId === accountId)
    );
  }

  getTransactionsByDateRange(startDate, endDate) {
    return this.transactions.filter(transaction => 
      transaction.timestamp >= startDate && transaction.timestamp <= endDate
    );
  }

  getPostedTransactions() {
    return this.transactions.filter(t => t.isPosted);
  }

  getUnpostedTransactions() {
    return this.transactions.filter(t => !t.isPosted);
  }

  // Convenience methods for common transaction types
  createDeposit(accountId, amount, description = 'Deposit') {
    const transaction = Transaction.createDeposit(accountId, amount, description);
    this.transactions.push(transaction);
    return transaction;
  }

  createWithdrawal(accountId, amount, description = 'Withdrawal') {
    const transaction = Transaction.createWithdrawal(accountId, amount, description);
    this.transactions.push(transaction);
    return transaction;
  }

  createTransfer(fromAccountId, toAccountId, amount, description = 'Transfer') {
    const transaction = Transaction.createTransfer(fromAccountId, toAccountId, amount, description);
    this.transactions.push(transaction);
    return transaction;
  }

  createLoan(accountId, amount, description = 'Loan') {
    const transaction = new Transaction(
      this.generateTransactionId(),
      description,
      [
        { accountId, debit: amount, credit: 0 },
        { accountId: 'loans_payable', debit: 0, credit: amount }
      ]
    );
    
    this.transactions.push(transaction);
    return transaction;
  }

  createInterestTransaction(accountId, amount, isIncome = true, description = 'Interest') {
    const transaction = new Transaction(
      this.generateTransactionId(),
      description,
      [
        { accountId, debit: isIncome ? 0 : amount, credit: isIncome ? amount : 0 },
        { accountId: isIncome ? 'interest_income' : 'interest_expense', debit: isIncome ? amount : 0, credit: isIncome ? 0 : amount }
      ]
    );
    
    this.transactions.push(transaction);
    return transaction;
  }

  // Batch operations
  postAllUnpostedTransactions() {
    const unposted = this.getUnpostedTransactions();
    const results = [];
    
    unposted.forEach(transaction => {
      try {
        transaction.post(this.accountManager);
        results.push({ transaction, success: true });
      } catch (error) {
        results.push({ transaction, success: false, error: error.message });
      }
    });
    
    return results;
  }

  // Validation and reporting
  validateAllTransactions() {
    const results = [];
    
    this.transactions.forEach(transaction => {
      try {
        transaction.validate();
        results.push({ transaction, valid: true });
      } catch (error) {
        results.push({ transaction, valid: false, error: error.message });
      }
    });
    
    return results;
  }

  getTransactionSummary() {
    const totalTransactions = this.transactions.length;
    const postedTransactions = this.getPostedTransactions().length;
    const unpostedTransactions = this.getUnpostedTransactions().length;
    
    const totalVolume = this.transactions.reduce((total, t) => total + t.getTotal(), 0);
    
    return {
      totalTransactions,
      postedTransactions,
      unpostedTransactions,
      totalVolume,
      formattedTotalVolume: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(totalVolume)
    };
  }

  toJSON() {
    return {
      transactions: this.transactions.map(t => t.toJSON()),
      nextTransactionId: this.nextTransactionId,
      lastUpdated: new Date().toISOString()
    };
  }

  static fromJSON(data, accountManager) {
    const transactionManager = new TransactionManager(accountManager);
    
    transactionManager.transactions = data.transactions.map(t => Transaction.fromJSON(t));
    transactionManager.nextTransactionId = data.nextTransactionId || 1;
    
    return transactionManager;
  }
}
