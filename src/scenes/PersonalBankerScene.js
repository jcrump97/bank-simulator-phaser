import Phaser from 'phaser';
import CustomerManager from '../services/CustomerManager.js';
import CustomerDisplay from '../components/CustomerDisplay.js';
import CustomerForm from '../components/CustomerForm.js';

export default class PersonalBankerScene extends Phaser.Scene {
  constructor() {
    super('PersonalBankerScene');
    this.customerManager = null;
    this.currentCustomer = null;
    this.title = null;
    this.customerListDisplay = null;
    this.currentCustomerDisplay = null;
    this.applicationHistory = [];
    this.backButton = null;
    this.resizeTimeout = null;
    
    // UI elements
    this.buttons = [];
    this.customerForm = null;
    this.applicationForm = null;
    this.statsDisplay = null;
    
    // Application types
    this.applicationTypes = [
      { type: 'checking', name: 'Checking Account', requirements: ['18+', 'Valid ID'] },
      { type: 'savings', name: 'Savings Account', requirements: ['18+', 'Valid ID', 'Initial Deposit'] },
      { type: 'loan', name: 'Personal Loan', requirements: ['18+', 'Good Credit', 'Income Verification'] },
      { type: 'cd', name: 'Certificate of Deposit', requirements: ['18+', 'Valid ID', 'Minimum Deposit'] },
      { type: 'business', name: 'Business Account', requirements: ['Business License', 'EIN', 'Articles of Incorporation'] }
    ];
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    
    this.initializeServices();
    this.createUI();
    
    this.reposition(width, height);
    this.scale.on('resize', this.handleResize, this);
  }

  initializeServices() {
    this.customerManager = new CustomerManager();
    
    // Generate some initial customers if none exist
    if (this.customerManager.getAllCustomers().length === 0) {
      this.customerManager.generateCustomerBatch(20);
    }
  }

