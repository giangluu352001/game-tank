import { IContainerConstructor } from "../../interfaces/container.interface";
import { HUDScene } from "../../scenes/hud-scene";

export class PauseButton extends Phaser.GameObjects.Container {
    scene: HUDScene;
    private button: Phaser.GameObjects.Image;
    constructor(aParams: IContainerConstructor) {
        super(aParams.scene, aParams.x, aParams.y);
        this.create();
        this.scene.add.existing(this);
    }
    private create(): void {
        this.button = this.scene.add.image(0, 0, 'bounding');
        let zone = this.scene.add.zone(
            0, 0, 
            this.scene.sys.canvas.width,
            this.scene.sys.canvas.height
        );
        let text = this.scene.add.bitmapText(0, 0, 'font', 'PAUSE', 25);

        Phaser.Display.Align.In.TopCenter(this.button, zone);
        Phaser.Display.Align.In.Center(text, this.button)

        this.add(this.button).add(text);
        this.button.setInteractive().on('pointerdown', this.handlePause);
    }
    private handlePause = (): void => {
        this.scene.tweens.add({
            targets: this.button,
            scale: 0.9,
            duration: 300,
            yoyo: true,
            loop: false,
            onComplete: () => this.scene.pause()
        })
    }
}