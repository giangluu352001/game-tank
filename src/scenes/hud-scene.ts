import { GameOverPopUp } from "../objects/popup/gameoverPopUp";
import { PauseButton } from "../objects/popup/pauseButton";
import { PausePopUp } from "../objects/popup/pausePopUp";

export class HUDScene extends Phaser.Scene {
    private soundState: boolean;
    private pauseButton: PauseButton;
    private gameOverPopUp: GameOverPopUp;
    private pausePopUp: PausePopUp;
    constructor() {
      super({ key: 'HUDScene' });
    }
    create(): void {
      let initContainer = {
        scene: this,
        x: this.sys.canvas.width / 2,
        y: this.sys.canvas.height / 2
      }
      this.soundState = true;
      this.pauseButton = new PauseButton(initContainer);
      this.pausePopUp = new PausePopUp(initContainer).setVisible(false);
      this.gameOverPopUp = new GameOverPopUp(initContainer).setVisible(false);
    }
    public pause(): void {
      this.pauseButton.setVisible(false);
      this.scene.pause('GameScene');
      this.showPopUp(this.pausePopUp);
    }
    public resume(): void {
      this.pauseButton.setVisible(true);
      this.pausePopUp.setVisible(false);
      this.scene.resume('GameScene');
    }
    public gameOver(): void {
      let score = this.registry.get('score');
      let highScore = this.registry.get('highScore');
      this.registry.set('highScore', Math.max(highScore, score));
      this.gameOverPopUp.setScoreText();
      this.cameras.main.flash();
      this.showPopUp(this.gameOverPopUp);
    }
    public reinit(): void {
        this.registry.set('score', 0);
        this.gameOverPopUp.setVisible(false);
        this.scene.launch('GameScene');
        this.pauseButton.setVisible(true);
    }
    public controllSound(button: Phaser.GameObjects.Image): void {
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
    private showPopUp(popup: Phaser.GameObjects.Container): void {
      popup.setVisible(true);
      this.tweens.add({
        targets: popup,
        duration: 400,
        y: { from: popup.y - 100, to: popup.y},
        loop: false
      });
    }
  }