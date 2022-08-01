import { Bullet } from './bullet';
import { IImageConstructor } from '../interfaces/image';
import { Tank } from './tank';

export class Enemy extends Tank {

  constructor(aParams: IImageConstructor) {
    super(aParams);
    this.init();
  }

  private init(): void {
    this.health = 1;
    this.lastShoot = 0;
    this.speed = 100;
    this.shootingDelay = 400;

    this.setDepth(0);

    this.barrel = this.scene.add.image(0, 0, 'barrelRed');
    this.barrel.setOrigin(0.5, 1);
    this.barrel.setDepth(1);

    this.lifeBar = this.scene.add.graphics();
    this.redrawLifebar();

    this.bullets = this.scene.add.group({
      classType: Bullet,
      maxSize: 5,
      runChildUpdate: true
    });
    this.createBulletPools(5);
    this.move();
  }

  update(): void {
    if (this.active) {
      this.setAccessoriesPosition();
      this.shoot();
    }
    else this.destroyAll();
  }

  public changeShootingAngle(playerX: number, playerY: number): void {
    if (this.active) {
      let angle = Phaser.Math.Angle.Between(
        this.body.x,
        this.body.y,
        playerX,
        playerY
      );
      this.barrel.setAngle((angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG);
    }
  }

  public move(): void {
    this.moveAnimation();
  }

  private moveAnimation(): void {
    this.scene.tweens.add({
      targets: this,
      props: { y: this.y - 200 },
      delay: 0,
      duration: 2000,
      ease: 'Linear',
      easeParams: null,
      hold: 0,
      repeat: -1,
      repeatDelay: 0,
      yoyo: true
    });
  }

  public shoot(): void {
    if (!this.isPaused) {
      if (this.scene.time.now > this.lastShoot) {
        let bullet = this.bullets.get();
        if (bullet) {
          bullet.fire(this.barrel.rotation, this.barrel.x, this.barrel.y);
          this.lastShoot = this.scene.time.now + this.shootingDelay;
        }
      }
    }
  }

  private createBulletPools(quantity: number): void {
    for (let i = 0; i < quantity; i++) 
    {
      let bullet = new Bullet({
        scene: this.scene,
        rotation: this.barrel.rotation,
        x: this.barrel.x,
        y: this.barrel.y,
        texture: 'bulletRed',
        damage: 0.01,
        color: 'red'
      });
      this.bullets.add(bullet);
    }
  }

  public gotHurt(damage: number): void {
    this.updateHealth(damage);
    if (this.isDead()) this.emitExplosion();
  }
}
