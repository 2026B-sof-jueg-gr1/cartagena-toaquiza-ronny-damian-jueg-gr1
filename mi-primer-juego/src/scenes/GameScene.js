import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  SPEED_TRENCH,
  SPEED_SILT,
  PATH_POINTS,
  ENEMY_WAYPOINTS
} from '../core/Constants.js';
import { sfx } from '../core/Audio.js';
import { Player } from '../entities/Player.js';
import { Leviathan } from '../entities/Leviathan.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // 1. Nivel: Sedimento exterior y Corriente trazada por 9 puntos
    const mapGfx = this.add.graphics();
    mapGfx.fillStyle(0x06241c, 1);
    mapGfx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    const vectorPoints = PATH_POINTS.map((p) => new Phaser.Math.Vector2(p.x, p.y));
    this.spline = new Phaser.Curves.Spline(vectorPoints);
    this.curveSamples = this.spline.getSpacedPoints(220);

    mapGfx.lineStyle(310, 0x0b3b49, 1);
    this.spline.draw(mapGfx, 128);
    mapGfx.lineStyle(260, 0x0f172a, 1);
    this.spline.draw(mapGfx, 128);

    this.curveSamples.forEach((pt, idx) => {
      if (idx % 2 === 0) {
        mapGfx.fillStyle(0x38bdf8, 0.45);
        mapGfx.fillCircle(pt.x, pt.y, 6);
      }
    });

    // 2. Ubicación espacial: SALIDA (Norte) y META (Sur)
    this.add.rectangle(800, 170, 260, 56, 0x10b981).setStrokeStyle(3, 0xa7f3d0);
    this.add.text(800, 170, 'SALIDA', {
      fontFamily: 'monospace',
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#022c22'
    }).setOrigin(0.5);

    this.add.rectangle(800, 4350, 280, 64, 0xffffff).setStrokeStyle(4, 0x38bdf8);
    this.add.text(800, 4350, 'META', {
      fontFamily: 'monospace',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#0f172a'
    }).setOrigin(0.5);

    // Zona invisible de meta que detiene la carrera
    this.goalZone = this.add.zone(800, 4420, 320, 90);
    this.physics.world.enable(this.goalZone, Phaser.Physics.Arcade.STATIC_BODY);

    // 3. Rocas abisales posicionadas de forma procedural
    this.rocks = this.physics.add.staticGroup();
    const rng = new Phaser.Math.RandomDataGenerator(['sonda-nadir-epn']);
    for (let i = 0; i < 95; i++) {
      const rx = rng.between(70, WORLD_WIDTH - 70);
      const ry = rng.between(320, WORLD_HEIGHT - 280);
      if (!this.isInsideChannel(rx, ry, 185)) {
        const rock = this.rocks.create(rx, ry, 'roca');
        rock.setCircle(22, 6, 6);
      }
    }

    // 4. Entidades: Jugador y Criaturas
    this.player = new Player(this, 800, 250);
    this.isFinished = false;

    this.enemies = this.physics.add.group();
    ENEMY_WAYPOINTS.forEach((wp) => {
      const mob = new Leviathan(this, wp.x1, wp.y, wp.x1, wp.x2);
      this.enemies.add(mob);
    });

    this.physics.add.collider(this.player, this.rocks);
    this.physics.add.overlap(this.player, this.enemies, this.handleEnemyContact, null, this);
    this.physics.add.overlap(this.player, this.goalZone, this.reachGoal, null, this);

    // 5. Cámara con seguimiento suave y límites del mapa
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    // 6. Oscuridad dinámica y cono de luz
    if (this.textures.exists('darknessMap')) {
      this.textures.remove('darknessMap');
    }
    this.darknessCanvas = this.textures.createCanvas('darknessMap', SCREEN_WIDTH, SCREEN_HEIGHT);
    this.add.image(0, 0, 'darknessMap')
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(30);

    this.sonarActiveUntil = 0;
    this.sonarCooldownUntil = 0;

    // 7. Controles y capa de interfaz (HUD)
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      sonar: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    this.touchState = { up: false, down: false, left: false, right: false };
    this.createHUD();

    this.input.keyboard.on('keydown-R', () => this.scene.restart());
    this.input.keyboard.on('keydown-M', () => sfx.toggleMute());

    this.startTime = this.time.now;
  }

  isInsideChannel(x, y, threshold = 130) {
    for (let i = 0; i < this.curveSamples.length; i++) {
      const pt = this.curveSamples[i];
      if (Phaser.Math.Distance.Between(x, y, pt.x, pt.y) <= threshold) {
        return true;
      }
    }
    return false;
  }

  createHUD() {
    this.add.text(SCREEN_WIDTH / 2, 26, 'VISTA CENITAL - USA WASD | [ESPACIO] SONAR', {
      fontFamily: 'monospace',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#e2e8f0',
      backgroundColor: '#0f172acc',
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(40);

    this.add.rectangle(910, 34, 170, 44, 0x0f172a, 0.9)
      .setStrokeStyle(2, 0x38bdf8)
      .setScrollFactor(0)
      .setDepth(40);

    this.timerText = this.add.text(910, 34, '00:00:00', {
      fontFamily: 'monospace',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(41);

    this.statusText = this.add.text(24, 20, 'CASCO: 100%\nCORRIENTE: 320 px/s', {
      fontFamily: 'monospace',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#38bdf8',
      backgroundColor: '#0f172acc',
      padding: { x: 10, y: 6 }
    }).setScrollFactor(0).setDepth(40);

    const baseX = 880;
    const baseY = 640;
    const btnSpec = [
      { dir: 'up', x: baseX, y: baseY - 58, label: '▲' },
      { dir: 'left', x: baseX - 58, y: baseY, label: '◀' },
      { dir: 'down', x: baseX, y: baseY, label: '▼' },
      { dir: 'right', x: baseX + 58, y: baseY, label: '▶' }
    ];

    btnSpec.forEach((b) => {
      const rect = this.add.rectangle(b.x, b.y, 50, 50, 0x334155, 0.75)
        .setStrokeStyle(2, 0x94a3b8)
        .setScrollFactor(0)
        .setDepth(40)
        .setInteractive();

      this.add.text(b.x, b.y, b.label, {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ffffff'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(41);

      rect.on('pointerdown', () => { this.touchState[b.dir] = true; rect.setFillStyle(0x38bdf8, 0.9); });
      rect.on('pointerup', () => { this.touchState[b.dir] = false; rect.setFillStyle(0x334155, 0.75); });
      rect.on('pointerout', () => { this.touchState[b.dir] = false; rect.setFillStyle(0x334155, 0.75); });
    });
  }

  handleEnemyContact() {
    if (this.isFinished) return;
    if (this.player.takeDamage(25, this.time.now)) {
      sfx.playHit();
      this.cameras.main.shake(220, 0.012);

      if (this.player.hull <= 0) {
        this.isFinished = true;
        this.player.setVelocity(0, 0);
        this.scene.start('EndScene', {
          victory: false,
          timeFormatted: this.formatElapsedTime(this.time.now - this.startTime),
          hull: 0
        });
      }
    }
  }

  reachGoal() {
    if (this.isFinished) return;
    this.isFinished = true;
    this.player.setVelocity(0, 0);
    sfx.playWin();

    this.scene.start('EndScene', {
      victory: true,
      timeFormatted: this.formatElapsedTime(this.time.now - this.startTime),
      hull: this.player.hull
    });
  }

  formatElapsedTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    const centiseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
    return `${minutes}:${seconds}:${centiseconds}`;
  }

  update(time) {
    if (this.isFinished) return;

    this.timerText.setText(this.formatElapsedTime(time - this.startTime));

    if (Phaser.Input.Keyboard.JustDown(this.keys.sonar) && time > this.sonarCooldownUntil) {
      this.sonarActiveUntil = time + 2200;
      this.sonarCooldownUntil = time + 3500;
      sfx.playPing();
      this.enemies.children.iterate((mob) => {
        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, mob.x, mob.y) < 650) {
          mob.alertUntil = time + 4000;
        }
      });
    }

    const onChannel = this.isInsideChannel(this.player.x, this.player.y, 130);
    const currentMaxSpeed = onChannel ? SPEED_TRENCH : SPEED_SILT;

    this.statusText.setText(
      `CASCO: ${this.player.hull}% | ${onChannel ? 'CORRIENTE: 320 px/s' : 'SEDIMENTO: 140 px/s (<160)'}`
    );

    const inputState = {
      left: this.cursors.left.isDown || this.keys.left.isDown || this.touchState.left,
      right: this.cursors.right.isDown || this.keys.right.isDown || this.touchState.right,
      up: this.cursors.up.isDown || this.keys.up.isDown || this.touchState.up,
      down: this.cursors.down.isDown || this.keys.down.isDown || this.touchState.down
    };

    this.player.handleMovement(inputState, currentMaxSpeed, time);

    this.enemies.children.iterate((mob) => mob.updateAI(this.player, time));

    this.updateDarknessLayer(time);
  }

  updateDarknessLayer(time) {
    const ctx = this.darknessCanvas.getContext();
    const cam = this.cameras.main;
    const subX = this.player.x - cam.scrollX;
    const subY = this.player.y - cam.scrollY;

    ctx.globalCompositeOperation = 'source-over';
    const isSonar = time < this.sonarActiveUntil;
    ctx.fillStyle = isSonar ? 'rgba(3, 12, 28, 0.45)' : 'rgba(2, 6, 15, 0.93)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    ctx.globalCompositeOperation = 'destination-out';

    const aura = ctx.createRadialGradient(subX, subY, 15, subX, subY, 120);
    aura.addColorStop(0, 'rgba(0,0,0,1)');
    aura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(subX, subY, 120, 0, Math.PI * 2);
    ctx.fill();

    const angle = this.player.rotation;
    const spread = 0.48;
    const length = 340;
    ctx.fillStyle = 'rgba(0,0,0,0.88)';
    ctx.beginPath();
    ctx.moveTo(subX, subY);
    ctx.arc(subX, subY, length, angle - spread, angle + spread);
    ctx.closePath();
    ctx.fill();

    this.darknessCanvas.refresh();
  }
}