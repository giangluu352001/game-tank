import { Bullet } from './bullet';
import { IImageConstructor } from '../interfaces/image.interface';
import { Tank } from './tank';

export class Enemy extends Tank {

  constructor(aParams: IImageConstructor) {
    super(aParams);
    this.initContainer();
  }

  private initContainer() {
    // variables
    this.health = 1;
    this.lastShoot = 0;
    this.speed = 100;

    // image
    this.setDepth(0);

    this.barrel = this.scene.add.image(0, 0, 'barrelRed');
    this.barrel.setOrigin(0.5, 1);
    this.barrel.setDepth(1);

    this.lifeBar = this.scene.add.graphics();
    this.redrawLifebar();

    // game objects
    this.bullets = this.scene.add.group({
      /*classType: Bullet,*/
      active: true,
      maxSize: 10,
      runChildUpdate: true
    });

    // tweens
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

  update(): void {
    if (this.active) {
      this.setAccessoriesPosition();
      this.handleShooting();
    }
    else {
      let score = this.scene.registry.get('score');
      this.scene.registry.set('score', score + 1);
      this.emitter.explode(10, this.x, this.y);;
      this.isDead();
    }
  }

  protected handleShooting(): void {
    if (this.scene.time.now > this.lastShoot) {
      if (this.bullets.getLength() < 10) {
        this.bullets.add(
          new Bullet({
            scene: this.scene,
            rotation: this.barrel.rotation,
            x: this.barrel.x,
            y: this.barrel.y,
            texture: 'bulletRed'
          })
        );

        this.lastShoot = this.scene.time.now + 400;
      }
    }
  }
  public updateHealth(): void {
    super.updateHealth(0.05);
  }
}
