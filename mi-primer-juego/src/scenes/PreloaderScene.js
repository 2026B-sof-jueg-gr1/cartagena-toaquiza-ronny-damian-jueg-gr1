import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../core/Constants.js';
import { TextureFactory } from '../systems/TextureFactory.js';

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('PreloaderScene');
  }

  create() {
    const cx = SCREEN_WIDTH / 2;
    const cy = SCREEN_HEIGHT / 2;

    this.add.image(cx, cy, 'bg_base').setDisplaySize(SCREEN_WIDTH, SCREEN_HEIGHT);

    this.add.text(cx, cy - 50, 'GENERANDO SONDA Y FOSA ABISAL...', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#38bdf8'
    }).setOrigin(0.5);

    this.add.rectangle(cx, cy, 400, 24, 0x0f172a).setStrokeStyle(2, 0x38bdf8);
    const barFill = this.add.rectangle(cx - 196, cy, 10, 16, 0x38bdf8).setOrigin(0, 0.5);

    TextureFactory.createGameTextures(this);

    this.tweens.add({
      targets: barFill,
      width: 392,
      duration: 450,
      onComplete: () => this.scene.start('MenuScene')
    });
  }
}