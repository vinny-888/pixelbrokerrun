import Phaser from 'phaser';
import Preload from './preload';
import { Boot } from './boot';
import Menu from './Menu';
import Options from './Options';
import Credits from './Credits';
import Game from './game';
import { GameOver } from './gameOver';
import LeaderBoard from './leaderBoard';
import Instructions from './instructions';
import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 520,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  // Allows Phaser canvas to be responsive to browser sizing
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 520,
  },
  dom: {
    createContainer: true,
  },
  scene: [Boot, Preload, Menu, Options, Credits, Game, GameOver, LeaderBoard, Instructions],
  plugins: {
    scene: [{
        key: 'rexGestures',
        plugin: GesturesPlugin,
        mapping: 'rexGestures'
    },
    ]
  },
  callbacks: {
    postBoot: function (game) {
      // In v3.15, you have to override Phaser's default styles
      game.canvas.style.width = '100%';
      game.canvas.style.height = '100%';
    }
  }
};

Object.create(new Phaser.Game(config));
