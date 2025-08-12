import Phaser from 'phaser';
import CustomerManager from '../services/CustomerManager.js';
import CustomerDisplay from '../components/CustomerDisplay.js';
import CustomerForm from '../components/CustomerForm.js';

export default class TellerScene extends Phaser.Scene {
  constructor() {
    super('TellerScene');
    this.customerManager = null;
    this.currentCustomer = null;
    this.title = null;
    this.customerQueueDisplay = null;
    this.currentCustomerDisplay = null;
    this.transactionHistory = [];
    this.backButton = null;
    this.resizeTimeout = null;
    
    // UI elements
    this.buttons = [];
    this.customerForm = null;
    this.statsDisplay = null;
    
    // Customer queue management
    this.customerQueue = [];
    this.queueUpdateTimer = null;
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    
    this.initializeServices();
    this.createUI();
    this.startCustomerQueue();
    
    this.reposition(width, height);
    this.scale.on('resize', this.handleResize, this);
  }

  initializeServices() {
    this.customerManager = new CustomerManager();
    
    // Generate some initial customers if none exist
    if (this.customerManager.getAllCustomers().length === 0) {
      this.customerManager.generateCustomerBatch(15);
    }
    
    // Add some customers to the queue
    const customers = this.customerManager.getAllCustomers().slice(0, 5);
    customers.forEach(customer => {
      this.customerManager.addCustomerToQueue(customer.id);
    });
    
    this.customerQueue = this.customerManager.customerQueue;
  }

