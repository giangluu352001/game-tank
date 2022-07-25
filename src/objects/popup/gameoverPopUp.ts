import { IContainerConstructor } from "../../interfaces/container.interface";
import { HUDScene } from "../../scenes/hud-scene";
import { Button } from "./button";

export class GameOverPopUp extends Phaser.GameObjects.Container {
    scene: HUDScene;

    private buttonNew: Button;
    private scoreText: Phaser.GameObjects.Text;
    private highScoreText: Phaser.GameObjects.Text;

    constructor(aParams: IContainerConstructor) {
        super(aParams.scene, aParams.x, aParams.y);
        this.create();
        this.scene.add.existing(this);
    }

    private create(): void {
        let board = this.scene.add.image(0, 0, 'board').setScale(2);
        this.highScoreText = this.scene.add.text(0, 0, `HIGHSCORE 0`, { 
            fontFamily: 'Impact',
            fontSize: '40px', 
            color: '#737373' 
        });
        let score = this.scene.registry.get('score');
        this.scoreText = this.scene.add.text(0, 0, `SCORE ${score}`, {
            fontFamily: 'Impact',
            fontSize: '40px',
            color: '#737373'
        });
        this.buttonNew = new Button({
            scene: this.scene, 
            x: 0,
            y: 0,
            text: 'NEW'
        });

        Phaser.Display.Align.In.Center(this.highScoreText, board);
        Phaser.Display.Align.In.TopCenter(this.scoreText, board, 0, -150);
        Phaser.Display.Align.In.BottomCenter(this.buttonNew, board, 0, -170);

        this.add(board).add(this.scoreText).add(this.highScoreText).add(this.buttonNew);

        this.buttonNew.getContainer().setInteractive().on('pointerdown', this.handleNewGame);
    }

    public setScoreText(): void {
        this.scoreText.setText(`SCORE  ${this.scene.registry.get('score')}`);
        this.highScoreText.setText(`HIGHSCORE  ${this.scene.registry.get('highScore')}`);
    }
    private handleNewGame = (): void => {
        this.scene.reinit();
    }
}