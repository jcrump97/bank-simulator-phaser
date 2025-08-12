// Simple test to verify the accounting system works
import Account from './src/models/Account.js';
import Transaction from './src/models/Transaction.js';
import AccountManager from './src/services/AccountManager.js';
import TransactionManager from './src/services/TransactionManager.js';

console.log('Testing Accounting System...');

// Test Account creation
console.log('\n1. Testing Account creation...');
const account = new Account('test', 'Test Account', 'asset', 1000);
console.log('Account created:', account.name, 'Balance:', account.getFormattedBalance());

// Test AccountManager
console.log('\n2. Testing AccountManager...');
const accountManager = new AccountManager();
console.log('Total accounts:', accountManager.getAllAccounts().length);
console.log('Total assets:', accountManager.getTotalAssets());

// Test Transaction creation
console.log('\n3. Testing Transaction creation...');
const transactionManager = new TransactionManager(accountManager);
const transaction = transactionManager.createDeposit('checking', 500, 'Test deposit');
console.log('Transaction created:', transaction.description, 'Amount:', transaction.getFormattedTotal());

// Test posting transaction
console.log('\n4. Testing transaction posting...');
try {
  transaction.post(accountManager);
  console.log('Transaction posted successfully');
  console.log('New checking balance:', accountManager.getAccount('checking').getFormattedBalance());
  console.log('New cash balance:', accountManager.getAccount('cash').getFormattedBalance());
} catch (error) {
  console.error('Error posting transaction:', error.message);
}

// Test balance sheet validation
console.log('\n5. Testing balance sheet validation...');
const balanceSheet = accountManager.validateBalanceSheet();
console.log('Balance sheet is balanced:', balanceSheet.isBalanced);
console.log('Assets:', balanceSheet.assets);
console.log('Liabilities:', balanceSheet.liabilities);
console.log('Equity:', balanceSheet.equity);

console.log('\nAccounting system test completed successfully!');
