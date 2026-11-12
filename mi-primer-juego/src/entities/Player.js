export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'sonda');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.body.setCircle(16, 16, 6); // Hitbox circular centrado en el casco del submarino
    this.setDepth(10);
    this.rotation = Math.PI / 2; // Apunta hacia el sur al iniciar
    this.hull = 100;
    this.invulnerableUntil = 0;
  }

  handleMovement(inputState, maxSpeed, time) {
    let vx = 0;
    let vy = 0;

    if (inputState.left) vx -= 1;
    if (inputState.right) vx += 1;
    if (inputState.up) vy -= 1;
    if (inputState.down) vy += 1;

    if (vx !== 0 || vy !== 0) {
      // Velocidad diagonal normalizada para evitar atajos rápidos
      const len = Math.hypot(vx, vy);
      vx = (vx / len) * maxSpeed;
      vy = (vy / len) * maxSpeed;
      this.setVelocity(vx, vy);

      // Rotación visual hacia el vector de movimiento
      this.rotation = Math.atan2(vy, vx);
    } else {
      // Frenado seco al soltar controles
      this.setVelocity(0, 0);
    }

    // Parpadeo durante invulnerabilidad
    this.setAlpha(
      time < this.invulnerableUntil
        ? (Math.floor(time / 80) % 2 === 0 ? 0.35 : 1)
        : 1
    );
  }

  takeDamage(amount, time) {
    if (time < this.invulnerableUntil) return false;
    this.hull = Math.max(0, this.hull - amount);
    this.invulnerableUntil = time + 1100;
    return true;
  }
}