export default class Account {
  constructor(id, name, type, initialBalance = 0, accountNumber = null) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.balance = initialBalance;
    this.accountNumber = accountNumber || this.generateAccountNumber();
    this.createdAt = new Date();
    this.isActive = true;
  }

  generateAccountNumber() {
    // Generate a simple account number based on type and timestamp
    const typePrefix = {
      'asset': '1',
      'liability': '2', 
      'equity': '3',
      'revenue': '4',
      'expense': '5'
    };
    
    const timestamp = Date.now().toString().slice(-6);
    return `${typePrefix[this.type] || '0'}${timestamp}`;
  }

  debit(amount) {
    if (amount <= 0) throw new Error('Debit amount must be positive');
    
    // Debit increases assets and expenses, decreases liabilities, equity, and revenue
    if (this.type === 'asset' || this.type === 'expense') {
      this.balance += amount;
    } else {
      this.balance -= amount;
    }
    
    return this.balance;
  }

  credit(amount) {
    if (amount <= 0) throw new Error('Credit amount must be positive');
    
    // Credit decreases assets and expenses, increases liabilities, equity, and revenue
    if (this.type === 'asset' || this.type === 'expense') {
      this.balance -= amount;
    } else {
      this.balance += amount;
    }
    
    return this.balance;
  }

  getBalance() {
    return this.balance;
  }

  getFormattedBalance() {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.balance);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      balance: this.balance,
      accountNumber: this.accountNumber,
      createdAt: this.createdAt.toISOString(),
      isActive: this.isActive
    };
  }

  static fromJSON(data) {
    const account = new Account(data.id, data.name, data.type, data.balance, data.accountNumber);
    account.createdAt = new Date(data.createdAt);
    account.isActive = data.isActive;
    return account;
  }
}
