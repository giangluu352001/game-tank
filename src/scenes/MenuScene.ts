export class MenuScene extends Phaser.Scene {
  private startButton: Phaser.GameObjects.Image;
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
  constructor() {
    super({
      key: 'MenuScene'
    });
  }

  init(): void {
    this.initGlobalData();
  }

  create(): void {
    this.add.image(0, 0, 'tank');
    this.startButton = this.add.image(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2 + 100,
      'play');
    this.startButton
      .setScale(3)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('GameScene'));

    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 120,
        this.sys.canvas.height / 2 - 100,
        'font',
        'TANK',
        100
      )
    );
  }

  private initGlobalData(): void {
    this.registry.set('score', 0);
    this.registry.set('highScore', 0);
  }
}
