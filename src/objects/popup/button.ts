import { IButtonConstructor } from "../../interfaces/button.interface";
import { HUDScene } from "../../scenes/hud-scene";

export class Button extends Phaser.GameObjects.Container {
    scene: HUDScene;
    protected container: Phaser.GameObjects.Image;
    protected text: string;
    constructor(aParams: IButtonConstructor) {
        super(aParams.scene, aParams.x, aParams.y);
        this.text = aParams.text;
        this.createButton();
        aParams.scene.add.existing(this);
    }
    private createButton(): void {
        this.container = this.scene.add.image(0, 0, 'bounding');
        let text = this.scene.add.bitmapText(0, 0, 'font', this.text, 25);
        Phaser.Display.Align.In.Center(text, this.container);

        this.add(this.container).add(text);

        this.container.setInteractive().on('pointerover', this.handleOver);
    }

    protected handleOver = (): void => {
        this.scene.tweens.add({
            targets: this.container,
            scale: 1.1,
            duration: 300,
            yoyo: true,
            loop: false
        });
    }
    public getContainer(): Phaser.GameObjects.Image {
        return this.container;
    }
}