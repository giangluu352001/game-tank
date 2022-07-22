import { IBulletConstructor } from '../interfaces/bullet.interface';

export class Bullet extends Phaser.GameObjects.Image {
  body: Phaser.Physics.Arcade.Body;
  private particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private bulletSpeed: number;

  constructor(aParams: IBulletConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);
    this.rotation = aParams.rotation;
    this.initImage();
    this.scene.add.existing(this);
  }

  private initImage(): void {
    this.bulletSpeed = 1000;
    this.setOrigin(0.5, 0.5);
    this.setDepth(2);

    this.scene.physics.world.enable(this);
    this.scene.physics.velocityFromRotation(
      this.rotation - Math.PI / 2,
      this.bulletSpeed,
      this.body.velocity
    );
  }

  public addParticle(): void {
    this.particles = this.scene.add.particles('flares');
    this.particles.createEmitter({
        frame: 'blue',
        follow: this,
        lifespan: 200,
        speed: { min: 600, max: 800 },
        angle: this.rotation * 180 / Math.PI - 90,
        scale: { start: 0.4, end: 0 },
        blendMode: 'ADD'
    });
  }
  public destroyAll(): void {
      if (this.particles) 
        this.particles.destroy();
      this.destroy();
  }
}
