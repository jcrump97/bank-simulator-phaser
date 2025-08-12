import Phaser from 'phaser';

export default class TransactionForm {
  constructor(scene, x, y, accountManager, onTransactionCreated) {
    this.scene = scene;
    this.accountManager = accountManager;
    this.onTransactionCreated = onTransactionCreated;
    this.container = scene.add.container(x, y);
    
    this.entries = [];
    this.createForm();
  }

  createForm() {
    const formWidth = 600;
    const formHeight = 500;
    
    // Form background
    const background = this.scene.add.graphics();
    background.fillStyle(0x1a1e36, 0.95);
    background.fillRoundedRect(-formWidth/2, -formHeight/2, formWidth, formHeight, 10);
    background.lineStyle(3, 0x4a5194, 1);
    background.strokeRoundedRect(-formWidth/2, -formHeight/2, formWidth, formHeight, 10);
    
    // Title
    const title = this.scene.add.text(0, -formHeight/2 + 30, 'Create New Transaction', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Description input
    const descLabel = this.scene.add.text(-formWidth/2 + 30, -formHeight/2 + 80, 'Description:', {
      fontSize: '16px',
      color: '#ffffff'
    });
    
    const descInput = this.createInputField(-formWidth/2 + 150, -formHeight/2 + 80, 300, 'Enter transaction description');
    this.descriptionInput = descInput;
    
    // Amount input
    const amountLabel = this.scene.add.text(-formWidth/2 + 30, -formHeight/2 + 130, 'Amount:', {
      fontSize: '16px',
      color: '#ffffff'
    });
    
    const amountInput = this.createInputField(-formWidth/2 + 150, -formHeight/2 + 130, 150, '0.00');
    this.amountInput = amountInput;
    
    // Transaction type selector
    const typeLabel = this.scene.add.text(-formWidth/2 + 30, -formHeight/2 + 180, 'Type:', {
      fontSize: '16px',
      color: '#ffffff'
    });
    
    const typeSelector = this.createTypeSelector(-formWidth/2 + 150, -formHeight/2 + 180);
    this.typeSelector = typeSelector;
    
    // Account selector
    const accountLabel = this.scene.add.text(-formWidth/2 + 30, -formHeight/2 + 230, 'Account:', {
      fontSize: '16px',
      color: '#ffffff'
    });
    
    const accountSelector = this.createAccountSelector(-formWidth/2 + 150, -formHeight/2 + 230);
    this.accountSelector = accountSelector;
    
    // Second account selector (for transfers)
    const account2Label = this.scene.add.text(-formWidth/2 + 30, -formHeight/2 + 280, 'To Account:', {
      fontSize: '16px',
      color: '#ffffff'
    });
    account2Label.setVisible(false);
    
    const account2Selector = this.createAccountSelector(-formWidth/2 + 150, -formHeight/2 + 280);
    this.account2Selector = account2Selector;
    account2Selector.setVisible(false);
    
    // Preview section
    const previewLabel = this.scene.add.text(-formWidth/2 + 30, -formHeight/2 + 330, 'Preview:', {
      fontSize: '16px',
      color: '#ffff00',
      fontStyle: 'bold'
    });
    
    this.previewText = this.scene.add.text(-formWidth/2 + 30, -formHeight/2 + 360, '', {
      fontSize: '14px',
      color: '#cccccc'
    });
    
    // Buttons
    const createButton = this.createButton(-formWidth/2 + 100, formHeight/2 - 50, 'Create Transaction', () => {
      this.createTransaction();
    });
    
    const cancelButton = this.createButton(formWidth/2 - 100, formHeight/2 - 50, 'Cancel', () => {
      this.hide();
    });
    
    // Add all elements to container
    this.container.add([
      background, title, descLabel, descInput, amountLabel, amountInput,
      typeLabel, typeSelector, accountLabel, accountSelector,
      account2Label, account2Selector, previewLabel, this.previewText,
      createButton, cancelButton
    ]);
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initially hide the form
    this.container.setVisible(false);
  }

  createInputField(x, y, width, placeholder) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholder;
    input.style.position = 'absolute';
    input.style.left = `${x + this.scene.scale.width/2}px`;
    input.style.top = `${y + this.scene.scale.height/2}px`;
    input.style.width = `${width}px`;
    input.style.padding = '8px';
    input.style.border = '2px solid #4a5194';
    input.style.borderRadius = '5px';
    input.style.backgroundColor = '#2a2e46';
    input.style.color = '#ffffff';
    input.style.fontSize = '14px';
    
    document.body.appendChild(input);
    
    // Create a Phaser text object to represent the input visually
    const textObj = this.scene.add.text(x, y, placeholder, {
      fontSize: '14px',
      color: '#666666'
    });
    
    // Store reference to DOM input
    textObj.domElement = input;
    
    return textObj;
  }

