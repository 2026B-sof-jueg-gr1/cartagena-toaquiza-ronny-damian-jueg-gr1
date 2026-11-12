import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../core/Constants.js';
import { sfx } from '../core/Audio.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const cx = SCREEN_WIDTH / 2;
    const cy = SCREEN_HEIGHT / 2;

    this.add.rectangle(cx, cy, SCREEN_WIDTH, SCREEN_HEIGHT, 0x030712);
    this.add.circle(cx, cy - 40, 260, 0x0c4a6e, 0.15);

    this.add.text(cx, 150, 'FOSA ABISAL: SONDA NADIR', {
      fontFamily: 'monospace',
      fontSize: '44px',
      fontStyle: 'bold',
      color: '#ef4444'
    }).setOrigin(0.5);

    this.add.text(cx, 205, 'Desciende desde la salida norte hasta la meta en la fosa sur.', {
      fontFamily: 'monospace',
      fontSize: '17px',
      color: '#94a3b8'
    }).setOrigin(0.5);

    const rules = [
      '• CONTROLES: WASD, Flechas o Botones Táctiles en pantalla',
      '• SONAR [ESPACIO]: Revela el mapa por 2.2s pero alerta criaturas cercanas',
      '• CORRIENTE CENTRAL (Azul): Velocidad máxima (320 px/s)',
      '• SEDIMENTO ABISAL (Verde oscuro): Penalización de velocidad (< 160 px/s)',
      '• AUDIO [M]: Activar / Silenciar sonido'
    ];

    this.add.text(cx, 330, rules.join('\n\n'), {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#cbd5e1',
      align: 'left'
    }).setOrigin(0.5);

    const startBtn = this.add.rectangle(cx, 520, 320, 56, 0xef4444)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xfca5a5);

    this.add.text(cx, 520, 'INICIAR INMERSIÓN [ENTER]', {
      fontFamily: 'monospace',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    const soundText = this.add.text(cx, 600, `SONIDO: ${sfx.muted ? 'SILENCIADO' : 'ACTIVADO'} (Presiona M)`, {
      fontFamily: 'monospace',
      fontSize: '15px',
      color: '#38bdf8'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const startGame = () => {
      sfx.playPing();
      this.scene.start('GameScene');
    };

    const toggleAudio = () => {
      const isMuted = sfx.toggleMute();
      soundText.setText(`SONIDO: ${isMuted ? 'SILENCIADO' : 'ACTIVADO'} (Presiona M)`);
    };

    startBtn.on('pointerdown', startGame);
    soundText.on('pointerdown', toggleAudio);
    this.input.keyboard.on('keydown-ENTER', startGame);
    this.input.keyboard.on('keydown-SPACE', startGame);
    this.input.keyboard.on('keydown-M', toggleAudio);
  }
}