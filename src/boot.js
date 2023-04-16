import Phaser from 'phaser';
import WebFontFile from './support_script/webfontloader';
import 'regenerator-runtime/runtime';

const gameState = {
  sceneWidth: 0,
  sceneHeight: 0,
  score: 0,
  music: true,
  sound: true,
};

const playStopAudio = (status, audio) => {
  if (status) {
    if (!audio.isPlaying) {
      audio.play();
    }
  } else {
    audio.stop();
  }
};

class Boot extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    this.load.html('form', './form.html');
    this.load.addFile(new WebFontFile(this.load, 'Akaya Telivigala'));
  }
  resize() {
    var canvas = this.game.canvas, width = window.innerWidth, height = window.innerHeight;
    var wratio = width / height, ratio = canvas.width / canvas.height;

    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
  }

  submit(){
    const name = this.form.getChildByName('name');
    const wallet = this.form.getChildByName('wallet');
    if (name.value.trim() !== '') {
      localStorage.setItem("pbr_name", name.value.trim());
      localStorage.setItem("pbr_wallet", wallet.value.trim());
      gameState.playerName = name.value.trim();
      gameState.wallet = wallet.value.trim();
      this.scene.stop();
      this.scene.start('Preload');
    }
  }

  create() {
    window.addEventListener('resize', this.resize);
    this.resize();
    gameState.sceneWidth = this.scale.width;
    gameState.sceneHeight = this.scale.height;

    this.add.text(gameState.sceneWidth / 2, gameState.sceneHeight / 2 - 200, 'Welcome to PixelBrokers Run!', {
      fontSize: '40px',
      fill: '#ffffff',
      fontFamily: 'Akaya Telivigala',
    }).setOrigin(0.5);

    this.add.text(gameState.sceneWidth / 2, gameState.sceneHeight / 2 - 100, 'Enter name & wallet (optional) and press "ENTER"', {
      fontSize: '30px',
      fill: '#ffffff',
      fontFamily: 'Akaya Telivigala',
    }).setOrigin(0.5);

    this.form = this.add.dom(gameState.sceneWidth / 2, gameState.sceneHeight / 2).createFromCache('form');
    const name = this.form.getChildByName('name');
    const wallet = this.form.getChildByName('wallet');
    const submit = this.form.getChildByName('submit');

    if(localStorage.getItem("pbr_name")){
      name.value = localStorage.getItem("pbr_name");
    }
    if(localStorage.getItem("pbr_name")){
      wallet.value = localStorage.getItem("pbr_wallet");
    }

    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.enterKey.on('down', () => {
      this.submit();
    });

    this.addClickCallback("submit", ()=>{this.submit();});
  }

  addClickCallback(elName, fun) {
    var el = document.getElementById(elName);
       el.onclick = fun;
  }
}

export { Boot, gameState, playStopAudio };