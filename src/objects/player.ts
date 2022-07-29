import { Bullet } from './bullet';
import { IImageConstructor } from '../interfaces/image';
import { Tank } from './tank';
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js';

export class Player extends Tank {
  private moveJoystick: VirtualJoystick;
  private shootingJoystick: VirtualJoystick;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys: Map<string, Phaser.Input.Keyboard.Key>;

  constructor(aParams: IImageConstructor) {
    super(aParams);
    this.init();
    this.scene.add.existing(this);
  }

  public shoot(): void {
    if (!this.isPaused) {
      if ((this.keys.get('shooting').isDown || this.shootingJoystick.force != 0)
        && this.scene.time.now > this.lastShoot) {
        this.scene.cameras.main.shake(20, 0.005);
        this.scene.sound.play('shoot');
        this.shootingAnimation();
        let bullet = this.bullets.get();
        if (bullet) {
          bullet.fire(this.barrel.rotation, this.barrel.x, this.barrel.y);
          this.lastShoot = this.scene.time.now + this.shootingDelay;
        }
      }
    }
  }

  public move(speed: number): void {
    this.scene.physics.velocityFromRotation(
      this.rotation - Math.PI / 2,
      speed,
      this.body.velocity
    );
  }

  public gotHurt(damage: number): void {
    this.updateHealth(damage);
    if (this.isDead()) {
      this.emitExplosion();
      this.scene.time.addEvent({
        delay: 1000,
        callback: this.scene.gameOver,
        callbackScope: this
      });
    }
  }

  private init() {
    this.health = 1;
    this.lastShoot = 0;
    this.speed = 300;
    this.shootingDelay = 80;

    this.setOrigin(0.5, 0.5);
    this.setDepth(0);
    this.angle = 180;

    this.barrel = this.scene.add.image(this.x, this.y, 'barrelBlue');
    this.barrel.setOrigin(0.5, 1);
    this.barrel.setDepth(1);
    this.barrel.angle = 180;

    this.lifeBar = this.scene.add.graphics();
    this.redrawLifebar();
    this.moveJoystick = this.createJoyStick(
      this.scene.sys.canvas.width / 2 - 200,
      this.scene.sys.canvas.height - 100
    );
    this.shootingJoystick = this.createJoyStick(
      this.scene.sys.canvas.width / 2 + 300,
      this.scene.sys.canvas.height - 100
    );
    this.bullets = this.scene.add.group({
      classType: Bullet,
      maxSize: 10,
      runChildUpdate: true
    });

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keys = new Map([
      ['rotateLeft', this.addKey('A')],
      ['rotateRight', this.addKey('D')],
      ['shooting', this.addKey('SPACE')]
    ]);

    if (this.scene.sys.game.device.os.desktop) {
      this.moveJoystick.setVisible(false);
      this.shootingJoystick.setVisible(false);
    }
    else {
      this.scene.input.addPointer(2);
    }

    this.createBulletPools(10);
  }

  private addKey(key: string): Phaser.Input.Keyboard.Key {
    return this.scene.input.keyboard.addKey(key);
  }

  update(): void {
    if (this.active) {
      this.setAccessoriesPosition();
      this.handleInput();
      this.shoot();
    }
    else this.destroyAll();
  }
  
  private createJoyStick(x: number, y: number) {
    return new VirtualJoystick(this.scene, {
        x: x, 
        y: y,
        radius: 40,
        base: this.scene.add.circle(0, 0, 40, 0xC0C6CE),
        thumb: this.scene.add.circle(0, 0, 30, 0xffffff)
    });
}

  private handleInput(): void {
    if (this.moveJoystick.force != 0) {
      this.rotation = this.moveJoystick.rotation + Math.PI / 2;
      this.move(this.speed);
    }

    else {
      if (this.cursors.up.isDown)
        this.move(this.speed);
      else if (this.cursors.down.isDown)
        this.move(-this.speed);
      else this.body.setVelocity(0, 0);

      if (this.cursors.left.isDown)
        this.rotation -= 0.02;
      else if (this.cursors.right.isDown)
        this.rotation += 0.02;
    }

    this.handleBarrelRotation();
  }

  private handleBarrelRotation(): void {
    if (this.shootingJoystick.force != 0)
      this.barrel.rotation = this.shootingJoystick.rotation + Math.PI / 2;
    else {
      if (this.keys.get('rotateLeft').isDown)
        this.barrel.rotation -= 0.05;
      else if (this.keys.get('rotateRight').isDown)
        this.barrel.rotation += 0.05;
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
        texture: 'bulletBlue',
        damage: 0.05,
        color: 'blue'
      });
      this.bullets.add(bullet);
    }
  }

  private shootingAnimation(): void {
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
  }
}