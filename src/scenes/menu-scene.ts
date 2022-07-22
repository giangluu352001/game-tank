export class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key;
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
  constructor() {
    super({
      key: 'MenuScene'
    });
  }

  init(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.startKey.isDown = false;
    this.initGlobalData();
  }

  create(): void {
    this.add.image(0, 0, 'tank');

    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 133,
        this.sys.canvas.height / 2 + 10,
        'font',
        'PRESS KEY S TO PLAY',
        30
      )
    );

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

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start('HUDScene');
      this.scene.start('GameScene');
      this.scene.bringToTop('HUDScene');
    }
  }

  private initGlobalData(): void {
    this.registry.set('score', 0);
    this.registry.set('highScore', 0);
  }
}
