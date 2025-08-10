export const STORAGE_KEY = 'bank-sim-customers';

// Simple in-memory store with localStorage persistence
export class CustomerStore {
  constructor() {
    this.version = 1;
    this.customers = new Map();
  }

  load() {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.version !== this.version) {
        // future: handle migrations
      }
      this.customers = new Map(parsed.customers.map(c => [c.id, c]));
    } catch (e) {
      console.error('Failed to load customers', e);
    }
  }

  save() {
    const customers = Array.from(this.customers.values());
    const payload = { version: this.version, customers };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  addCustomer(customer) {
    if (!customer.id) {
      customer.id = `cust-${Date.now()}`;
    }
    customer.transactions = customer.transactions || [];
    this.customers.set(customer.id, customer);
    this.save();
    return customer;
  }

  getCustomer(id) {
    return this.customers.get(id) || null;
  }

  updateCustomer(id, updates) {
    const existing = this.customers.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.customers.set(id, updated);
    this.save();
    return updated;
  }

  deleteCustomer(id) {
    const result = this.customers.delete(id);
    if (result) this.save();
    return result;
  }

  addTransaction(id, txn) {
    const customer = this.customers.get(id);
    if (!customer) return null;
    txn.id = txn.id || `txn-${Date.now()}`;
    txn.timestamp = txn.timestamp || Date.now();
    customer.transactions = customer.transactions || [];
    switch (txn.type) {
      case 'deposit':
        customer.balance += txn.amount;
        break;
      case 'withdrawal':
        customer.balance -= txn.amount;
        break;
      default:
        break;
    }
    customer.transactions.push(txn);
    this.save();
    return txn;
  }
}

export const customerStore = new CustomerStore();

export function seedSampleCustomers() {
  if (customerStore.customers.size > 0) return;
  customerStore.addCustomer({
    id: 'cust-001',
    name: 'Alice Smith',
    accountType: 'checking',
    balance: 1200.5,
    transactions: []
  });
  customerStore.addCustomer({
    id: 'cust-002',
    name: "Bob's Bakery",
    accountType: 'businessChecking',
    balance: 5000,
    transactions: []
  });
}
