import { IImageConstructor } from "../interfaces/image";
import { ITank } from "../interfaces/tank";
import { GameScene } from "../scenes/GameScene";
import { Bullet } from "./bullet";

export abstract class Tank extends Phaser.GameObjects.Image implements ITank {
    scene: GameScene;
    body: Phaser.Physics.Arcade.Body;

    protected health: number;
    protected lastShoot: number;
    protected speed: number;
    protected shootingDelay: number; 
    protected bullets: Phaser.GameObjects.Group;
    protected barrel: Phaser.GameObjects.Image;

    protected isPaused: boolean;
    protected lifeBar: Phaser.GameObjects.Graphics;
    protected particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
    
    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.isPaused = false;
        this.particles = this.scene.add.particles('explosion').setDepth(5);
        this.createFireExplosion();
        this.createSmokeExplosion();
        this.createStoneExplosion();
    }

    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets;
    }

    public getBarrel(): Phaser.GameObjects.Image {
        return this.barrel;
    }

    protected redrawLifebar(): void {
        this.lifeBar.clear();
        this.lifeBar.fillStyle(0xe66a28, 1);
        this.lifeBar.fillRect(-this.width / 2, this.height / 2, this.width * this.health, 15);
        this.lifeBar.lineStyle(2, 0xffffff);
        this.lifeBar.strokeRect(-this.width / 2, this.height / 2, this.width, 15);
        this.lifeBar.setDepth(1);
    }

    public updateHealth(val: number): void {
        if (this.health > 0) {
            this.health -= val;
            this.redrawLifebar();
        } 
        else {
            this.health = 0;
            this.active = false;
        }
    }  
    public isDead(): boolean {
        return !this.active;
    }

    public emitExplosion(): void {
        this.particles.emitParticleAt(this.x, this.y);
        this.scene.time.delayedCall(1000, () => this.particles.destroy());
    }

    protected destroyAll(): void {
        this.barrel.destroy();
        this.lifeBar.destroy();
        this.bullets.getChildren().forEach((bullet: Bullet) => {
            bullet.destroyAll();
        });
        this.destroy();
    }

    protected setAccessoriesPosition(): void {
        this.barrel.x = this.x;
        this.barrel.y = this.y;
        this.lifeBar.x = this.x;
        this.lifeBar.y = this.y;
    }

    public abstract move(speed?: number): void;
    public abstract shoot(): void;

    public pause(): void {
        this.isPaused = true;
        this.bullets.getChildren()
        .forEach((bullet: Bullet) => {
          if (bullet.active)
            bullet.pauseEmitter();
        });
      }
      
    public resume(): void {
        this.isPaused = false;
        this.bullets.getChildren()
        .forEach((bullet: Bullet) => {
          if (bullet.active)
            bullet.resumeEmitter();
        });
    }

    private createFireExplosion(): void {
        this.particles.createEmitter({
          frame: 'muzzleflash3',
          alpha: { start: 1, end: 0 },
          scale: { start: 1, end: 2 },
          speed: { min: 200, max: 500 },
          on: false,
          quantity: 15,
          gravityY: -100,
          angle: { min: 0, max: 360 },
          blendMode: 'ADD',
          lifespan: 500
        });
    }

    private createSmokeExplosion(): void {
        this.particles.createEmitter({
            frame: [ 'smoke-puff', 'smoke-puff' ],
            angle: { min: 180, max: 360 },
            speed: { min: 500, max: 800 },
            quantity: 6,
            lifespan: 2000,
            alpha: { start: 1, end: 0 },
            scale: { start: 1.5, end: 0.5 },
            on: false
        });
    }

    private createStoneExplosion(): void {
        this.particles.createEmitter({
            frame: 'stone',
            angle: { min: 240, max: 300 },
            speed: { min: 400, max: 600 },
            quantity: { min: 10, max: 20 },
            lifespan: 4000,
            alpha: { start: 1, end: 0 },
            scale: { min: 0.05, max: 0.4 },
            rotate: { start: 0, end: 360, ease: 'Back.easeOut' },
            gravityY: 800,
            on: false
        });
    
    }
}