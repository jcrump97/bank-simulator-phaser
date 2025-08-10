import { CustomerStore, STORAGE_KEY } from '../src/data/CustomerStore.js';

describe('CustomerStore', () => {
  let store;
  beforeEach(() => {
    store = new CustomerStore();
    window.localStorage.clear();
  });

  test('adds and retrieves a customer', () => {
    store.addCustomer({ id: '1', name: 'Alice', accountType: 'checking', balance: 100, transactions: [] });
    const cust = store.getCustomer('1');
    expect(cust.name).toBe('Alice');
  });

  test('persists and loads from localStorage', () => {
    store.addCustomer({ id: '1', name: 'Alice', accountType: 'checking', balance: 100, transactions: [] });
    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();

    const reloaded = new CustomerStore();
    reloaded.load();
    const cust = reloaded.getCustomer('1');
    expect(cust.balance).toBe(100);
  });

  test('adds transaction and updates balance', () => {
    store.addCustomer({ id: '1', name: 'Alice', accountType: 'checking', balance: 100, transactions: [] });
    store.addTransaction('1', { type: 'deposit', amount: 50 });
    const cust = store.getCustomer('1');
    expect(cust.balance).toBe(150);
    expect(cust.transactions.length).toBe(1);
  });
});
