import Phaser from 'phaser';

export default class TransactionCard {
  constructor(scene, x, y, transaction, accountManager) {
    this.scene = scene;
    this.transaction = transaction;
    this.accountManager = accountManager;
    this.container = scene.add.container(x, y);
    
    this.createCard();
  }

  createCard() {
    const cardWidth = 500;
    const cardHeight = 80;
    const cornerRadius = 8;
    
    // Create card background
    const background = this.scene.add.graphics();
    background.fillStyle(0x2a2e46, 0.9);
    background.fillRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, cornerRadius);
    background.lineStyle(2, this.getStatusColor(), 1);
    background.strokeRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, cornerRadius);
    
    // Create transaction details
    const dateText = this.scene.add.text(-cardWidth/2 + 20, -cardHeight/2 + 15, 
      new Date(this.transaction.timestamp).toLocaleDateString(), {
      fontSize: '14px',
      color: '#cccccc'
    });
    
    const descText = this.scene.add.text(-cardWidth/2 + 20, -cardHeight/2 + 35, 
      this.transaction.description, {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    
    const amountText = this.scene.add.text(cardWidth/2 - 20, -cardHeight/2 + 25, 
      this.transaction.getFormattedTotal(), {
      fontSize: '18px',
      color: this.getStatusColor(),
      fontStyle: 'bold'
    });
    
    const statusText = this.scene.add.text(cardWidth/2 - 20, -cardHeight/2 + 45, 
      this.transaction.isPosted ? 'POSTED' : 'DRAFT', {
      fontSize: '12px',
      color: this.getStatusColor(),
      fontStyle: 'bold'
    });
    
    // Create entry details
    const entriesContainer = this.createEntriesDisplay();
    entriesContainer.setPosition(-cardWidth/2 + 20, cardHeight/2 + 10);
    
    // Add all elements to container
    this.container.add([background, dateText, descText, amountText, statusText, entriesContainer]);
    
    // Make interactive
    this.makeInteractive();
  }

  createEntriesDisplay() {
    const container = this.scene.add.container(0, 0);
    
    this.transaction.entries.forEach((entry, index) => {
      const account = this.accountManager.getAccount(entry.accountId);
      if (!account) return;
      
      const entryText = this.scene.add.text(0, index * 20, 
        `${account.name}: ${entry.debit > 0 ? 'DR' : 'CR'} ${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(entry.debit > 0 ? entry.debit : entry.credit)}`, {
        fontSize: '12px',
        color: entry.debit > 0 ? '#ff6b6b' : '#4ecdc4'
      });
      
      container.add(entryText);
    });
    
    return container;
  }

  getStatusColor() {
    if (this.transaction.isPosted) {
      return 0x00ff00; // Green for posted
    } else {
      return 0xffff00; // Yellow for draft
    }
  }

  makeInteractive() {
    this.container.setInteractive(new Phaser.Geom.Rectangle(-250, -40, 500, 80), Phaser.Geom.Rectangle.Contains);
    
    this.container.on('pointerover', () => {
      this.container.setScale(1.02);
    });
    
    this.container.on('pointerout', () => {
      this.container.setScale(1);
    });
    
    this.container.on('pointerdown', () => {
      this.showTransactionDetails();
    });
  }

  showTransactionDetails() {
    // Create a detailed view popup
    const popup = this.createDetailPopup();
    this.scene.add.existing(popup);
    
    // Auto-remove after 5 seconds
    this.scene.time.delayedCall(5000, () => {
      popup.destroy();
    });
  }

  createDetailPopup() {
    const popupWidth = 600;
    const popupHeight = 400;
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;
    
    const popup = this.scene.add.container(centerX, centerY);
    
    // Background
    const background = this.scene.add.graphics();
    background.fillStyle(0x1a1e36, 0.95);
    background.fillRoundedRect(-popupWidth/2, -popupHeight/2, popupWidth, popupHeight, 10);
    background.lineStyle(3, this.getStatusColor(), 1);
    background.strokeRoundedRect(-popupWidth/2, -popupHeight/2, popupWidth, popupHeight, 10);
    
    // Title
    const title = this.scene.add.text(0, -popupHeight/2 + 30, 'Transaction Details', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Transaction info
    const infoText = this.scene.add.text(-popupWidth/2 + 30, -popupHeight/2 + 80, 
      `ID: ${this.transaction.id}\nDescription: ${this.transaction.description}\nDate: ${new Date(this.transaction.timestamp).toLocaleString()}\nStatus: ${this.transaction.isPosted ? 'POSTED' : 'DRAFT'}`, {
      fontSize: '16px',
      color: '#ffffff'
    });
    
    // Entries table header
    const headerText = this.scene.add.text(-popupWidth/2 + 30, -popupHeight/2 + 180, 
      'Account | Type | Amount', {
      fontSize: '16px',
      color: '#ffff00',
      fontStyle: 'bold'
    });
    
    // Entries details
    let currentY = -popupHeight/2 + 210;
    this.transaction.entries.forEach((entry, index) => {
      const account = this.accountManager.getAccount(entry.accountId);
      if (!account) return;
      
      const entryText = this.scene.add.text(-popupWidth/2 + 30, currentY, 
        `${account.name} | ${entry.debit > 0 ? 'DEBIT' : 'CREDIT'} | ${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(entry.debit > 0 ? entry.debit : entry.credit)}`, {
        fontSize: '14px',
        color: entry.debit > 0 ? '#ff6b6b' : '#4ecdc4'
      });
      
      popup.add(entryText);
      currentY += 25;
    });
    
    // Total
    const totalText = this.scene.add.text(0, popupHeight/2 - 50, 
      `Total: ${this.transaction.getFormattedTotal()}`, {
      fontSize: '20px',
      color: '#00ff00',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Close button
    const closeButton = this.scene.add.text(popupWidth/2 - 50, -popupHeight/2 + 30, '✕', {
      fontSize: '24px',
      color: '#ff0000',
      fontStyle: 'bold'
    });
    closeButton.setInteractive();
    closeButton.on('pointerdown', () => {
      popup.destroy();
    });
    
    popup.add([background, title, infoText, headerText, totalText, closeButton]);
    
    return popup;
  }

  setPosition(x, y) {
    this.container.setPosition(x, y);
  }

  destroy() {
    this.container.destroy();
  }
}
