import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import TellerScene from './scenes/TellerScene';
import PersonalBankerScene from './scenes/PersonalBankerScene';
import AccountingScene from './scenes/AccountingScene';

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: 'game',
    width: window.innerWidth,
    height: window.innerHeight,
    min: {
      width: 800,
      height: 600
    }
  },
  backgroundColor: '#1a1e36',
  scene: [BootScene, TellerScene, PersonalBankerScene, AccountingScene]
};

const game = new Phaser.Game(config);

// Handle window resize
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
