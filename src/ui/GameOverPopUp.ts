import { GameScene } from "../scenes/GameScene";
import { Button } from "./Button";
import { PopUp } from "./PopUp";

export class GameOverPopUp extends PopUp {
    scene: GameScene;

    private buttonNew: Button;
    private scoreText: Phaser.GameObjects.Text;
    private highScoreText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        this.addElements();
        this.addEventListener();
    }

    public setScoreText(): void {
        this.scoreText.setText(`SCORE  ${this.scene.registry.get('score')}`);
        this.highScoreText.setText(`HIGHSCORE  ${this.scene.registry.get('highScore')}`);
    }

    private addElements(): void {
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
        this.buttonNew = new Button(this.scene, 0, 0, 'NEW');

        Phaser.Display.Align.In.Center(this.highScoreText, this.board, 0, -20);
        Phaser.Display.Align.In.TopCenter(this.scoreText, this.board, 0, -130);
        Phaser.Display.Align.In.BottomCenter(this.buttonNew, this.board, 0, -190);

        this.add(this.board).add(this.scoreText).add(this.highScoreText).add(this.buttonNew);
    }

    private addEventListener(): void {
        this.buttonNew.setInteraction(this.scene.replay);
    }

}