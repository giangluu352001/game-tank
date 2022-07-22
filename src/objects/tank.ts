import { IImageConstructor } from "../interfaces/image.interface";

export abstract class Tank extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;

    protected health: number;
    protected lastShoot: number;
    protected speed: number;

    protected lifeBar: Phaser.GameObjects.Graphics;
    protected bullets: Phaser.GameObjects.Group;
    protected barrel: Phaser.GameObjects.Image;
    protected emitter: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.handleExplosion();
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

    public updateHealth(): void {
        if (this.health > 0) {
            this.health -= 0.05;
            this.redrawLifebar();
        } 
        else {
            this.health = 0;
            this.active = false;
        }
    }  
    protected isDead(): void {
        this.destroy();
        this.barrel.destroy();
        this.lifeBar.destroy();
    }

    protected setAccessoriesPosition(): void {
        this.barrel.x = this.x;
        this.barrel.y = this.y;
        this.lifeBar.x = this.x;
        this.lifeBar.y = this.y;
    }

    protected abstract handleShooting(): void;

    protected handleExplosion(): void {
        this.emitter = this.scene.add.particles('flame').setDepth(5)
        .createEmitter({
          alpha: { start: 1, end: 0 },
          scale: { start: 0.5, end: 1.5 },
          speed: { min: -700, max: 700 },
          on: false,
          gravityY: 500,
          angle: { min: 0, max: 360 },
          blendMode: 'ADD',
          lifespan: 500
        });
    } 
}