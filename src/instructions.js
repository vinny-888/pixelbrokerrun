import Phaser from 'phaser';
import { gameState, playStopAudio } from './boot';
import CustomButton from './support_script/CustomButton';
import { setText } from './gameOver';

class Instructions extends Phaser.Scene {
  constructor() {
    super({ key: 'instructions' });
  }
  resize(canvas) {
    var width = window.innerWidth, height = window.innerHeight;
    var wratio = width / height, ratio = canvas.width / canvas.height;

    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
  }
  create() {
    this.canvas = this.game.canvas;
    var _this = this;
    window.addEventListener('resize', ()=>{_this.resize(_this.canvas)});
    this.resize(_this.canvas);
    this.hoverSound = this.sound.add('hoverBtnSound', { loop: false });
    this.clickSound = this.sound.add('clickBtnSound', { loop: false });

    playStopAudio(gameState.music, gameState.theme1);

    this.add.image(gameState.sceneWidth / 2, gameState.sceneHeight / 2, 'sky').setScale(1920/gameState.sceneWidth);

    this.add.rectangle(0, 0, gameState.sceneWidth,
      gameState.sceneHeight, 0x000000, 0.2).setOrigin(0);

    const message = `"PixelBrokers Run" is a simple fun game
  about collecting coins and hitting down missiles
  
  Your goal is to collect as many coins as you can
  before your "Health" bar is depleted.
  (NOTE: The health bar will be depleted over time.)
  
  Collecting Coins and hitting down Missiles contributes
  towards boosting your health to keep you in the game 
  for a longer period of time.
  
  Use the 'UP' arrow key to jump-(Tap it twice to jump
  twice).
  
  Use the 'DOWN' arrow key to bring the player back to
  the ground faster.`;

    const message2 = '!! LFG !!';

    setText(this, gameState.sceneWidth / 2 + 70, gameState.sceneHeight / 2, 'INSTRUCTIONS', '60px', '#00ff00', '#ffffff', 0, 0.5);
    setText(this, 20, 10, message, '20px', '#000000', '#ffffff', 0, 0);
    setText(this, 20, gameState.sceneHeight - 20, message2, '20px', '#ffffff', '#ff00ff', 0, 0.5);

    const backBtn = new CustomButton(this, gameState.sceneWidth - 100, gameState.sceneHeight - 50, 'mainMenu', 'mainMenuHover');
    this.add.existing(backBtn);

    backBtn.setInteractive().on('pointerup', () => {
      playStopAudio(gameState.sound, this.clickSound);
      this.scene.stop();
      this.scene.start('Menu');
    }).on('pointerover', () => {
      playStopAudio(gameState.sound, this.hoverSound);
    });
  }
}

export default Instructions;