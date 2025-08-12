import Phaser from 'phaser';

export default class AccountDisplay {
  constructor(scene, x, y, account, isSelected = false) {
    this.scene = scene;
    this.account = account;
    this.isSelected = isSelected;
    this.container = scene.add.container(x, y);
    
    this.createDisplay();
  }

  createDisplay() {
    const displayWidth = 450;
    const displayHeight = 60;
    const cornerRadius = 8;
    
    // Create display background
    const background = this.scene.add.graphics();
    const backgroundColor = this.isSelected ? 0x4a5194 : 0x2a2e46;
    background.fillStyle(backgroundColor, 0.9);
    background.fillRoundedRect(-displayWidth/2, -displayHeight/2, displayWidth, displayHeight, cornerRadius);
    
    // Add selection border if selected
    if (this.isSelected) {
      background.lineStyle(3, 0x00ff00, 1);
      background.strokeRoundedRect(-displayWidth/2, -displayHeight/2, displayWidth, displayHeight, cornerRadius);
    }
    
    // Account name and number
    const accountText = this.scene.add.text(-displayWidth/2 + 20, -displayHeight/2 + 15, 
      `${this.account.name}`, {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    
    const accountNumberText = this.scene.add.text(-displayWidth/2 + 20, -displayHeight/2 + 35, 
      `#${this.account.accountNumber}`, {
      fontSize: '12px',
      color: '#cccccc'
    });
    
    // Account type with color coding
    const typeText = this.scene.add.text(-displayWidth/2 + 200, -displayHeight/2 + 25, 
      this.account.type.toUpperCase(), {
      fontSize: '12px',
      color: this.getAccountTypeColor(this.account.type),
      fontStyle: 'bold'
    });
    
    // Balance with color coding
    const balanceText = this.scene.add.text(displayWidth/2 - 20, -displayHeight/2 + 25, 
      this.account.getFormattedBalance(), {
      fontSize: '18px',
      color: this.getBalanceColor(),
      fontStyle: 'bold'
    });
    
    // Add all elements to container
    this.container.add([background, accountText, accountNumberText, typeText, balanceText]);
    
    // Make interactive
    this.makeInteractive();
  }

  getAccountTypeColor(type) {
    const colors = {
      'asset': '#00ff00',      // Green
      'liability': '#ff0000',  // Red
      'equity': '#ffff00',     // Yellow
      'revenue': '#00ffff',    // Cyan
      'expense': '#ff00ff'     // Magenta
    };
    return colors[type] || '#ffffff';
  }

  getBalanceColor() {
    const balance = this.account.getBalance();
    
    if (this.account.type === 'asset' || this.account.type === 'equity') {
      return balance >= 0 ? '#00ff00' : '#ff0000';
    } else if (this.account.type === 'liability') {
      return balance >= 0 ? '#ff0000' : '#00ff00';
    } else if (this.account.type === 'revenue') {
      return balance >= 0 ? '#00ff00' : '#ff0000';
    } else if (this.account.type === 'expense') {
      return balance >= 0 ? '#ff0000' : '#00ff00';
    }
    
    return '#ffffff';
  }

  makeInteractive() {
    this.container.setInteractive(new Phaser.Geom.Rectangle(-225, -30, 450, 60), Phaser.Geom.Rectangle.Contains);
    
    this.container.on('pointerover', () => {
      if (!this.isSelected) {
        this.container.setScale(1.02);
      }
    });
    
    this.container.on('pointerout', () => {
      if (!this.isSelected) {
        this.container.setScale(1);
      }
    });
    
    this.container.on('pointerdown', () => {
      this.onAccountSelected();
    });
  }

  onAccountSelected() {
    // This will be overridden by the parent scene
    if (this.onSelectCallback) {
      this.onSelectCallback(this.account);
    }
  }

  setSelected(selected) {
    this.isSelected = selected;
    this.updateDisplay();
  }

  updateDisplay() {
    this.container.removeAll();
    this.createDisplay();
  }

  setSelectCallback(callback) {
    this.onSelectCallback = callback;
  }

  setPosition(x, y) {
    this.container.setPosition(x, y);
  }

  destroy() {
    this.container.destroy();
  }
}
