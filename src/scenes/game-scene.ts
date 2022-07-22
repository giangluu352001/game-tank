import { Player } from '../objects/player';
import { Enemy } from '../objects/enemy';
import { Obstacle } from '../objects/obstacle';
import { Bullet } from '../objects/bullet';

export class GameScene extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private layer: Phaser.Tilemaps.TilemapLayer;

  private player: Player;
  private enemies: Phaser.GameObjects.Group;
  private obstacles: Phaser.GameObjects.Group;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.obstacles = this.add.group({ runChildUpdate: true });
    this.enemies = this.add.group();

    this.createTileMap();
    this.createObjects();
    this.addColliders();
    
    this.cameras.main.startFollow(this.player);
  }

  update(): void {
    this.player.update();

    this.enemies.children.each((enemy: Enemy) => {
      enemy.update();
      if (this.player.active && enemy.active) {
        let angle = Phaser.Math.Angle.Between(
          enemy.body.x,
          enemy.body.y,
          this.player.body.x,
          this.player.body.y
        );
        enemy.getBarrel().angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
      }
    }, this);
  }

  private createTileMap(): void {
    this.map = this.make.tilemap({ key: 'levelMap' });
    this.tileset = this.map.addTilesetImage('tiles');
    this.layer = this.map.createLayer('tileLayer', this.tileset, 0, 0);
    this.layer.setCollisionByProperty({ collide: true });
  }

  private createObjects(): void {
    const objects = this.map.getObjectLayer('objects').objects;
    objects.forEach((object) => {
      if (object.type === 'player')
        this.player = this.createPlayer(object);
      else if (object.type === 'enemy')
        this.enemies.add(this.createEnemy(object));
      else 
        this.obstacles.add(this.createObstacle(object));
    });
  }
  private createEnemy(object: Phaser.Types.Tilemaps.TiledObject): Enemy {
    return new Enemy({
      scene: this,
      x: object.x,
      y: object.y,
      texture: 'tankRed'
    });
  }

  private createObstacle(object: Phaser.Types.Tilemaps.TiledObject): Obstacle {
    return new Obstacle({
      scene: this,
      x: object.x,
      y: object.y - 40,
      texture: object.type
    });
  }

  private createPlayer(object: Phaser.Types.Tilemaps.TiledObject): Player {
    return new Player({
      scene: this,
      x: object.x,
      y: object.y,
      texture: 'tankBlue'
    });
  }

  private addColliders(): void {
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.collider(this.player, this.obstacles);

    this.physics.add.collider(this.player.getBullets(), this.layer, this.bulletHitLayer);
    this.physics.add.collider(this.player.getBullets(), this.obstacles, this.bulletHitObstacles);

    this.enemies.children.each((enemy: Enemy) => {
      this.physics.add.overlap(this.player.getBullets(), enemy, this.playerBulletHitEnemy);
      this.physics.add.overlap(enemy.getBullets(), this.player, this.enemyBulletHitPlayer);
      this.physics.add.collider(enemy.getBullets(), this.obstacles, this.bulletHitObstacles);
      this.physics.add.collider(enemy.getBullets(), this.layer, this.bulletHitLayer);
    }, this);
  }

  private bulletHitLayer= (bullet: Bullet): void => {
    bullet.destroyAll();
  }

  private bulletHitObstacles = (bullet: Bullet, obstacle: Obstacle): void => {
    bullet.destroyAll();
  }

  private enemyBulletHitPlayer = (bullet: Bullet, player: Player): void => {
    bullet.destroyAll();
    player.updateHealth();
  }

  private playerBulletHitEnemy = (bullet: Bullet, enemy: Enemy): void => {
    bullet.destroyAll();
    this.sound.play('hit');
    enemy.updateHealth();
  }
}
