import { IButton } from "../interfaces/button";

export class Button extends Phaser.GameObjects.Container implements IButton {
    private boundingBox: Phaser.GameObjects.Image;
    private text: string;
    constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
        super(scene, x, y);
        this.text = text;
        this.create();
        this.scene.add.existing(this);
    }
    private create(): void {
        this.boundingBox = this.scene.add.image(0, 0, 'bounding');
        let text = this.scene.add.bitmapText(0, 0, 'font', this.text, 25);
        Phaser.Display.Align.In.Center(text, this.boundingBox);
        this.add(this.boundingBox).add(text);
        this.boundingBox.setScrollFactor(0, 0);
        text.setScrollFactor(0, 0);
    }

    private handlePointerOver = (): void => {
        this.scene.tweens.add({
            targets: this.boundingBox,
            scale: 1.1,
            duration: 300,
            yoyo: false,
            repeat: 0
        });
    }
    private handlePointerOut = (): void => {
        this.scene.tweens.add({
            targets: this.boundingBox,
            scale: 1,
            duration: 300,
            yoyo: false,
            repeat: 0
        }); 
    }
    public setInteraction(callbackHandler: () => void): void {
        this.boundingBox.setInteractive()
            .on('pointerover', this.handlePointerOver)
            .on('pointerout', this.handlePointerOut)
            .on('pointerdown', callbackHandler);
    }
    public setTint(value: number): void {
        this.boundingBox.setTint(value);
    }
    public clearTint(): void {
        this.boundingBox.clearTint();
    }
    public hide(): void {
        this.setVisible(false);
    }
    public show(): void {
        this.setVisible(true);
    }
}