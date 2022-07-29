import { Player } from '../objects/player';
import { Enemy } from '../objects/enemy';
import { Obstacle } from '../objects/obstacle';
import { Bullet } from '../objects/bullet';
import { PausePopUp } from '../ui/PausePopUp';
import { GameOverPopUp } from '../ui/GameOverPopUp';
import { Button } from '../ui/Button';

export class GameScene extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private layer: Phaser.Tilemaps.TilemapLayer;

  private player: Player;
  private enemies: Phaser.GameObjects.Group;
  private obstacles: Phaser.GameObjects.Group;
  private score: Phaser.GameObjects.Text;

  private pauseButton: Button;
  private pausePopUp: PausePopUp;
  private gameOverPopUp: GameOverPopUp;

  private soundState: boolean;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.obstacles = this.add.group({ runChildUpdate: true });
    this.enemies = this.add.group();
    this.soundState = true;

    this.createTileMap();
    this.addObjects();
    this.addScoreText();
    this.createButtons();
    this.createPopUps();
    this.addColliders();
    
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
  }

  update(): void {
    this.player.update();
    this.enemies.children.each((enemy: Enemy) => {
      enemy.update();
      if (!this.player.isDead()) 
        enemy.changeShootingAngle(this.player.body.x, this.player.body.y);
    }, this);
  }

  public pause = (): void => {
    this.physics.pause();
    this.tweens.pauseAll();
    this.player.pause();
    this.enemies.getChildren()
      .forEach((enemy: Enemy) => enemy.pause());
    this.pauseButton.hide();
    this.pausePopUp.show()
  }

  public resume = (): void => {
    this.physics.resume();
    this.tweens.resumeAll();
    this.player.resume();
    this.enemies.getChildren()
      .forEach((enemy: Enemy) => enemy.resume());
    this.pauseButton.show();
    this.pausePopUp.hide();
  }
  
  public gameOver = (): void => {
    this.cameras.main.flash();
    this.updateHighScore();
    this.pauseButton.hide();
    this.gameOverPopUp.show();
  }

  public replay = (): void => {
      this.registry.set('score', 0);
      this.gameOverPopUp.hide();
      this.pauseButton.show();
      this.scene.restart();
  }

  public controllSound(button: Button): void {
    if (this.soundState) {
      this.sound.mute = true;
      button.setTint(0x2A1335);
    }
    else {
      this.sound.mute = false;
      button.clearTint();
    }
    this.soundState = !this.soundState;
  }

  private updateHighScore(): void {
    let score = this.registry.get('score');
    let highScore = this.registry.get('highScore');
    this.registry.set('highScore', Math.max(highScore, score));
    this.gameOverPopUp.setScoreText();
  }

  private createTileMap(): void {
    this.map = this.make.tilemap({ key: 'levelMap' });
    this.tileset = this.map.addTilesetImage('tiles');
    this.layer = this.map.createLayer('tileLayer', this.tileset, 0, 0);
    this.layer.setCollisionByProperty({ collide: true });
  }

  private createPopUps(): void {
    this.pausePopUp = new PausePopUp(
      this,
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
    );
    
    this.gameOverPopUp = new GameOverPopUp(
      this,
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
    );
  }

  private createButtons(): void {
    this.pauseButton = new Button(
      this,
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2 - 400,
      'PAUSE'
    );
    this.pauseButton.setInteraction(this.pause);
  }

  private addScoreText(): void {
    this.score = this.add.text(
      this.sys.canvas.width / 2 - 60,
      50,
      `Score ${this.registry.get('score')}`
    ).setDepth(3).setScrollFactor(0, 0).setFontSize(35);
  }

  private updateScore(): void {
    let score = this.registry.get('score');
    this.registry.set('score', score + 1);
    this.score.setText(`Score: ${this.registry.get('score')}`) ;
  }

  private addObjects(): void {
    const objects = this.map.getObjectLayer('objects').objects;
    objects.forEach((object) => {
      switch(object.type) {
        case 'player':
          this.player = this.createPlayer(object);
          break;
        case 'enemy':
          this.enemies.add(this.createEnemy(object));
          break;
        default:
          this.obstacles.add(this.createObstacle(object));
          break;
      }
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
    bullet.gotHit();
  }

  private bulletHitObstacles = (bullet: Bullet, obstacle: Obstacle): void => {
    bullet.gotHit();
  }

  private enemyBulletHitPlayer = (bullet: Bullet, player: Player): void => {
    bullet.gotHit();
    player.gotHurt(bullet.getDamage());
  }

  private playerBulletHitEnemy = (bullet: Bullet, enemy: Enemy): void => {
    this.sound.play('hit');
    bullet.gotHit();
    enemy.gotHurt(bullet.getDamage());
    if (enemy.isDead())
      this.updateScore();
  }
}
