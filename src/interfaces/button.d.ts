export interface IButton {
    setInteraction: (callbackHandler: () => void) => void;
    setTint(value: number): void;
    clearTint(): void;
  }
  