import { SCREEN_WIDTH, SCREEN_HEIGHT } from './core/Constants.js';
import { BootScene } from './scenes/BootScene.js';
import { PreloaderScene } from './scenes/PreloaderScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { EndScene } from './scenes/EndScene.js';

const config = {
  type: Phaser.AUTO,
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  backgroundColor: '#040a14',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: [BootScene, PreloaderScene, MenuScene, GameScene, EndScene]
};

new Phaser.Game(config);