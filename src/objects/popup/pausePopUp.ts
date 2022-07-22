import { IContainerConstructor } from "../../interfaces/container.interface";
import { HUDScene } from "../../scenes/hud-scene";

export class PausePopUp extends Phaser.GameObjects.Container {
    scene: HUDScene;

    private continueButton: Phaser.GameObjects.Image;
    private newGameButton: Phaser.GameObjects.Image;
    private soundButton: Phaser.GameObjects.Image;

    constructor(aParams: IContainerConstructor) {
        super(aParams.scene, aParams.x, aParams.y);
        this.create();
        this.scene.add.existing(this);
    }

    private create(): void {
        let board = this.scene.add.image(0, 0, 'board').setScale(2);
        this.continueButton = this.scene.add.image(0, 0, 'bounding');
        this.newGameButton = this.scene.add.image(0, 0, 'bounding');
        this.soundButton = this.scene.add.image(0, 0, 'bounding');

        let continueText = this.scene.add.bitmapText(0, 0, 'font', 'RESUME', 25);
        let newGameText = this.scene.add.bitmapText(0, 0, 'font', 'NEW', 25);
        let soundText = this.scene.add.bitmapText(0, 0, 'font', 'SOUND', 25);

        Phaser.Display.Align.In.Center(continueText, this.continueButton);
        Phaser.Display.Align.In.Center(newGameText, this.newGameButton);
        Phaser.Display.Align.In.Center(soundText, this.soundButton);

        let continueContainer = this.scene.add.container().add([this.continueButton, continueText]);
        let newGameContainer = this.scene.add.container().add([this.newGameButton, newGameText]);
        let soundContainer = this.scene.add.container().add([this.soundButton, soundText]);

        Phaser.Display.Align.In.LeftCenter(continueContainer, board);
        Phaser.Display.Align.In.Center(newGameContainer, board);
        Phaser.Display.Align.In.RightCenter(soundContainer, board);

        this.add(board).add(continueContainer).add(newGameContainer).add(soundContainer);
        
        this.continueButton.setInteractive().on('pointerdown', this.handleResume);
        this.newGameButton.setInteractive().on('pointerdown', this.handleNewGame);
        this.soundButton.setInteractive().on('pointerdown', this.handleSound);
        
    }

    private handleResume = (): void => {
        this.scene.tweens.add({
            targets: this.continueButton,
            alpha: 0.5,
            duration: 300,
            loop: false,
            yoyo: true,
            onComplete: () => this.scene.resume()
        });
    }
    private handleNewGame = (): void => {
        this.scene.tweens.add({
            targets: this.newGameButton,
            alpha: 0.5,
            duration: 300,
            loop: false,
            yoyo: true,
            onComplete: () => {
                this.setVisible(false);
                this.scene.reinit();
            }
        });
    }
    private handleSound = (): void => {
        this.scene.tweens.add({
            targets: this.soundButton,
            alpha: 0.5,
            duration: 300,
            loop: false,
            yoyo: true,
            onComplete: () => this.scene.controllSound(this.soundButton)
        });
    }
}