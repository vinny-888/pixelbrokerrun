import Phaser from 'phaser';
import CustomButton from './support_script/CustomButton';
import { gameState, playStopAudio } from './boot';
import updateSoundStatus from './support_script/statusUpdate';

class Options extends Phaser.Scene {
  constructor() {
    super({ key: 'Options' });
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

    this.add.image(this.width / 2, this.height / 2, 'sky').setScale(1920/gameState.sceneWidth);

    const firstCheckBox = this.add.image(this.width / 4, this.height / 2 - 100, 'checkbox').setScale(1.5);
    const firstTick = this.add.image(this.width / 4, this.height / 2 - 100, 'tick').setScale(1.5);

    this.add.text(this.width / 4 + 150, this.height / 2 - 100, 'Music', {
      fontSize: '60px',
      fill: '#ffffff',
      fontFamily: '"Akaya Telivigala"',
      stroke: '#0275d8',
      strokeThickness: 10,
    }).setOrigin(0, 0.5);

    this.add.text(this.width / 4 + 150, this.height / 2 + 100, 'Sound Effects', {
      fontSize: '60px',
      fill: '#ffffff',
      fontFamily: '"Akaya Telivigala"',
      stroke: '#0275d8',
      strokeThickness: 10,
    }).setOrigin(0, 0.5);

    firstTick.setVisible(true);
    if (!gameState.music) {
      firstTick.setVisible(false);
    }

    const secondCheckBox = this.add.image(this.width / 4, this.height / 2 + 100, 'checkbox').setScale(1.5);
    const secondTick = this.add.image(this.width / 4, this.height / 2 + 100, 'tick').setScale(1.5);

    secondTick.setVisible(true);
    if (!gameState.sound) {
      secondTick.setVisible(false);
    }

    firstCheckBox.setInteractive().on('pointerup', () => {
      gameState.music = updateSoundStatus(firstTick, gameState.music);
      playStopAudio(gameState.music, gameState.theme1);
    });

    secondCheckBox.setInteractive().on('pointerup', () => {
      gameState.sound = updateSoundStatus(secondTick, gameState.sound);
    });

    const backBtn = new CustomButton(this, this.width - 100, this.height - 50, 'mainMenu', 'mainMenuHover');
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

export default Options;