  createUI() {
    // Create title
    this.title = this.add.text(0, 0, 'Teller Mode', { 
      fontSize: '32px', 
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Create back button
    this.createBackButton();

    // Create action buttons
    this.createActionButtons();

    // Create customer queue display
    this.createCustomerQueueDisplay();

    // Create current customer display area
    this.createCurrentCustomerDisplay();

    // Create transaction history area
    this.createTransactionHistoryDisplay();

    // Create stats display
    this.createStatsDisplay();

    // Create customer form (hidden by default)
    this.customerForm = new CustomerForm(
      this, 
      0, 0, 
      this.customerManager,
      (customer) => this.onCustomerCreated(customer),
      (customer) => this.onCustomerUpdated(customer)
    );
  }

  createBackButton() {
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
  }

  createActionButtons() {
    const buttonData = [
      { text: 'Next Customer', action: () => this.callNextCustomer() },
      { text: 'Create Customer', action: () => this.showCustomerForm() },
      { text: 'Process Transaction', action: () => this.showTransactionDialog() },
      { text: 'Customer Search', action: () => this.showCustomerSearch() }
    ];

    buttonData.forEach((data, index) => {
      const button = this.createButton(0, 0, data.text, data.action);
      this.buttons.push(button);
    });
  }

  createButton(x, y, text, callback) {
    const button = this.add.text(x, y, text, {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#4a5194',
      padding: { x: 15, y: 8 }
    });
    
    button.setInteractive();
    button.on('pointerdown', callback);
    
    return button;
  }

  createCustomerQueueDisplay() {
    this.customerQueueDisplay = this.add.container(0, 0);
    
    // Queue title
    const queueTitle = this.add.text(0, 0, 'Customer Queue', {
      fontSize: '20px',
      color: '#ffff00',
      fontStyle: 'bold'
    });
    this.customerQueueDisplay.add(queueTitle);
    
    // Queue status
    this.queueStatusText = this.add.text(0, 30, '', {
      fontSize: '16px',
      color: '#cccccc'
    });
    this.customerQueueDisplay.add(this.queueStatusText);
  }

  createCurrentCustomerDisplay() {
    this.currentCustomerDisplay = this.add.container(0, 0);
    
    // Current customer title
    const currentTitle = this.add.text(0, 0, 'Current Customer', {
      fontSize: '20px',
      color: '#00ff00',
      fontStyle: 'bold'
    });
    this.currentCustomerDisplay.add(currentTitle);
    
    // No customer message
    this.noCustomerText = this.add.text(0, 30, 'No customer currently being served', {
      fontSize: '16px',
      color: '#cccccc',
      fontStyle: 'italic'
    });
    this.currentCustomerDisplay.add(this.noCustomerText);
    
    // Customer info container
    this.customerInfoContainer = this.add.container(0, 60);
    this.currentCustomerDisplay.add(this.customerInfoContainer);
    
    // Transaction buttons container
    this.transactionButtonsContainer = this.add.container(0, 200);
    this.currentCustomerDisplay.add(this.transactionButtonsContainer);
  }

  createTransactionHistoryDisplay() {
    // Transaction history title
    const historyTitle = this.add.text(0, 0, 'Recent Transactions', {
      fontSize: '18px',
      color: '#00ffff',
      fontStyle: 'bold'
    });
    
    // Transaction list container
    this.transactionListContainer = this.add.container(0, 30);
    
    // Add to current customer display
    this.currentCustomerDisplay.add([historyTitle, this.transactionListContainer]);
  }

  createStatsDisplay() {
    this.statsDisplay = this.add.container(0, 0);
    
    // Stats title
    const statsTitle = this.add.text(0, 0, 'Teller Statistics', {
      fontSize: '18px',
      color: '#ff00ff',
      fontStyle: 'bold'
    });
    this.statsDisplay.add(statsTitle);
    
    // Stats content
    this.statsContent = this.add.text(0, 30, '', {
      fontSize: '14px',
      color: '#ffffff'
    });
    this.statsDisplay.add(this.statsContent);
    
    this.updateStats();
  }

  startCustomerQueue() {
    // Update queue every 5 seconds
    this.queueUpdateTimer = this.time.addEvent({
      delay: 5000,
      callback: this.updateCustomerQueue,
      callbackScope: this,
      loop: true
    });
    
    this.updateCustomerQueue();
  }

  updateCustomerQueue() {
    this.customerQueue = this.customerManager.customerQueue;
    
    // Update queue status
    if (this.queueStatusText) {
      this.queueStatusText.setText(`Customers in queue: ${this.customerQueue.length}`);
    }
    
    // Randomly add new customers to queue
    if (Math.random() < 0.3 && this.customerQueue.length < 8) {
      const customers = this.customerManager.getAllCustomers();
      const availableCustomers = customers.filter(c => !this.customerQueue.includes(c.id));
      
      if (availableCustomers.length > 0) {
        const randomCustomer = availableCustomers[Math.floor(Math.random() * availableCustomers.length)];
        this.customerManager.addCustomerToQueue(randomCustomer.id);
        this.customerQueue = this.customerManager.customerQueue;
      }
    }
  }

  callNextCustomer() {
    if (this.customerQueue.length === 0) {
      this.showMessage('No customers in queue');
      return;
    }

    const customer = this.customerManager.getNextCustomerInQueue();
    if (customer) {
      this.serveCustomer(customer);
    }
  }

  serveCustomer(customer) {
    this.currentCustomer = customer;
    
    // Clear previous customer display
    this.currentCustomerDisplay.removeAll();
    
    // Re-add the title
    const currentTitle = this.add.text(0, 0, 'Current Customer', {
      fontSize: '20px',
      color: '#00ff00',
      fontStyle: 'bold'
    });
    this.currentCustomerDisplay.add(currentTitle);
    
    // Re-add containers
    this.customerInfoContainer = this.add.container(0, 60);
    this.transactionButtonsContainer = this.add.container(0, 200);
    this.transactionListContainer = this.add.container(0, 30);
    
    this.currentCustomerDisplay.add([
      this.customerInfoContainer,
      this.transactionButtonsContainer,
      this.transactionListContainer
    ]);
    
    // Create customer display
    const customerDisplay = new CustomerDisplay(this, 0, 0, customer);
    this.customerInfoContainer.add(customerDisplay.container);
    
    // Add transaction history title
    const historyTitle = this.add.text(0, 0, 'Recent Transactions', {
      fontSize: '18px',
      color: '#00ffff',
      fontStyle: 'bold'
    });
    this.transactionListContainer.add(historyTitle);
    
    // Add transaction buttons
    this.createTransactionButtons();
    
    // Show application history
    this.showApplicationHistory(customer);
    
    // Update queue
    this.updateCustomerQueue();
    
    this.showMessage(`Now serving: ${customer.fullName}`);
  }

  createTransactionButtons() {
    const transactionTypes = [
      { text: 'Deposit', type: 'deposit' },
      { text: 'Withdrawal', type: 'withdrawal' },
      { text: 'Transfer', type: 'transfer' },
      { text: 'Balance Inquiry', type: 'inquiry' }
    ];

    transactionTypes.forEach((data, index) => {
      const button = this.add.text(0, index * 40, data.text, {
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#4a5194',
        padding: { x: 10, y: 5 }
      });
      
      button.setInteractive();
      button.on('pointerdown', () => this.processTransaction(data.type));
      
      this.transactionButtonsContainer.add(button);
    });
  }

  processTransaction(type) {
    if (!this.currentCustomer) {
      this.showMessage('No customer to serve');
      return;
    }

    let amount = 0;
    let description = '';

    switch (type) {
      case 'deposit':
        amount = Math.floor(Math.random() * 1000) + 100;
        description = `Deposit of $${amount}`;
        break;
      case 'withdrawal':
        amount = Math.floor(Math.random() * 500) + 50;
        description = `Withdrawal of $${amount}`;
        break;
      case 'transfer':
        amount = Math.floor(Math.random() * 800) + 100;
        description = `Transfer of $${amount}`;
        break;
      case 'inquiry':
        amount = null;
        description = 'Balance inquiry';
        break;
    }

    // Add interaction to customer
    this.currentCustomer.addInteraction(type, description, amount);
    
    // Add to transaction history
    this.addTransactionToHistory(type, description, amount);
    
    // Update stats
    this.updateStats();
    
    this.showMessage(`Processed: ${description}`);
  }

  showApplicationHistory(customer) {
    // This method will show customer's transaction history
    // For now, we'll show a placeholder
    if (this.transactionListContainer) {
      const noTransactionsText = this.add.text(0, 30, `No transactions for ${customer.fullName}`, {
        fontSize: '14px',
        color: '#cccccc',
        fontStyle: 'italic'
      });
      this.transactionListContainer.add(noTransactionsText);
    }
  }

  addTransactionToHistory(type, description, amount) {
    const transaction = {
      id: Date.now(),
      type,
      description,
      amount,
      customer: this.currentCustomer.fullName,
      timestamp: new Date()
    };
    
    this.transactionHistory.unshift(transaction);
    
    // Keep only last 10 transactions
    if (this.transactionHistory.length > 10) {
      this.transactionHistory = this.transactionHistory.slice(0, 10);
    }
    
    this.updateTransactionHistoryDisplay();
  }

  updateTransactionHistoryDisplay() {
    if (!this.transactionListContainer) return;
    
    // Remove old transaction texts (keep the title)
    const children = this.transactionListContainer.getAll();
    const title = children[0]; // Keep the title
    this.transactionListContainer.removeAll();
    this.transactionListContainer.add(title);
    
    this.transactionHistory.forEach((transaction, index) => {
      const transactionText = this.add.text(0, 30 + index * 25, 
        `${transaction.customer}: ${transaction.description}`, {
        fontSize: '12px',
        color: '#ffffff'
      });
      
      this.transactionListContainer.add(transactionText);
    });
  }

  updateStats() {
    const stats = this.customerManager.getCustomerStats();
    const totalTransactions = this.transactionHistory.length;
    
    const statsText = `Customers Served: ${totalTransactions}\n` +
                     `Queue Length: ${stats.queueLength}\n` +
                     `Total Customers: ${stats.total}\n` +
                     `Average Age: ${Math.round(stats.averageAge)}`;
    
    if (this.statsContent) {
      this.statsContent.setText(statsText);
    }
  }

  showCustomerForm() {
    this.customerForm.show();
  }

  onCustomerCreated(customer) {
    this.showMessage(`Created customer: ${customer.fullName}`);
    this.updateStats();
  }

  onCustomerUpdated(customer) {
    this.showMessage(`Updated customer: ${customer.fullName}`);
    this.updateStats();
  }

  showTransactionDialog() {
    if (!this.currentCustomer) {
      this.showMessage('Please call a customer first');
      return;
    }
    
    // Simple transaction dialog
    const amount = prompt(`Enter transaction amount for ${this.currentCustomer.fullName}:`);
    if (amount && !isNaN(amount)) {
      const type = prompt('Enter transaction type (deposit/withdrawal/transfer):');
      if (type && ['deposit', 'withdrawal', 'transfer'].includes(type)) {
        this.processTransaction(type, parseFloat(amount));
      }
    }
  }

  showCustomerSearch() {
    const query = prompt('Enter customer name or ID to search:');
    if (query) {
      const results = this.customerManager.searchCustomers(query);
      if (results.length > 0) {
        const customer = results[0];
        this.showMessage(`Found: ${customer.fullName} (ID: ${customer.id})`);
      } else {
        this.showMessage('No customers found');
      }
    }
  }

  showMessage(message) {
    const messageText = this.add.text(this.scale.width / 2, this.scale.height / 2, message, {
      fontSize: '18px',
      color: '#00ff00',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);
    
    // Auto-remove after 3 seconds
    this.time.delayedCall(3000, () => {
      messageText.destroy();
    });
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

  reposition(width, height) {
    const marginX = width * 0.02;
    const marginY = height * 0.02;
    const centerX = width / 2;

    // Position title
    if (this.title) {
      this.title.setPosition(centerX, marginY + 20);
    }

    // Position back button
    if (this.backButton) {
      this.backButton.setPosition(marginX, marginY);
    }

    // Position action buttons
    const buttonStartY = marginY + 80;
    const buttonSpacing = 150;
    this.buttons.forEach((button, index) => {
      button.setPosition(marginX + index * buttonSpacing, buttonStartY);
    });

    // Position customer queue display (left side)
    if (this.customerQueueDisplay) {
      this.customerQueueDisplay.setPosition(marginX, buttonStartY + 120);
    }

    // Position current customer display (center)
    if (this.currentCustomerDisplay) {
      this.currentCustomerDisplay.setPosition(centerX - 100, buttonStartY + 120);
    }

    // Position stats display (right side)
    if (this.statsDisplay) {
      this.statsDisplay.setPosition(width - marginX - 200, buttonStartY + 120);
    }

    // Position customer form
    if (this.customerForm) {
      this.customerForm.updatePosition(centerX, height / 2);
    }
  }

  resize(gameSize) {
    this.reposition(gameSize.width, gameSize.height);
  }

  // Clean up resources when scene is destroyed
  shutdown() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
    
    if (this.queueUpdateTimer) {
      this.queueUpdateTimer.destroy();
    }
    
    // Remove resize event listener
    if (this.scale) {
      this.scale.off('resize', this.handleResize, this);
    }
    
    // Destroy customer form
    if (this.customerForm) {
      this.customerForm.destroy();
    }
  }
}
