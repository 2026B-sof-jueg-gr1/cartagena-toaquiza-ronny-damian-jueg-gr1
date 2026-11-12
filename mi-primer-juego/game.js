const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  backgroundColor: '#040a14',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: [] // Aquí registraremos BootScene, MenuScene, GameScene y EndScene
};

const game = new Phaser.Game(config);