import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../core/Constants.js';

export class EndScene extends Phaser.Scene {
  constructor() {
    super('EndScene');
  }

  init(data) {
    this.victory = data.victory;
    this.timeFormatted = data.timeFormatted || '00:00:00';
    this.hull = data.hull ?? 100;
  }

  create() {
    const cx = SCREEN_WIDTH / 2;
    const cy = SCREEN_HEIGHT / 2;

    this.add.rectangle(cx, cy, SCREEN_WIDTH, SCREEN_HEIGHT, this.victory ? 0x022c22 : 0x2a0808);

    const title = this.victory ? '¡EXTRACCIÓN COMPLETADA!' : 'LA FOSA HA RECLAMADO LA SONDA';
    const titleColor = this.victory ? '#34d399' : '#f87171';

    this.add.text(cx, 200, title, {
      fontFamily: 'monospace',
      fontSize: '40px',
      fontStyle: 'bold',
      color: titleColor
    }).setOrigin(0.5);

    this.add.text(cx, 300, `TIEMPO REGISTRADO: ${this.timeFormatted}`, {
      fontFamily: 'monospace',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(cx, 355, `INTEGRIDAD DEL CASCO: ${this.hull}%`, {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#cbd5e1'
    }).setOrigin(0.5);

    const retryBtn = this.add.rectangle(cx, 465, 360, 58, 0x38bdf8)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xe0f2fe);

    this.add.text(cx, 465, 'REINICIAR INMEDIATAMENTE [CLIC / R]', {
      fontFamily: 'monospace',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#0f172a'
    }).setOrigin(0.5);

    const menuBtn = this.add.rectangle(cx, 545, 240, 44, 0x1e293b)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(1, 0x64748b);

    this.add.text(cx, 545, 'VOLVER AL MENÚ [M]', {
      fontFamily: 'monospace',
      fontSize: '15px',
      color: '#e2e8f0'
    }).setOrigin(0.5);

    retryBtn.on('pointerdown', () => this.scene.start('GameScene'));
    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));

    this.input.keyboard.on('keydown-R', () => this.scene.start('GameScene'));
    this.input.keyboard.on('keydown-SPACE', () => this.scene.start('GameScene'));
    this.input.keyboard.on('keydown-ENTER', () => this.scene.start('GameScene'));
    this.input.keyboard.on('keydown-M', () => this.scene.start('MenuScene'));
  }
}