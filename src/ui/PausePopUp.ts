import { GameScene } from "../scenes/GameScene";
import { Button } from "./Button";
import { PopUp } from "./PopUp";

export class PausePopUp extends PopUp {
    scene: GameScene;

    private continueButton: Button;
    private newGameButton: Button;
    private soundButton: Button;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        this.addElements();
        this.addEventListerner();
    }

    private addElements(): void {
        this.continueButton =  new Button(this.scene, 0, 0, 'RESUME');
        this.newGameButton =  new Button(this.scene, 0, 0, 'NEW');
        this.soundButton =  new Button(this.scene, 0, 0, 'SOUND');

        Phaser.Display.Align.In.LeftCenter(this.continueButton, this.board);
        Phaser.Display.Align.In.Center(this.newGameButton, this.board);
        Phaser.Display.Align.In.RightCenter(this.soundButton, this.board);

        this.add(this.board).add(this.continueButton).add(this.newGameButton).add(this.soundButton);
        
    }
    private addEventListerner(): void {
        this.continueButton.setInteraction(this.scene.resume);
        this.newGameButton.setInteraction(this.scene.replay);
        this.soundButton.setInteraction(() => this.scene.controllSound(this.soundButton));
    }
}