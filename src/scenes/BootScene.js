export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
    this.gridSize = 40;
    this.overlay = null;
    this.background = null;
    this.gridGraphics = [];
  }

  create() {
    // Get screen dimensions
    const width = this.scale.width;
    const height = this.scale.height;

    this.createDynamicBackground(width, height);
    
    // Add semi-transparent overlay
    this.overlay = this.add.graphics();
    this.overlay.fillStyle(0x1a1e36, 0.7);
    this.overlay.fillRect(0, 0, width, height);

    // Center position for title
    const centerX = width / 2;
    const titleY = height * 0.2;

    // Add game title
    const title = this.add.text(centerX, titleY, 'Bank Simulator', {
      fontSize: `${Math.min(width / 15, 64)}px`,
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    title.setShadow(2, 2, '#000000', 2, true, true);

    // Calculate button positions
    const buttonStartY = height * 0.4;
    const buttonSpacing = height * 0.1;

    // Create buttons
    this.createButton(centerX, buttonStartY, 'Start Game', () => {
      console.log('Starting game...');
      // this.scene.start('GameScene');
    });

    this.createButton(centerX, buttonStartY + buttonSpacing, 'Load Game', () => {
      console.log('Load Game functionality not implemented yet.');
    });

    this.createButton(centerX, buttonStartY + (buttonSpacing * 2), 'Options', () => {
      console.log('Options functionality not implemented yet.');
    });

    // Add Credits text
    const credits = this.add.text(centerX, height * 0.9, 'Created by @jcrump97 and contributors.', {
      fontSize: `${Math.min(width / 50, 16)}px`,
      color: '#ffffff'
    }).setOrigin(0.5);
    credits.setShadow(1, 1, '#000000', 1, true, true);

    // Handle resize
    this.scale.on('resize', this.resize, this);
  }

  createButton(x, y, label, callback) {
    // Create a container for the button
    const button = this.add.container(x, y);
    
    // Create button background using graphics
    const background = this.add.graphics();
    const buttonWidth = 200;
    const buttonHeight = 40;
    const cornerRadius = 10;
    
    // Default state
    const drawButton = (color) => {
      background.clear();
      background.fillStyle(color, 1);
      background.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
    };
    
    // Initial draw
    drawButton(0x4a5194);
    
    // Make interactive
    const hitArea = new Phaser.Geom.Rectangle(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight);
    background.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    
    // Add hover effects
    background.on('pointerover', () => {
      drawButton(0x5b63b0);
      buttonText.setScale(1.05);
    });
    
    background.on('pointerout', () => {
      drawButton(0x4a5194);
      buttonText.setScale(1);
    });
    
    background.on('pointerdown', () => {
      drawButton(0x3b4273);
      callback();
    });
    
    background.on('pointerup', () => {
      drawButton(0x5b63b0);
    });

    // Add button text
    const buttonText = this.add.text(0, 0, label, {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5);

    // Add both background and text to the container
    button.add([background, buttonText]);
    
    return button;
  }

  createDynamicBackground(width, height) {
    // Create gradient background
    this.background = this.add.graphics();
    this.background.fillStyle(0x1a1e36, 1);
    this.background.fillRect(0, 0, width, height);

    // Calculate grid based on screen size
    this.gridSize = Math.min(width, height) / 20;
    this.gridGraphics = [];

    // Create grid pattern
    for (let x = 0; x < width; x += this.gridSize) {
      for (let y = 0; y < height; y += this.gridSize) {
        const node = this.add.circle(x, y, 2, 0x4a5194, 0.5);
        this.gridGraphics.push(node);

        this.tweens.add({
          targets: node,
          scale: { from: 0.8, to: 1.2 },
          alpha: { from: 0.3, to: 0.6 },
          duration: 1500 + Math.random() * 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    }
  }

  // Resize background and overlay when the screen size changes
  resize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;
    // Update overlay and grid to match new size before resizing camera
    if (this.background) {
      this.background.clear();
      this.background.fillStyle(0x1a1e36, 1);
      this.background.fillRect(0, 0, width, height);
    }

    if (this.overlay) {
      this.overlay.clear();
      this.overlay.fillStyle(0x1a1e36, 0.7);
      this.overlay.fillRect(0, 0, width, height);
    }

    if (this.gridGraphics) {
      this.gridSize = Math.min(width, height) / 20;

      let index = 0;
      for (let x = 0; x < width; x += this.gridSize) {
        for (let y = 0; y < height; y += this.gridSize) {
          let node;
          if (index < this.gridGraphics.length) {
            node = this.gridGraphics[index];
            node.setVisible(true);
          } else {
            node = this.add.circle(x, y, 2, 0x4a5194, 0.5);
            this.gridGraphics.push(node);

            this.tweens.add({
              targets: node,
              scale: { from: 0.8, to: 1.2 },
              alpha: { from: 0.3, to: 0.6 },
              duration: 1500 + Math.random() * 1000,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            });
          }
          node.setPosition(x, y);
          index++;
        }
      }

      for (; index < this.gridGraphics.length; index++) {
        this.gridGraphics[index].setVisible(false);
      }
    }

    this.cameras.resize(width, height);
  }
}