  createTypeSelector(x, y) {
    const selector = document.createElement('select');
    selector.style.position = 'absolute';
    selector.style.left = `${x + this.scene.scale.width/2}px`;
    selector.style.top = `${y + this.scene.scale.height/2}px`;
    selector.style.width = '200px';
    selector.style.padding = '8px';
    selector.style.border = '2px solid #4a5194';
    selector.style.borderRadius = '5px';
    selector.style.backgroundColor = '#2a2e46';
    selector.style.color = '#ffffff';
    selector.style.fontSize = '14px';
    
    const options = ['deposit', 'withdrawal', 'transfer'];
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option.charAt(0).toUpperCase() + option.slice(1);
      selector.appendChild(optionElement);
    });
    
    document.body.appendChild(selector);
    
    // Create a Phaser text object to represent the selector visually
    const textObj = this.scene.add.text(x, y, 'Deposit', {
      fontSize: '14px',
      color: '#ffffff'
    });
    
    // Store reference to DOM selector
    textObj.domElement = selector;
    
    return textObj;
  }

  createAccountSelector(x, y) {
    const selector = document.createElement('select');
    selector.style.position = 'absolute';
    selector.style.left = `${x + this.scene.scale.width/2}px`;
    selector.style.top = `${y + this.scene.scale.height/2}px`;
    selector.style.width = '250px';
    selector.style.padding = '8px';
    selector.style.border = '2px solid #4a5194';
    selector.style.borderRadius = '5px';
    selector.style.backgroundColor = '#2a2e46';
    selector.style.color = '#ffffff';
    selector.style.fontSize = '14px';
    
    // Populate with accounts
    const accounts = this.accountManager.getAllAccounts();
    accounts.forEach(account => {
      const optionElement = document.createElement('option');
      optionElement.value = account.id;
      optionElement.textContent = `${account.name} (${account.type})`;
      selector.appendChild(optionElement);
    });
    
    document.body.appendChild(selector);
    
    // Create a Phaser text object to represent the selector visually
    const textObj = this.scene.add.text(x, y, accounts[0] ? accounts[0].name : 'No accounts', {
      fontSize: '14px',
      color: '#ffffff'
    });
    
    // Store reference to DOM selector
    textObj.domElement = selector;
    
    return textObj;
  }

  createButton(x, y, text, callback) {
    const button = this.scene.add.container(x, y);
    
    const buttonText = this.scene.add.text(0, 0, text, {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    const padding = 20;
    const buttonWidth = buttonText.width + padding;
    const buttonHeight = buttonText.height + padding;

    const background = this.scene.add.graphics();
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

  setupEventListeners() {
    // Update preview when inputs change
    if (this.typeSelector.domElement) {
      this.typeSelector.domElement.addEventListener('change', () => {
        this.updatePreview();
        this.toggleSecondAccount();
      });
    }
    
    if (this.amountInput.domElement) {
      this.amountInput.domElement.addEventListener('input', () => {
        this.updatePreview();
      });
    }
    
    if (this.accountSelector.domElement) {
      this.accountSelector.domElement.addEventListener('change', () => {
        this.updatePreview();
      });
    }
    
    if (this.account2Selector.domElement) {
      this.account2Selector.domElement.addEventListener('change', () => {
        this.updatePreview();
      });
    }
  }

  toggleSecondAccount() {
    const type = this.typeSelector.domElement.value;
    const account2Label = this.container.list[10]; // Second account label
    const account2Selector = this.container.list[11]; // Second account selector
    
    if (type === 'transfer') {
      account2Label.setVisible(true);
      account2Selector.setVisible(true);
    } else {
      account2Label.setVisible(false);
      account2Selector.setVisible(false);
    }
  }

  updatePreview() {
    const description = this.descriptionInput.domElement.value;
    const amount = parseFloat(this.amountInput.domElement.value) || 0;
    const type = this.typeSelector.domElement.value;
    const accountId = this.accountSelector.domElement.value;
    const account2Id = this.account2Selector.domElement.value;
    
    if (!description || amount <= 0 || !accountId) {
      this.previewText.setText('Please fill in all required fields');
      return;
    }
    
    let preview = `Transaction: ${description}\nAmount: $${amount.toFixed(2)}\nType: ${type}\n`;
    
    if (type === 'deposit') {
      preview += `To: ${this.accountManager.getAccount(accountId)?.name}`;
    } else if (type === 'withdrawal') {
      preview += `From: ${this.accountManager.getAccount(accountId)?.name}`;
    } else if (type === 'transfer') {
      if (account2Id) {
        preview += `From: ${this.accountManager.getAccount(accountId)?.name}\nTo: ${this.accountManager.getAccount(account2Id)?.name}`;
      } else {
        preview += 'Please select destination account';
      }
    }
    
    this.previewText.setText(preview);
  }

  createTransaction() {
    const description = this.descriptionInput.domElement.value;
    const amount = parseFloat(this.amountInput.domElement.value) || 0;
    const type = this.typeSelector.domElement.value;
    const accountId = this.accountSelector.domElement.value;
    const account2Id = this.account2Selector.domElement.value;
    
    if (!description || amount <= 0 || !accountId) {
      alert('Please fill in all required fields');
      return;
    }
    
    let transaction;
    
    try {
      switch (type) {
        case 'deposit':
          transaction = this.accountManager.transactionManager.createDeposit(accountId, amount, description);
          break;
        case 'withdrawal':
          transaction = this.accountManager.transactionManager.createWithdrawal(accountId, amount, description);
          break;
        case 'transfer':
          if (!account2Id) {
            alert('Please select destination account for transfer');
            return;
          }
          transaction = this.accountManager.transactionManager.createTransfer(accountId, account2Id, amount, description);
          break;
        default:
          alert('Invalid transaction type');
          return;
      }
      
      // Call the callback
      if (this.onTransactionCreated) {
        this.onTransactionCreated(transaction);
      }
      
      this.hide();
      this.clearForm();
      
    } catch (error) {
      alert('Error creating transaction: ' + error.message);
    }
  }

  clearForm() {
    if (this.descriptionInput.domElement) this.descriptionInput.domElement.value = '';
    if (this.amountInput.domElement) this.amountInput.domElement.value = '';
    if (this.typeSelector.domElement) this.typeSelector.domElement.value = 'deposit';
    if (this.accountSelector.domElement) this.accountSelector.domElement.selectedIndex = 0;
    if (this.account2Selector.domElement) this.account2Selector.domElement.selectedIndex = 0;
    
    this.previewText.setText('');
  }

  show() {
    this.container.setVisible(true);
    this.updatePreview();
  }

  hide() {
    this.container.setVisible(false);
  }

  destroy() {
    // Remove DOM elements
    if (this.descriptionInput.domElement) document.body.removeChild(this.descriptionInput.domElement);
    if (this.amountInput.domElement) document.body.removeChild(this.amountInput.domElement);
    if (this.typeSelector.domElement) document.body.removeChild(this.typeSelector.domElement);
    if (this.accountSelector.domElement) document.body.removeChild(this.accountSelector.domElement);
    if (this.account2Selector.domElement) document.body.removeChild(this.account2Selector.domElement);
    
    this.container.destroy();
  }
}
