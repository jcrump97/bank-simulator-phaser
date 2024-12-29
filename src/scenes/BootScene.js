export default class BootScene extends Phaser.Scene {
    constructor() {
      super('BootScene');
    }
  
    preload() {
      this.load.image('bank', 'assets/images/bank.png');
    }
  
    create() {
      this.add.text(400, 300, 'Welcome to the Bank Simulator!', {
        fontSize: '32px',
        color: '#000'
      }).setOrigin(0.5);
    }
  }
  