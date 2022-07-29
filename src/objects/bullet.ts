import { IBulletConstructor } from '../interfaces/bullet';

export class Bullet extends Phaser.GameObjects.Image {
  body: Phaser.Physics.Arcade.Body;
  private particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private flyEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private hitEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private speed: number;
  private damage: number;
  private color: string;

  constructor(aParams: IBulletConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);
    this.rotation = aParams.rotation;
    this.damage = aParams.damage;
    this.color = aParams.color;
    this.init();
    this.scene.add.existing(this);
  }

  public getDamage(): number {
    return this.damage;
  }

  public gotHit(): void {
    this.setActive(false);
    this.setVisible(false);
    this.flyEmitter.stop();
    this.hitEmitter.emitParticleAt(this.x, this.y);
    this.scene.physics.world.disable(this);
  }

  public destroyAll(): void {
    this.particles.destroy();
    this.destroy();
  }

  public pauseEmitter(): void {
    this.flyEmitter.pause();
  }

  public resumeEmitter(): void {
    this.flyEmitter.resume();
  }

  public fire(rotation: number, x: number, y: number): void {
    this.rotation = rotation;
    this.scene.physics.world.enable(this);
    this.scene.physics.velocityFromRotation(
      this.rotation - Math.PI / 2,
      this.speed,
      this.body.velocity
    );
    this.x = x;
    this.y = y;
    this.setActive(true);
    this.setVisible(true);
    this.flyEmitter.start();
  }

  private init(): void {
    this.speed = 1000;
    this.setOrigin(0.5, 0.5);
    this.setDepth(2);
    this.setVisible(false);
    this.setActive(false);
    this.particles = this.scene.add.particles('flares');
    this.addFlyEffect();
    this.addHitEffect();
  }

  private addFlyEffect(): void {
    this.flyEmitter = this.particles.createEmitter({
        frame: this.color,
        follow: this,
        lifespan: 100,
        speed: 100,
        scale: { start: 0.3, end: 0 },
        blendMode: 'ADD',
        on: false
    });
  }

  private addHitEffect(): void {
    this.hitEmitter = this.particles.createEmitter({
        frame: this.color,
        angle: { start: 0, end: 360, steps: 15 },
        lifespan: 500,
        speed: 200,
        quantity: 15,
        scale: { start: 0.5, end: 0 },
        on: false
    });
  }
}
