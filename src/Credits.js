import Phaser from 'phaser';
import CustomButton from './support_script/CustomButton';
import { gameState, playStopAudio } from './boot';

class Credits extends Phaser.Scene {
  constructor() {
    super({ key: 'Credits' });
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
    this.width = this.scale.width;
    this.height = this.scale.height;

    this.hoverSound = this.sound.add('hoverBtnSound', { loop: false });
    this.clickSound = this.sound.add('clickBtnSound', { loop: false });

    this.add.image(0, 0, 'sky').setOrigin(0).setScale(1920/gameState.sceneWidth);
    this.add.image(this.width / 2, this.height / 2, 'logo2').setAlpha(0).setScale(1.7);
    this.add.rectangle(this.width / 2, this.height / 2,
      (this.width * 3) / 4, (this.height * 3) / 4, 0x000000, 0.3);

    const positionWords = (x, y, message, fillColor, strokeColor) => this.add.text(x, y, message, {
      fontSize: '30px',
      fill: fillColor,
      fontFamily: '"Akaya Telivigala"',
      strokeThickness: 5,
      stroke: strokeColor,
    });

    positionWords(this.width / 2 - 150, this.height / 2 - 100, 'Forked from:', '#ff0000', '#ffffff').setOrigin(1, 0.5);

    positionWords(this.width / 2 -120, this.height / 2 - 100, 'github.com/RNtaate/Endless-Runner', '#ffffff', '#0275d8').setOrigin(0, 0.5);

    positionWords(this.width / 2 - 150, this.height / 2, 'Reimagined By: ', '#ff0000', '#ffffff').setOrigin(1, 0.5);

    positionWords(this.width / 2 -120, this.height / 2, 'cbgb', '#ffffff', '#0275d8').setOrigin(0, 0.5);

    positionWords(this.width / 2 - 150, this.height / 2 + 100, 'Graphics: ', '#ff0000', '#ffffff').setOrigin(1, 0.5);

    const assetsList = positionWords(this.width / 2 -120, this.height / 2 + 100, 'Stable Diffusion', '#ffffff', '#0275d8').setOrigin(0, 0.5);

    positionWords(this.width / 2 -120, assetsList.y + 30, 'aamatniekss.itch.io', '#ffffff', '#0275d8').setOrigin(0, 0.5);

    positionWords(this.width / 2 -120, assetsList.y + 60, 'free-stock-music.com', '#ffffff', '#0275d8').setOrigin(0, 0.5);

    const backBtn = new CustomButton(this, 100, this.height - 30, 'mainMenu', 'mainMenuHover');
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

export default Credits;