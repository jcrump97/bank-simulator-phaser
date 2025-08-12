import Account from '../models/Account.js';

export default class AccountManager {
  constructor() {
    this.accounts = new Map();
    this.initializeDefaultAccounts();
  }

  initializeDefaultAccounts() {
    // Create default chart of accounts
    const defaultAccounts = [
      // Assets
      new Account('cash', 'Cash', 'asset', 10000),
      new Account('checking', 'Checking Accounts', 'asset', 50000),
      new Account('savings', 'Savings Accounts', 'asset', 100000),
      new Account('loans_receivable', 'Loans Receivable', 'asset', 200000),
      
      // Liabilities
      new Account('checking_liability', 'Checking Deposits', 'liability', 50000),
      new Account('savings_liability', 'Savings Deposits', 'liability', 100000),
      new Account('loans_payable', 'Loans Payable', 'liability', 150000),
      
      // Equity
      new Account('capital', 'Capital', 'equity', 100000),
      new Account('retained_earnings', 'Retained Earnings', 'equity', 50000),
      
      // Revenue
      new Account('interest_income', 'Interest Income', 'revenue', 0),
      new Account('fee_income', 'Fee Income', 'revenue', 0),
      
      // Expenses
      new Account('interest_expense', 'Interest Expense', 'expense', 0),
      new Account('operating_expense', 'Operating Expenses', 'expense', 0)
    ];

    defaultAccounts.forEach(account => {
      this.accounts.set(account.id, account);
    });
  }

  createAccount(name, type, initialBalance = 0) {
    const id = this.generateAccountId(name);
    const account = new Account(id, name, type, initialBalance);
    this.accounts.set(id, account);
    return account;
  }

  generateAccountId(name) {
    // Generate a URL-friendly ID from the account name
    const baseId = name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_');
    
    let id = baseId;
    let counter = 1;
    
    while (this.accounts.has(id)) {
      id = `${baseId}_${counter}`;
      counter++;
    }
    
    return id;
  }

  getAccount(id) {
    return this.accounts.get(id);
  }

  getAllAccounts() {
    return Array.from(this.accounts.values());
  }

  getAccountsByType(type) {
    return Array.from(this.accounts.values()).filter(account => account.type === type);
  }

  getAccountBalance(id) {
    const account = this.accounts.get(id);
    return account ? account.getBalance() : 0;
  }

  getTotalAssets() {
    return this.getAccountsByType('asset')
      .reduce((total, account) => total + account.getBalance(), 0);
  }

  getTotalLiabilities() {
    return this.getAccountsByType('liability')
      .reduce((total, account) => total + account.getBalance(), 0);
  }

  getTotalEquity() {
    return this.getAccountsByType('equity')
      .reduce((total, account) => total + account.getBalance(), 0);
  }

  getTotalRevenue() {
    return this.getAccountsByType('revenue')
      .reduce((total, account) => total + account.getBalance(), 0);
  }

  getTotalExpenses() {
    return this.getAccountsByType('expense')
      .reduce((total, account) => total + account.getBalance(), 0);
  }

  getNetIncome() {
    return this.getTotalRevenue() - this.getTotalExpenses();
  }

  validateBalanceSheet() {
    const assets = this.getTotalAssets();
    const liabilities = this.getTotalLiabilities();
    const equity = this.getTotalEquity();
    const netIncome = this.getNetIncome();
    
    const calculatedEquity = assets - liabilities;
    const actualEquity = equity + netIncome;
    
    return {
      isBalanced: Math.abs(calculatedEquity - actualEquity) < 0.01,
      assets,
      liabilities,
      equity,
      netIncome,
      calculatedEquity,
      actualEquity,
      difference: calculatedEquity - actualEquity
    };
  }

  toJSON() {
    const accountsData = {};
    this.accounts.forEach((account, id) => {
      accountsData[id] = account.toJSON();
    });
    
    return {
      accounts: accountsData,
      lastUpdated: new Date().toISOString()
    };
  }

  static fromJSON(data) {
    const accountManager = new AccountManager();
    accountManager.accounts.clear();
    
    Object.entries(data.accounts).forEach(([id, accountData]) => {
      const account = Account.fromJSON(accountData);
      accountManager.accounts.set(id, account);
    });
    
    return accountManager;
  }
}
