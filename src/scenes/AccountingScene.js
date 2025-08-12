import Phaser from 'phaser';
import AccountManager from '../services/AccountManager.js';
import TransactionManager from '../services/TransactionManager.js';
import StorageService from '../services/StorageService.js';
import TransactionCard from '../components/TransactionCard.js';
import AccountDisplay from '../components/AccountDisplay.js';
import TransactionForm from '../components/TransactionForm.js';

export default class AccountingScene extends Phaser.Scene {
  constructor() {
    super('AccountingScene');
    this.accountManager = null;
    this.transactionManager = null;
    this.storageService = null;
    
    // UI elements
    this.title = null;
    this.accountsContainer = null;
    this.transactionsContainer = null;
    this.balanceSheetContainer = null;
    this.buttons = [];
    this.transactionForm = null;
    
    // Data
    this.accounts = [];
    this.transactions = [];
    this.selectedAccount = null;
    this.accountDisplays = [];
    this.transactionCards = [];
    
    // UI state
    this.currentView = 'accounts'; // 'accounts', 'transactions', 'balance_sheet'
    
    // Add debouncing for resize events
    this.resizeTimeout = null;
  }

  create() {
    this.initializeServices();
    this.loadData();
    this.createUI();
    this.updateDisplay();
    
    // Handle resize with debouncing
    this.scale.on('resize', this.handleResize, this);
  }

  // Debounced resize handler to prevent excessive repositioning
  handleResize(gameSize) {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    this.resizeTimeout = setTimeout(() => {
      this.resize(gameSize);
    }, 100); // 100ms debounce delay
  }

  initializeServices() {
    this.storageService = new StorageService();
    this.accountManager = new AccountManager();
    this.transactionManager = new TransactionManager(this.accountManager);
  }

  loadData() {
    const savedData = this.storageService.loadData();
    if (savedData) {
      this.accountManager = AccountManager.fromJSON(savedData.accounts);
      this.transactionManager = TransactionManager.fromJSON(savedData.transactions, this.accountManager);
    }
    
    this.accounts = this.accountManager.getAllAccounts();
    this.transactions = this.transactionManager.getAllTransactions();
  }

  saveData() {
    const dataToSave = {
      accounts: this.accountManager.toJSON(),
      transactions: this.transactionManager.toJSON()
    };
    
    this.storageService.saveData(dataToSave);
  }

  createUI() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Create title
    this.title = this.add.text(0, 0, 'Accounting System', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Create back button
    this.backButton = this.add.text(0, 0, '← Back to Menu', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#4a5194',
      padding: { x: 10, y: 5 }
    });
    
    this.backButton.setInteractive();
    this.backButton.on('pointerdown', () => {
      this.scene.start('BootScene');
    });

    // Create navigation buttons
    this.createNavigationButtons();
    
    // Create main content containers
    this.createAccountsContainer();
    this.createTransactionsContainer();
    this.createBalanceSheetContainer();
    
    // Create action buttons
    this.createActionButtons();
    
    // Create transaction form
    this.transactionForm = new TransactionForm(this, 0, 0, this.accountManager, (transaction) => {
      this.onTransactionCreated(transaction);
    });
    
