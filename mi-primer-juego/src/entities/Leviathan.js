export class Leviathan extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, minX, maxX) {
    super(scene, x, y, 'leviatan');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCircle(16, 4, 4);
    this.setDepth(9);
    this.minX = minX;
    this.maxX = maxX;
    this.patrolDir = 1;
    this.alertUntil = 0;
  }

  updateAI(player, time) {
    const dist = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y);

    if (dist < 240 || time < this.alertUntil) {
      // Modo persecución hacia el jugador
      const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
      this.setVelocity(Math.cos(angle) * 150, Math.sin(angle) * 150);
      this.rotation = angle;
    } else {
      // Modo patrulla horizontal
      this.setVelocityY(0);
      this.setVelocityX(95 * this.patrolDir);
      if (this.x >= this.maxX) this.patrolDir = -1;
      if (this.x <= this.minX) this.patrolDir = 1;
      this.rotation = this.patrolDir > 0 ? 0 : Math.PI;
    }
  }
}