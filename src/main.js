import Phaser from 'phaser';
import BootScene from './scenes/BootScene';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#ffffff',
  scene: [BootScene]
};

const game = new Phaser.Game(config);
