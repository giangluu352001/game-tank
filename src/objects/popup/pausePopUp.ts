import { IContainerConstructor } from "../../interfaces/container.interface";
import { HUDScene } from "../../scenes/hud-scene";
import { Button } from "./button";

export class PausePopUp extends Phaser.GameObjects.Container {
    scene: HUDScene;

    private continueButton: Button;
    private newGameButton: Button;
    private soundButton: Button;

    constructor(aParams: IContainerConstructor) {
        super(aParams.scene, aParams.x, aParams.y);
        this.create();
        this.scene.add.existing(this);
    }

    private create(): void {
        let board = this.scene.add.image(0, 0, 'board').setScale(2);
        
        this.continueButton =  new Button({
            scene: this.scene,
            x: 0, 
            y: 0, 
            text: 'RESUME'
        });
        this.newGameButton =  new Button({
            scene: this.scene,
            x: 0, 
            y: 0, 
            text: 'NEW'
        });
        this.soundButton =  new Button({
            scene: this.scene,
            x: 0, 
            y: 0, 
            text: 'SOUND'
        });

        Phaser.Display.Align.In.LeftCenter(this.continueButton, board);
        Phaser.Display.Align.In.Center(this.newGameButton, board);
        Phaser.Display.Align.In.RightCenter(this.soundButton, board);

        this.add(board).add(this.continueButton).add(this.newGameButton).add(this.soundButton);
        
        this.continueButton.getContainer().setInteractive().on('pointerdown', this.handleResume);
        this.newGameButton.getContainer().setInteractive().on('pointerdown', this.handleNewGame);
        this.soundButton.getContainer().setInteractive().on('pointerdown', this.handleSound);
        
    }

    private handleResume = (): void => {
        this.scene.resume()
    }
    private handleNewGame = (): void => {
        this.setVisible(false);
        this.scene.reinit();
    }
    private handleSound = (): void => {
        this.scene.controllSound(this.soundButton)
    }
}