import { IContainerConstructor } from "../../interfaces/container.interface";
import { HUDScene } from "../../scenes/hud-scene";

export class GameOverPopUp extends Phaser.GameObjects.Container {
    scene: HUDScene;

    private board: Phaser.GameObjects.Image;
    private button: Phaser.GameObjects.Image;
    private scoreText: Phaser.GameObjects.Text;
    private highScoreText: Phaser.GameObjects.Text;

    constructor(aParams: IContainerConstructor) {
        super(aParams.scene, aParams.x, aParams.y);
        this.create();
        this.scene.add.existing(this);
    }

    private create(): void {
        this.board = this.scene.add.image(0, 0, 'board').setScale(2);
        this.highScoreText = this.scene.add.text(0, 0, `HIGHSCORE 0`, { fontFamily: 'Impact',  fontSize: '40px', color: '#737373' });

        let score = this.scene.registry.get('score');
        this.scoreText = this.scene.add.text(0, 0, `SCORE ${score}`, {fontFamily: 'Impact', fontSize: '40px', color: '#737373' });
        this.button = this.scene.add.image(0, 0, 'bounding');
        
        let newGameText = this.scene.add.bitmapText(0, 0, 'font', 'NEW', 25);
        let newGame = this.scene.add.container().add([this.button, newGameText]);

        Phaser.Display.Align.In.Center(this.highScoreText, this.board);
        Phaser.Display.Align.In.TopCenter(this.scoreText, this.board, 0, -150);
        Phaser.Display.Align.In.Center(newGameText, this.button);
        Phaser.Display.Align.In.BottomCenter(newGame, this.board, 0, -170);

        this.add(this.board).add(this.scoreText).add(this.highScoreText).add(newGame);

        this.button.setInteractive().on('pointerdown', this.handleNewGame);
    }

    public setScoreText(): void {
        this.scoreText.setText(`SCORE  ${this.scene.registry.get('score')}`);
        this.highScoreText.setText(`HIGHSCORE  ${this.scene.registry.get('highScore')}`);
    }
    private handleNewGame = (): void => {
        this.scene.tweens.add({
            targets: this.button,
            alpha: 0.5,
            duration: 300,
            loop: false,
            yoyo: true,
            onComplete: () => this.scene.reinit()
        });
    }
}