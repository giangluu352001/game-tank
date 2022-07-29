import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { MenuScene } from './scenes/MenuScene';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Tank',
  version: '2.0',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1600,
    height: 1200
  },
  type: Phaser.AUTO,
  parent: 'game',
  scene: [BootScene, MenuScene, GameScene],
  input: {
    gamepad: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  plugins: {
    global: [{
        key: 'rexVirtualJoystick',
        plugin: VirtualJoystickPlugin,
        start: true
    }]
  },
  backgroundColor: '#000000',
  render: { pixelArt: false, antialias: true }
};
