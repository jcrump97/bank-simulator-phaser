// Simple test to verify the customer system works
import Customer from './src/models/Customer.js';
import CustomerManager from './src/services/CustomerManager.js';

console.log('Testing Customer System...');

// Test Customer creation
const customer = new Customer(1, 'John', 'Doe', 'john.doe@example.com', '(555) 123-4567', '1990-01-01', 'low');
console.log('Created customer:', customer.fullName);
console.log('Customer age:', customer.age);
console.log('Risk profile:', customer.riskProfile);

// Test CustomerManager
const customerManager = new CustomerManager();
console.log('CustomerManager created');

// Generate some random customers
const randomCustomers = customerManager.generateCustomerBatch(5);
console.log('Generated', randomCustomers.length, 'random customers');

// Test customer search
const searchResults = customerManager.searchCustomers('John');
console.log('Search results for "John":', searchResults.length);

// Test customer queue
customerManager.addCustomerToQueue(1);
customerManager.addCustomerToQueue(2);
console.log('Customer queue length:', customerManager.customerQueue.length);

// Test customer stats
const stats = customerManager.getCustomerStats();
console.log('Customer stats:', stats);

console.log('Customer system test completed successfully!');
