import { IImageConstructor } from '../interfaces/image';

export class Obstacle extends Phaser.GameObjects.Image {
  body: Phaser.Physics.Arcade.Body;

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);
    this.initImage();
    this.scene.add.existing(this);
  }

  private initImage(): void {
    this.setOrigin(0, 0);
    this.scene.physics.world.enable(this);
    this.body.setImmovable(true);
  }
  
}
