import { IButtonConstructor } from "../../interfaces/button.interface";
import { Button } from "./button";

export class PauseButton extends Button {
    constructor(aParams: IButtonConstructor) {
        super(aParams);
        this.container.setInteractive().on('pointerdown', this.handleClick)
    }
   
    private handleClick = (): void => {
        this.scene.pause();
    }
}