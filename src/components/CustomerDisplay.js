import Phaser from 'phaser';

export default class CustomerDisplay {
  constructor(scene, x, y, customer, isSelected = false) {
    this.scene = scene;
    this.customer = customer;
    this.isSelected = false;
    this.container = scene.add.container(x, y);
    this.createDisplay();
    this.setSelected(isSelected);
  }

  createDisplay() {
    const padding = 10;
    const cardWidth = 300;
    const cardHeight = 120;
    const cornerRadius = 8;

    // Create card background
    const background = this.scene.add.graphics();
    background.fillStyle(0x2a2e56, 0.9);
    background.fillRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, cornerRadius);
    background.lineStyle(2, 0x4a5194, 1);
    background.strokeRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, cornerRadius);

    // Customer name (large, prominent)
    this.nameText = this.scene.add.text(-cardWidth/2 + padding, -cardHeight/2 + padding, this.customer.fullName, {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold'
    });

    // Customer ID
    this.idText = this.scene.add.text(-cardWidth/2 + padding, -cardHeight/2 + 30, `ID: ${this.customer.id}`, {
      fontSize: '14px',
      color: '#cccccc'
    });

    // Risk profile indicator
    const riskColor = this.customer.getRiskColor();
    this.riskIndicator = this.scene.add.circle(cardWidth/2 - padding - 15, -cardHeight/2 + padding + 15, 8, Phaser.Display.Color.ValueToColor(riskColor).color);
    
    this.riskText = this.scene.add.text(cardWidth/2 - padding - 35, -cardHeight/2 + padding + 8, this.customer.riskProfile.toUpperCase(), {
      fontSize: '12px',
      color: riskColor,
      fontStyle: 'bold'
    });

    // Contact info
    this.emailText = this.scene.add.text(-cardWidth/2 + padding, -cardHeight/2 + 50, this.customer.email, {
      fontSize: '12px',
      color: '#aaaaaa'
    });

    this.phoneText = this.scene.add.text(-cardWidth/2 + padding, -cardHeight/2 + 65, this.customer.phone, {
      fontSize: '12px',
      color: '#aaaaaa'
    });

    // Account count
    this.accountCountText = this.scene.add.text(cardWidth/2 - padding, -cardHeight/2 + 50, `${this.customer.accountIds.length} accounts`, {
      fontSize: '12px',
      color: '#00ffff',
      fontStyle: 'bold'
    });

    // Age and occupation
    this.ageText = this.scene.add.text(cardWidth/2 - padding, -cardHeight/2 + 65, `Age: ${this.customer.age}`, {
      fontSize: '12px',
      color: '#ffff00'
    });

    // Add all elements to container
    this.container.add([
      background,
      this.nameText,
      this.idText,
      this.riskIndicator,
      this.riskText,
      this.emailText,
      this.phoneText,
      this.accountCountText,
      this.ageText
    ]);

    // Make interactive
    this.makeInteractive();
  }

  makeInteractive() {
    this.container.setInteractive(new Phaser.Geom.Rectangle(-150, -60, 300, 120), Phaser.Geom.Rectangle.Contains);
    
    this.container.on('pointerover', () => {
      this.container.setScale(1.02);
    });
    
    this.container.on('pointerout', () => {
      this.container.setScale(1.0);
    });
    
    this.container.on('pointerdown', () => {
      this.setSelected(true);
    });
  }

  setSelected(selected) {
    this.isSelected = selected;
    
    if (selected) {
      this.container.setScale(1.05);
      // Add selection indicator
      if (!this.selectionBorder) {
        this.selectionBorder = this.scene.add.graphics();
        this.selectionBorder.lineStyle(3, 0x00ff00, 1);
        this.selectionBorder.strokeRoundedRect(-150, -60, 300, 120, 8);
        this.container.add(this.selectionBorder);
      }
    } else {
      this.container.setScale(1.0);
      if (this.selectionBorder) {
        this.selectionBorder.destroy();
        this.selectionBorder = null;
      }
    }
  }

  setSelectCallback(callback) {
    this.container.on('pointerdown', () => {
      if (callback) {
        callback(this.customer);
      }
    });
  }

  updateDisplay() {
    // Update dynamic content if needed
    this.accountCountText.setText(`${this.customer.accountIds.length} accounts`);
    this.ageText.setText(`Age: ${this.customer.age}`);
    
    // Update risk profile
    const riskColor = this.customer.getRiskColor();
    this.riskIndicator.setFillStyle(Phaser.Display.Color.ValueToColor(riskColor).color);
    this.riskText.setColor(riskColor);
    this.riskText.setText(this.customer.riskProfile.toUpperCase());
  }

  destroy() {
    if (this.container) {
      this.container.destroy();
    }
  }
}
