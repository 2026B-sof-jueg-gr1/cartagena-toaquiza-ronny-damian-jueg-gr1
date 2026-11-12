import { TextureFactory } from '../systems/TextureFactory.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    TextureFactory.createBootTextures(this);
    this.scene.start('PreloaderScene');
  }
}