  createUI() {
    // Create title
    this.title = this.add.text(0, 0, 'Personal Banker Mode', { 
      fontSize: '32px', 
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Create back button
    this.createBackButton();

    // Create action buttons
    this.createActionButtons();

    // Create customer list display
    this.createCustomerListDisplay();

    // Create current customer display area
    this.createCurrentCustomerDisplay();

    // Create application history area
    this.createApplicationHistoryDisplay();

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
      { text: 'Create Customer', action: () => this.showCustomerForm() },
      { text: 'Customer Search', action: () => this.showCustomerSearch() },
      { text: 'New Application', action: () => this.showApplicationForm() },
      { text: 'Review Applications', action: () => this.showApplicationReview() }
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

  createCustomerListDisplay() {
    this.customerListDisplay = this.add.container(0, 0);
    
    // Customer list title
    const listTitle = this.add.text(0, 0, 'Customer Database', {
      fontSize: '20px',
      color: '#ffff00',
      fontStyle: 'bold'
    });
    this.customerListDisplay.add(listTitle);
    
    // Customer count
    this.customerCountText = this.add.text(0, 30, '', {
      fontSize: '16px',
      color: '#cccccc'
    });
    this.customerListDisplay.add(this.customerCountText);
    
    // Customer list container
    this.customerListContainer = this.add.container(0, 60);
    this.customerListDisplay.add(this.customerListContainer);
    
    this.updateCustomerList();
  }

  createCurrentCustomerDisplay() {
    this.currentCustomerDisplay = this.add.container(0, 0);
    
    // Current customer title
    const currentTitle = this.add.text(0, 0, 'Selected Customer', {
      fontSize: '20px',
      color: '#00ff00',
      fontStyle: 'bold'
    });
    this.currentCustomerDisplay.add(currentTitle);
    
    // No customer message
    this.noCustomerText = this.add.text(0, 30, 'No customer selected', {
      fontSize: '16px',
      color: '#cccccc',
      fontStyle: 'italic'
    });
    this.currentCustomerDisplay.add(this.noCustomerText);
    
    // Customer info container
    this.customerInfoContainer = this.add.container(0, 60);
    this.currentCustomerDisplay.add(this.customerInfoContainer);
  }

  createApplicationHistoryDisplay() {
    // Application history title
    const historyTitle = this.add.text(0, 0, 'Application History', {
      fontSize: '18px',
      color: '#00ffff',
      fontStyle: 'bold'
    });
    
    // Application list container
    this.applicationListContainer = this.add.container(0, 30);
    
    // Add to current customer display
    this.currentCustomerDisplay.add([historyTitle, this.applicationListContainer]);
    
    // Show initial "no customer selected" message
    this.showNoCustomerSelected();
  }

  showNoCustomerSelected() {
    if (this.applicationListContainer) {
      const noCustomerText = this.add.text(0, 0, 'No customer selected', {
        fontSize: '14px',
        color: '#cccccc',
        fontStyle: 'italic'
      });
      this.applicationListContainer.add(noCustomerText);
    }
  }

  createStatsDisplay() {
    this.statsDisplay = this.add.container(0, 0);
    
    // Stats title
    const statsTitle = this.add.text(0, 0, 'Banking Statistics', {
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

  updateCustomerList() {
    this.customerListContainer.removeAll();
    
    const customers = this.customerManager.getAllCustomers().slice(0, 8); // Show first 8 customers
    const startY = 0;
    const spacing = 80;
    
    customers.forEach((customer, index) => {
      const customerDisplay = new CustomerDisplay(this, 0, startY + index * spacing, customer);
      customerDisplay.setSelectCallback((selectedCustomer) => {
        this.selectCustomer(selectedCustomer);
      });
      
      this.customerListContainer.add(customerDisplay.container);
    });
    
    // Update customer count
    if (this.customerCountText) {
      this.customerCountText.setText(`Total Customers: ${this.customerManager.getAllCustomers().length}`);
    }
  }

  selectCustomer(customer) {
    this.currentCustomer = customer;
    
    // Clear previous customer display
    this.currentCustomerDisplay.removeAll();
    
    // Re-add the title
    const currentTitle = this.add.text(0, 0, 'Selected Customer', {
      fontSize: '20px',
      color: '#00ff00',
      fontStyle: 'bold'
    });
    this.currentCustomerDisplay.add(currentTitle);
    
    // Re-add containers
    this.customerInfoContainer = this.add.container(0, 60);
    this.applicationListContainer = this.add.container(0, 30);
    
    this.currentCustomerDisplay.add([
      this.customerInfoContainer,
      this.applicationListContainer
    ]);
    
    // Create customer display
    const customerDisplay = new CustomerDisplay(this, 0, 0, customer);
    this.customerInfoContainer.add(customerDisplay.container);
    
    // Add application history title
    const historyTitle = this.add.text(0, 0, 'Application History', {
      fontSize: '18px',
      color: '#00ffff',
      fontStyle: 'bold'
    });
    this.applicationListContainer.add(historyTitle);
    
    // Add application buttons
    this.createApplicationButtons();
    
    // Show application history
    this.showApplicationHistory(customer);
    
    this.showMessage(`Selected customer: ${customer.fullName}`);
  }

  createApplicationButtons() {
    const applicationTypes = this.applicationTypes.filter(type => 
      this.currentCustomer.isEligibleForAccount(type.type)
    );
    
    // Application title
    const appTitle = this.add.text(0, 150, 'Available Applications', {
      fontSize: '18px',
      color: '#00ff00',
      fontStyle: 'bold'
    });
    this.customerInfoContainer.add(appTitle);
    
    applicationTypes.forEach((appType, index) => {
      const button = this.add.text(0, 180 + index * 40, appType.name, {
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#4a5194',
        padding: { x: 10, y: 5 }
      });
      
      button.setInteractive();
      button.on('pointerdown', () => this.startApplication(appType));
      
      this.customerInfoContainer.add(button);
    });
    
    // Show ineligible message if no applications available
    if (applicationTypes.length === 0) {
      const ineligibleText = this.add.text(0, 150, 'No eligible applications', {
        fontSize: '14px',
        color: '#ff0000',
        fontStyle: 'italic'
      });
      this.customerInfoContainer.add(ineligibleText);
    }
  }

  startApplication(appType) {
    if (!this.currentCustomer) {
      this.showMessage('Please select a customer first');
      return;
    }
    
    // Create application
    const application = {
      id: Date.now(),
      customerId: this.currentCustomer.id,
      customerName: this.currentCustomer.fullName,
      type: appType.type,
      name: appType.name,
      requirements: appType.requirements,
      status: 'pending',
      submittedAt: new Date(),
      documents: [],
      notes: ''
    };
    
    // Add to history
    this.applicationHistory.unshift(application);
    this.showApplicationHistory(this.currentCustomer);
    
    // Show application form
    this.showApplicationForm(application);
    
    this.showMessage(`Started ${appType.name} application for ${this.currentCustomer.fullName}`);
  }

  showApplicationForm(application = null) {
    if (!this.currentCustomer) {
      this.showMessage('Please select a customer first');
      return;
    }
    
    // Simple application form using prompts
    const appType = application ? application.type : prompt('Enter application type (checking/savings/loan/cd/business):');
    if (!appType) return;
    
    const amount = prompt('Enter amount (if applicable):');
    const notes = prompt('Enter any additional notes:');
    
    // Create or update application
    if (application) {
      application.amount = amount ? parseFloat(amount) : null;
      application.notes = notes;
      application.status = 'submitted';
    } else {
      const newApplication = {
        id: Date.now(),
        customerId: this.currentCustomer.id,
        customerName: this.currentCustomer.fullName,
        type: appType,
        amount: amount ? parseFloat(amount) : null,
        notes: notes,
        status: 'submitted',
        submittedAt: new Date(),
        documents: [],
        requirements: this.applicationTypes.find(t => t.type === appType)?.requirements || []
      };
      
      this.applicationHistory.unshift(newApplication);
    }
    
    this.showApplicationHistory(this.currentCustomer);
    this.updateStats();
    
    this.showMessage(`Application submitted for ${this.currentCustomer.fullName}`);
  }

  showApplicationReview() {
    if (this.applicationHistory.length === 0) {
      this.showMessage('No applications to review');
      return;
    }
    
    const pendingApps = this.applicationHistory.filter(app => app.status === 'pending' || app.status === 'submitted');
    
    if (pendingApps.length === 0) {
      this.showMessage('No pending applications to review');
      return;
    }
    
    // Simple review interface
    const app = pendingApps[0];
    const action = prompt(`Review application for ${app.customerName} (${app.name})\nStatus: ${app.status}\nNotes: ${app.notes}\n\nAction (approve/deny/request-info):`);
    
    if (action === 'approve') {
      app.status = 'approved';
      this.showMessage(`Application approved for ${app.customerName}`);
    } else if (action === 'deny') {
      app.status = 'denied';
      this.showMessage(`Application denied for ${app.customerName}`);
    } else if (action === 'request-info') {
      app.status = 'pending';
      app.notes += '\n[Additional information requested]';
      this.showMessage(`Information requested for ${app.customerName}`);
    }
    
    this.updateStats();
  }

  showApplicationHistory(customer) {
    if (!this.applicationListContainer) return;
    
    // Remove old application texts (keep the title)
    const children = this.applicationListContainer.getAll();
    const title = children[0]; // Keep the title
    this.applicationListContainer.removeAll();
    this.applicationListContainer.add(title);
    
    const customerApps = this.applicationHistory.filter(app => app.customerId === customer.id);
    
    if (customerApps.length === 0) {
      const noAppsText = this.add.text(0, 30, 'No applications found', {
        fontSize: '14px',
        color: '#cccccc',
        fontStyle: 'italic'
      });
      this.applicationListContainer.add(noAppsText);
      return;
    }
    
    customerApps.forEach((app, index) => {
      const appText = this.add.text(0, 30 + index * 30, 
        `${app.name}: ${app.status}`, {
        fontSize: '12px',
        color: this.getStatusColor(app.status)
      });
      
      this.applicationListContainer.add(appText);
    });
  }

  getStatusColor(status) {
    const colors = {
      'pending': '#ffff00',
      'submitted': '#00ffff',
      'approved': '#00ff00',
      'denied': '#ff0000',
      'request-info': '#ff8800'
    };
    return colors[status] || '#ffffff';
  }

  showCustomerForm() {
    this.customerForm.show();
  }

  onCustomerCreated(customer) {
    this.showMessage(`Created customer: ${customer.fullName}`);
    this.updateCustomerList();
    this.updateStats();
  }

  onCustomerUpdated(customer) {
    this.showMessage(`Updated customer: ${customer.fullName}`);
    this.updateCustomerList();
    this.updateStats();
  }

  showCustomerSearch() {
    const query = prompt('Enter customer name or ID to search:');
    if (query) {
      const results = this.customerManager.searchCustomers(query);
      if (results.length > 0) {
        const customer = results[0];
        this.selectCustomer(customer);
        this.showMessage(`Found: ${customer.fullName} (ID: ${customer.id})`);
      } else {
        this.showMessage('No customers found');
      }
    }
  }

  updateStats() {
    const stats = this.customerManager.getCustomerStats();
    const totalApplications = this.applicationHistory.length;
    const pendingApplications = this.applicationHistory.filter(app => 
      app.status === 'pending' || app.status === 'submitted'
    ).length;
    const approvedApplications = this.applicationHistory.filter(app => 
      app.status === 'approved'
    ).length;
    
    const statsText = `Total Applications: ${totalApplications}\n` +
                     `Pending: ${pendingApplications}\n` +
                     `Approved: ${approvedApplications}\n` +
                     `Total Customers: ${stats.total}\n` +
                     `Average Age: ${Math.round(stats.averageAge)}`;
    
    if (this.statsContent) {
      this.statsContent.setText(statsText);
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

    // Position customer list display (left side)
    if (this.customerListDisplay) {
      this.customerListDisplay.setPosition(marginX, buttonStartY + 120);
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
