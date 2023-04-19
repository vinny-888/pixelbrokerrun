import Phaser from 'phaser';
import { gameState } from './boot';
// let prefix = './tpl-mech-auto-assembler';
let prefix = '.';
class Preload extends Phaser.Scene {
  constructor() {
    super({ key: 'Preload' });
  }

  preload() {
    this.width = this.scale.width;
    this.height = this.scale.height;
    const progressBoxWidth = 320;
    const progressBoxHeight = 50;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRoundedRect((this.width / 2) - (progressBoxWidth / 2),
      (this.height / 2) - (progressBoxHeight / 2),
      progressBoxWidth, progressBoxHeight, 25);

    const loadingText = this.add.text(this.width / 2, this.height / 2, 'Loading ...', {
      fontSize: '30px',
      fill: '#ffffff',
      fontFamily: '"Akaya Telivigala"',
    }).setOrigin(0.5);

    // The event listeners for loading assets

    const progressBarWidth = progressBoxWidth - 20;
    const progressBarHeight = progressBoxHeight - 20;

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x9bfff5, 1);
      let myProgress = progressBarWidth * value;
      if (value < 0.1) {
        myProgress = progressBarWidth * 0.1;
      }
      progressBar.fillRoundedRect((this.width / 2) - (progressBarWidth / 2),
        (this.height / 2) - (progressBarHeight / 2),
        myProgress, progressBarHeight, {
          tl: 15, bl: 15, tr: 15, br: 15,
        });
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });


    // Loading of the assets
    this.load.image('logo', prefix+'/assets/gameLogo.png');
    this.load.image('logo2', prefix+'/assets/gameLogoTransparent.png');
    this.load.image('startGame', prefix+'/assets/startButton.png');
    this.load.image('startGameHover', prefix+'/assets/startButtonOver.png');
    this.load.image('options', prefix+'/assets/optionsButton.png');
    this.load.image('optionsHover', prefix+'/assets/optionsButtonHover.png');
    this.load.image('leaderBoard', prefix+'/assets/leaderBoard.png');
    this.load.image('leaderBoardHover', prefix+'/assets/leaderBoardHover.png');
    this.load.image('instructions', prefix+'/assets/instructions.png');
    this.load.image('instructionsHover', prefix+'/assets/instructionsHover.png');
    this.load.image('credits', prefix+'/assets/credits.png');
    this.load.image('creditsHover', prefix+'/assets/creditsHover.png');
    this.load.image('mainMenu', prefix+'/assets/mainMenu.png');
    this.load.image('mainMenuHover', prefix+'/assets/mainMenuHover.png');
    this.load.image('playAgain', prefix+'/assets/playAgain.png');
    this.load.image('playAgainHover', prefix+'/assets/playAgainHover.png');

    this.load.image('sky', prefix+'/assets/sky.png');
    this.load.image('mountains', prefix+'/assets/mountains.png');
    this.load.image('plateau', prefix+'/assets/plateau.png');
    this.load.image('ground', prefix+'/assets/ground.png');

    this.load.image('checkbox', prefix+'/assets/checkbox2.png');
    this.load.image('tick', prefix+'/assets/tick2.png');


    var url = new URL(window.location);
    var id = url.searchParams.get("id");
    if(!id){
        id = Math.round(Math.random()*10000);
    }

    // this.load.spritesheet('player', prefix+'/assets/playersprite.png', { frameWidth: 250, frameHeight: 250 });

    this.load.spritesheet('player', 'https://cb-media.sfo3.cdn.digitaloceanspaces.com/pixelbrokers/current/sprites/'+id+'.png', 
    {
      frameWidth: 96,
      frameHeight: 96
    });

    

    let enemies = [4672,2501,8756,3091,9018,4855,6640,5161,4871,96]

    enemies.forEach((id, index)=>{
      this.load.spritesheet('enemy_'+index, 'https://cb-media.sfo3.cdn.digitaloceanspaces.com/pixelbrokers/current/sprites/'+id+'.png', 
    {
      frameWidth: 96,
      frameHeight: 96
    });
    })
    
    //{ frameWidth: 96, frameHeight: 96 });

    this.load.spritesheet('bird', prefix+'/assets/birdSprite.png', { frameWidth: 290, frameHeight: 300 });
    this.load.spritesheet('explosion', prefix+'/assets/explosion.png', { frameWidth: 64, frameHeight: 63 });
    this.load.image('btc', prefix+'/assets/btc.png');
    this.load.image('eth', prefix+'/assets/eth.png');
    this.load.image('dodge', prefix+'/assets/dodge.png');
    this.load.image('power_up_1', prefix+'/assets/power_up_1.png');
    this.load.image('power_up_2', prefix+'/assets/power_up_2.png');
    this.load.image('power_up_3', prefix+'/assets/power_up_3.png');
    this.load.image('power_up_4', prefix+'/assets/power_up_4.png');
    this.load.image('power_up_5', prefix+'/assets/power_up_5.png');
    this.load.image('power_up_6', prefix+'/assets/power_up_6.png');
    this.load.image('spike', prefix+'/assets/spike.png');
    this.load.image('bullet', prefix+'/assets/bullet.png');
    this.load.image('missile', prefix+'/assets/missile.png');
    this.load.image('missile2', prefix+'/assets/missile2.png');

    this.load.audio('hoverBtnSound', prefix+'/assets/rollover1.mp3');
    this.load.audio('clickBtnSound', prefix+'/assets/switch3.mp3');

    this.load.audio('theme1', prefix+'/assets/theme1.mp3');
    this.load.audio('theme2', prefix+'/assets/theme2.mp3');
    this.load.audio('pickCoin', prefix+'/assets/pickCoin.wav');
    this.load.audio('explosion', prefix+'/assets/explode.wav');
    this.load.audio('killMissile', prefix+'/assets/killMissile.mp3');
    this.load.audio('jumpSound', prefix+'/assets/jumpSound.mp3');
    this.load.audio('spikeSound', prefix+'/assets/spikeSound.mp3');

    // for(let i = 0; i < 200; i ++) {
    //   this.load.image('logo' + i, prefix+'/assets/gameLogo.png');
    // }
  }

  create() {
    this.add.image(this.width / 2, this.height / 2, 'logo').setScale(1.7);

    this.message = this.add.text(this.scale.width / 2 + 100, 30, 'Tap or Press "Enter" to play!', {
      fontSize: '25px',
      fill: '#ffffff',
      fontFamily: '"Akaya Telivigala"',
    }).setOrigin(0.3);

    var tap = this.scene.scene.rexGestures.add.tap(this.game, {
      enable: true,
    
      // time: 250,
      // tapInterval: 200,
      // threshold: 9,
      // tapOffset: 10,
    
      // taps: undefined,
      // minTaps: undefined,
      // maxTaps: undefined,
    });

    tap.on('tap', function(tap, gameObject, lastPointer){
      this.scene.stop();
      this.scene.start('Menu');
    }, this);

    this.message.setAlpha(0);

    this.tweens.add({
      targets: this.message,
      repeat: -1,
      duration: 1000,
      delay: 1000,
      ease: 'linear',
      alpha: 1,
      yoyo: true,
    });

    gameState.theme1 = this.sound.add('theme1', { loop: true });

    this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.enter)) {
      this.scene.stop();
      this.scene.start('Menu');
    }
  }
}

export default Preload;