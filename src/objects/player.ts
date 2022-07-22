import { Bullet } from './bullet';
import { IImageConstructor } from '../interfaces/image.interface';
import { Tank } from './tank';
import { HUDScene } from '../scenes/hud-scene';

export class Player extends Tank {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys: Map<string, Phaser.Input.Keyboard.Key>;

  constructor(aParams: IImageConstructor) {
    super(aParams);
    this.initImage();
    this.scene.add.existing(this);
  }

  private initImage() {
    // variables
    this.health = 1;
    this.lastShoot = 0;
    this.speed = 300;

    // image
    this.setOrigin(0.5, 0.5);
    this.setDepth(0);
    this.angle = 180;

    this.barrel = this.scene.add.image(this.x, this.y, 'barrelBlue');
    this.barrel.setOrigin(0.5, 1);
    this.barrel.setDepth(1);
    this.barrel.angle = 180;

    this.lifeBar = this.scene.add.graphics();
    this.redrawLifebar();

    // game objects
    this.bullets = this.scene.add.group({
      /*classType: Bullet,*/
      active: true,
      maxSize: 10,
      runChildUpdate: true
    });

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keys = new Map([
      ['rotateLeft', this.addKey('A')],
      ['rotateRight', this.addKey('D')],
      ['shooting', this.addKey('SPACE')]
    ]);
  }

  private addKey(key: string): Phaser.Input.Keyboard.Key {
    return this.scene.input.keyboard.addKey(key);
  }

  update(): void {
    if (this.active) {
      this.setAccessoriesPosition();
      this.handleInput();
      this.handleShooting();
    } 
    else this.isDead(); 
  }

  private handleInput(): void {
    // move tank forward
    // small corrections with (- MATH.PI / 2) to align tank correctly
    if (this.cursors.up.isDown) {
      this.scene.physics.velocityFromRotation(
        this.rotation - Math.PI / 2,
        this.speed,
        this.body.velocity
      );
    } 
    else if (this.cursors.down.isDown) {
      this.scene.physics.velocityFromRotation(
        this.rotation - Math.PI / 2,
        -this.speed,
        this.body.velocity
      );
    } 
    else this.body.setVelocity(0, 0);

    // rotate tank
    if (this.cursors.left.isDown)
      this.rotation -= 0.02;
    else if (this.cursors.right.isDown)
      this.rotation += 0.02;

    // rotate barrel
    if (this.keys.get('rotateLeft').isDown)
      this.barrel.rotation -= 0.05;
    else if (this.keys.get('rotateRight').isDown)
      this.barrel.rotation += 0.05;
  }

  protected handleShooting(): void {
    if (this.keys.get('shooting').isDown && this.scene.time.now > this.lastShoot) {
      this.scene.cameras.main.shake(20, 0.005);
      this.scene.sound.play('shoot');
      this.scene.tweens.add({
        targets: this,
        props: { alpha: 0.8 },
        delay: 0,
        duration: 5,
        ease: 'Power1',
        easeParams: null,
        hold: 0,
        repeat: 0,
        repeatDelay: 0,
        yoyo: true,
        paused: false
      });

      if (this.bullets.getLength() < 10) {
        let bullet = new Bullet({
          scene: this.scene,
          rotation: this.barrel.rotation,
          x: this.barrel.x,
          y: this.barrel.y,
          texture: 'bulletBlue'
        });
        this.bullets.add(bullet);
        bullet.addParticle();
        this.lastShoot = this.scene.time.now + 80;
      }
    }
  }

  public updateHealth(): void {
    super.updateHealth();
    if (!this.active) {
      this.emitter.explode(10, this.x, this.y);
      let scene = this.scene.scene.get('HUDScene') as HUDScene;
      this.scene.time.addEvent({
        delay: 500,
        callback: () => scene.gameOver(),
        callbackScope: this
      });
    }
  }
}