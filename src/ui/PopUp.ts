export class PopUp extends Phaser.GameObjects.Container {
    protected board: Phaser.GameObjects.Image;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        this.init();
        this.scene.add.existing(this);
        this.hide();
    }

    private init(): void {
        this.board = this.scene.add.image(0, 0, 'board').setScale(2);
        this.setDepth(3);
        this.setScrollFactor(0, 0);
    }

    public hide(): void {
        this.setVisible(false);
    }

    public show(): void {
        this.setVisible(true);
        this.showAnimation();
    }

    private showAnimation(): void {
        this.scene.tweens.add({
            targets: this,
            duration: 400,
            y: { from: this.y - 100, to: this.y},
            loop: false
        });
    }

}