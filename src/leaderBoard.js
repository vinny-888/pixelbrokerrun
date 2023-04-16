import Phaser from 'phaser';
import { gameState, playStopAudio } from './boot';
import CustomButton from './support_script/CustomButton';
import { setText } from './gameOver';
import * as fetchScoreData from './support_script/fetchData';
import 'regenerator-runtime/runtime';

class LeaderBoard extends Phaser.Scene {
  constructor() {
    super({ key: 'Leader' });
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

    let height = 75;
    let myScores = [];
    // const myUrl = `${fetchScoreData.apiUrl + fetchScoreData.apiKey}/scores`;

    this.add.image(gameState.sceneWidth / 2, gameState.sceneHeight / 2, 'sky').setScale(1920/gameState.sceneWidth);

    this.add.rectangle(gameState.sceneWidth / 4, 0, gameState.sceneWidth / 2,
      gameState.sceneHeight, 0x000000, 0.8).setOrigin(0);

    this.add.image(gameState.sceneWidth / 2, gameState.sceneHeight / 2, 'logo2').setScale(1.7).setAlpha(0);

    setText(this, gameState.sceneWidth / 2, 25, 'Leader Board', '50px', '#ffffff', '#00ff00', 0.5);

    this.fetchingScores = setText(this, gameState.sceneWidth / 2, gameState.sceneHeight / 2, 'Fetching Scores ...', '25px', '#ff00ff', '#ffffff', 0.5, 0.5);

    fetchScoreData.fetchScores(fetchScoreData.apiUrl)
      .then((scores) => {
        this.fetchingScores.destroy();
        myScores = scores;
        myScores.sort((a, b) => b.score - a.score);

        for (let i = 0; i < myScores.length; i += 1) {
          if (i >= 10) {
            break;
          }
          height += 40;
          setText(this, gameState.sceneWidth / 4 + 10, height, `${i + 1}.  ${myScores[i].user}`, '24px', '#ffffff', '#0000ff', 0, 0.5);
          setText(this, (gameState.sceneWidth * 3) / 4 - 10, height, myScores[i].score.toString(), '24px', '#ffffff', '#000000', 1, 0.5);
        }
      }).catch(() => {
        this.fetchingScores.destroy();
        setText(this, gameState.sceneWidth / 2, gameState.sceneHeight / 2, 'failed to collect Scores!', '24px', '#ffffff', '#ff0000', 0.5, 0.5);
      });

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

export default LeaderBoard;