    // Position everything
    this.repositionUI(width, height);
  }

  createNavigationButtons() {
    const buttonData = [
      { text: 'Accounts', view: 'accounts' },
      { text: 'Transactions', view: 'transactions' },
      { text: 'Balance Sheet', view: 'balance_sheet' }
    ];

    buttonData.forEach((data, index) => {
      const button = this.createButton(0, 0, data.text, () => {
        this.switchView(data.view);
      });
      this.buttons.push(button);
    });
  }

  createButton(x, y, text, callback) {
    const button = this.add.container(x, y);
    
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    const padding = 20;
    const buttonWidth = buttonText.width + padding;
    const buttonHeight = buttonText.height + padding;

    const background = this.add.graphics();
    background.fillStyle(0x4a5194, 1);
    background.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 8);

    const hitArea = new Phaser.Geom.Rectangle(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight);
    background.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    background.on('pointerover', () => {
      background.clear();
      background.fillStyle(0x5b63b0, 1);
      background.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 8);
    });

    background.on('pointerout', () => {
      background.clear();
      background.fillStyle(0x4a5194, 1);
      background.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 8);
    });

    background.on('pointerdown', callback);

    button.add([background, buttonText]);
    return button;
  }

  createAccountsContainer() {
    this.accountsContainer = this.add.container(0, 0);
    this.accountsContainer.setVisible(false);
  }

  createTransactionsContainer() {
    this.transactionsContainer = this.add.container(0, 0);
    this.transactionsContainer.setVisible(false);
  }

  createBalanceSheetContainer() {
    this.balanceSheetContainer = this.add.container(0, 0);
    this.balanceSheetContainer.setVisible(false);
  }

  createActionButtons() {
    const actionButtonData = [
      { text: 'New Account', action: () => this.showNewAccountDialog() },
      { text: 'New Transaction', action: () => this.showTransactionForm() },
      { text: 'Export Data', action: () => this.exportData() },
      { text: 'Import Data', action: () => this.importData() }
    ];

    actionButtonData.forEach((data, index) => {
      const button = this.createButton(0, 0, data.text, data.action);
      this.buttons.push(button);
    });
  }

  switchView(view) {
    this.currentView = view;
    
    // Hide all containers
    this.accountsContainer.setVisible(false);
    this.transactionsContainer.setVisible(false);
    this.balanceSheetContainer.setVisible(false);
    
    // Show selected container and update display
    switch (view) {
      case 'accounts':
        this.accountsContainer.setVisible(true);
        this.displayAccounts();
        break;
      case 'transactions':
        this.transactionsContainer.setVisible(true);
        this.displayTransactions();
        break;
      case 'balance_sheet':
        this.balanceSheetContainer.setVisible(true);
        this.displayBalanceSheet();
        break;
    }
  }

  displayAccounts() {
    this.accountsContainer.removeAll();
    this.accountDisplays.forEach(display => display.destroy());
    this.accountDisplays = [];
    
    const accounts = this.accountManager.getAllAccounts();
    const startY = 100;
    const spacing = 80;
    
    accounts.forEach((account, index) => {
      const accountDisplay = new AccountDisplay(this, 0, startY + index * spacing, account, false);
      accountDisplay.setSelectCallback((selectedAccount) => {
        this.selectAccount(selectedAccount);
      });
      
      this.accountsContainer.add(accountDisplay.container);
      this.accountDisplays.push(accountDisplay);
    });
  }



  selectAccount(account) {
    // Deselect previous account
    if (this.selectedAccount) {
      const prevDisplay = this.accountDisplays.find(d => d.account.id === this.selectedAccount.id);
      if (prevDisplay) {
        prevDisplay.setSelected(false);
      }
    }
    
    this.selectedAccount = account;
    
    // Select new account
    const newDisplay = this.accountDisplays.find(d => d.account.id === account.id);
    if (newDisplay) {
      newDisplay.setSelected(true);
    }
    
    // Show transactions for selected account
    this.displayTransactionsForAccount(account);
  }

  displayTransactions() {
    this.transactionsContainer.removeAll();
    this.transactionCards.forEach(card => card.destroy());
    this.transactionCards = [];
    
    const transactions = this.transactionManager.getAllTransactions();
    const startY = 100;
    const spacing = 120;
    
    transactions.forEach((transaction, index) => {
      const transactionCard = new TransactionCard(this, 0, startY + index * spacing, transaction, this.accountManager);
      this.transactionsContainer.add(transactionCard.container);
      this.transactionCards.push(transactionCard);
    });
  }



  displayTransactionsForAccount(account) {
    this.transactionsContainer.removeAll();
    this.transactionCards.forEach(card => card.destroy());
    this.transactionCards = [];
    
    const transactions = this.transactionManager.getTransactionsByAccount(account.id);
    const startY = 100;
    const spacing = 120;
    
    if (transactions.length === 0) {
      const noTransactionsText = this.add.text(0, startY, `No transactions for ${account.name}`, {
        fontSize: '18px',
        color: '#cccccc',
        fontStyle: 'italic'
      });
      this.transactionsContainer.add(noTransactionsText);
      return;
    }
    
    transactions.forEach((transaction, index) => {
      const transactionCard = new TransactionCard(this, 0, startY + index * spacing, transaction, this.accountManager);
      this.transactionsContainer.add(transactionCard.container);
      this.transactionCards.push(transactionCard);
    });
  }

  displayBalanceSheet() {
    this.balanceSheetContainer.removeAll();
    
    const balanceSheet = this.accountManager.validateBalanceSheet();
    const startY = 100;
    const spacing = 40;
    
    const sections = [
      { title: 'ASSETS', accounts: this.accountManager.getAccountsByType('asset'), total: balanceSheet.assets },
      { title: 'LIABILITIES', accounts: this.accountManager.getAccountsByType('liability'), total: balanceSheet.liabilities },
      { title: 'EQUITY', accounts: this.accountManager.getAccountsByType('equity'), total: balanceSheet.equity },
      { title: 'REVENUE', accounts: this.accountManager.getAccountsByType('revenue'), total: balanceSheet.revenue },
      { title: 'EXPENSES', accounts: this.accountManager.getAccountsByType('expense'), total: balanceSheet.expenses }
    ];
    
    let currentY = startY;
    
    sections.forEach(section => {
      // Section header
      const headerText = this.add.text(0, currentY, section.title, {
        fontSize: '18px',
        color: '#ffff00',
        fontStyle: 'bold'
      });
      this.balanceSheetContainer.add(headerText);
      currentY += spacing;
      
      // Section accounts
      section.accounts.forEach(account => {
        const accountText = this.add.text(50, currentY, account.name, {
          fontSize: '14px',
          color: '#ffffff'
        });
        
        const balanceText = this.add.text(300, currentY, account.getFormattedBalance(), {
          fontSize: '14px',
          color: this.getAccountTypeColorFromAccount(account)
        });
        
        this.balanceSheetContainer.add([accountText, balanceText]);
        currentY += 25;
      });
      
      // Section total
      const totalText = this.add.text(0, currentY, `Total ${section.title}: ${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(section.total)}`, {
        fontSize: '16px',
        color: '#00ff00',
        fontStyle: 'bold'
      });
      this.balanceSheetContainer.add(totalText);
      currentY += spacing + 20;
    });
    
    // Net Income
    const netIncomeText = this.add.text(0, currentY, `Net Income: ${new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(balanceSheet.netIncome)}`, {
      fontSize: '18px',
      color: balanceSheet.netIncome >= 0 ? '#00ff00' : '#ff0000',
      fontStyle: 'bold'
    });
    this.balanceSheetContainer.add(netIncomeText);
  }

  showNewAccountDialog() {
    // Simple prompt for now - could be enhanced with a proper UI
    const name = prompt('Enter account name:');
    if (name) {
      const type = prompt('Enter account type (asset/liability/equity/revenue/expense):');
      if (type && ['asset', 'liability', 'equity', 'revenue', 'expense'].includes(type)) {
        const initialBalance = parseFloat(prompt('Enter initial balance (0):')) || 0;
        
        const account = this.accountManager.createAccount(name, type, initialBalance);
        this.accounts.push(account);
        this.saveData();
        this.updateDisplay();
      }
    }
  }

  showTransactionForm() {
    this.transactionForm.show();
  }

  onTransactionCreated(transaction) {
    this.transactions.push(transaction);
    this.saveData();
    this.updateDisplay();
    
    // Show success message
    this.showSuccessMessage('Transaction created successfully!');
  }

  showSuccessMessage(message) {
    const successText = this.add.text(this.scale.width / 2, this.scale.height / 2, message, {
      fontSize: '24px',
      color: '#00ff00',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Auto-remove after 3 seconds
    this.time.delayedCall(3000, () => {
      successText.destroy();
    });
  }

  getAccountTypeColorFromAccount(account) {
    const colors = {
      'asset': '#00ff00',
      'liability': '#ff0000',
      'equity': '#ffff00',
      'revenue': '#00ffff',
      'expense': '#ff00ff'
    };
    return colors[account.type] || '#ffffff';
  }

  exportData() {
    const dataToExport = {
      accounts: this.accountManager.toJSON(),
      transactions: this.transactionManager.toJSON()
    };
    
    this.storageService.exportData(dataToExport);
  }

  importData() {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        this.storageService.importData(file).then((importedData) => {
          this.accountManager = AccountManager.fromJSON(importedData.accounts);
          this.transactionManager = TransactionManager.fromJSON(importedData.transactions, this.accountManager);
          
          this.accounts = this.accountManager.getAllAccounts();
          this.transactions = this.transactionManager.getAllTransactions();
          
          this.updateDisplay();
          alert('Data imported successfully!');
        }).catch((error) => {
          alert('Import failed: ' + error.message);
        });
      }
    };
    
    input.click();
  }

  updateDisplay() {
    this.accounts = this.accountManager.getAllAccounts();
    this.transactions = this.transactionManager.getAllTransactions();
    
    if (this.currentView === 'accounts') {
      this.displayAccounts();
    } else if (this.currentView === 'transactions') {
      this.displayTransactions();
    } else if (this.currentView === 'balance_sheet') {
      this.displayBalanceSheet();
    }
  }

  repositionUI(width, height) {
    const centerX = width / 2;
    const titleY = height * 0.1;
    const navStartY = height * 0.2;
    const navSpacing = 120;
    const actionStartY = height * 0.8;
    const actionSpacing = 120;

    // Position title
    if (this.title) {
      this.title.setPosition(centerX, titleY);
    }

    // Position back button
    if (this.backButton) {
      this.backButton.setPosition(50, 30);
    }

    // Position navigation buttons
    this.buttons.slice(0, 3).forEach((button, index) => {
      button.setPosition(centerX - navSpacing + index * navSpacing, navStartY);
    });

    // Position action buttons
    this.buttons.slice(3).forEach((button, index) => {
      button.setPosition(centerX - actionSpacing + index * actionSpacing, actionStartY);
    });

    // Position containers
    const containerY = height * 0.35;
    this.accountsContainer.setPosition(centerX - 200, containerY);
    this.transactionsContainer.setPosition(centerX - 200, containerY);
    this.balanceSheetContainer.setPosition(centerX - 200, containerY);
  }

  resize(gameSize) {
    this.repositionUI(gameSize.width, gameSize.height);
  }

  // Clean up resources when scene is destroyed
  shutdown() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
    
    // Remove resize event listener
    if (this.scale) {
      this.scale.off('resize', this.handleResize, this);
    }
  }
}
