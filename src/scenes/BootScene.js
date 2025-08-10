import Phaser from 'phaser';
import { customerStore, seedSampleCustomers } from '../data/CustomerStore';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
    this.gridSize = 40;
    this.overlay = null;
    this.background = null;
    this.gridGraphics = [];
    this.title = null;
    this.buttons = [];
    this.credits = null;
  }

  create() {
    // load any stored customer data and seed defaults
    customerStore.load();
    seedSampleCustomers();

    // Get screen dimensions
    const width = this.scale.width;
    const height = this.scale.height;

    this.createDynamicBackground(width, height);

    // Add semi-transparent overlay
    this.overlay = this.add.graphics();
    this.overlay.fillStyle(0x1a1e36, 0.7);
    this.overlay.fillRect(0, 0, width, height);

    // Create title and credits placeholders
    this.title = this.add.text(0, 0, 'Bank Simulator', {
      fontSize: '64px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.title.setShadow(2, 2, '#000000', 2, true, true);

    this.credits = this.add.text(0, 0, 'Created by @jcrump97 and contributors.', {
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.credits.setShadow(1, 1, '#000000', 1, true, true);

    // Create buttons for game modes and placeholders
    const tellerButton = this.createButton(0, 0, 'Teller Mode', () => {
      this.scene.start('TellerScene');
    });
    if (tellerButton) this.buttons.push(tellerButton);

    const pbButton = this.createButton(0, 0, 'Personal Banker Mode', () => {
      this.scene.start('PersonalBankerScene');
    });
    if (pbButton) this.buttons.push(pbButton);

    const loadButton = this.createButton(0, 0, 'Load Game', () => {
      console.log('Load Game functionality not implemented yet.');
    });
    if (loadButton) this.buttons.push(loadButton);

    const optionsButton = this.createButton(0, 0, 'Options', () => {
      console.log('Options functionality not implemented yet.');
    });
    if (optionsButton) this.buttons.push(optionsButton);

    // Position elements for initial layout
    this.repositionElements(width, height);

    // Handle resize
    this.scale.on('resize', this.resize, this);
  }

  createButton(x, y, label, callback) {
    // Create a container for the button
    const button = this.add.container(x, y);

    // Create button text first to measure its size
    const buttonText = this.add.text(0, 0, label, {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5);

    const horizontalPadding = 40;
    const verticalPadding = 20;
    const buttonWidth = buttonText.width + horizontalPadding;
    const buttonHeight = buttonText.height + verticalPadding;
    const cornerRadius = 10;

    // Create button background using graphics sized to text
    const background = this.add.graphics();

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

    // Add both background and text to the container
    button.add([background, buttonText]);

    return button;
  }

  // Reposition and scale UI elements based on screen size
  repositionElements(width, height) {
    const centerX = width / 2;
    const titleY = height * 0.2;
    const buttonStartY = height * 0.4;
    const buttonSpacing = height * 0.1;
    const buttonScale = Math.min(width / 800, height / 600);

    if (this.title) {
      this.title.setFontSize(Math.min(width / 15, 64));
      this.title.setPosition(centerX, titleY);
    }

    this.buttons.forEach((button, index) => {
      if (button) {
        button.setPosition(centerX, buttonStartY + index * buttonSpacing);
        button.setScale(buttonScale);
      }
    });

    if (this.credits) {
      this.credits.setFontSize(Math.min(width / 50, 16));
      this.credits.setPosition(centerX, height * 0.9);
    }
  }

  // Draws a solid-color backdrop and animated grid
  createDynamicBackground(width, height) {
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

    this.repositionElements(width, height);
    this.cameras.resize(width, height);
  }
}
