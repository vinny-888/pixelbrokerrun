import Phaser from 'phaser';
import { gameState, playStopAudio } from './boot';
import * as fetchScoreData from './support_script/fetchData';
import 'regenerator-runtime/runtime';

const createPlatform = (group, spriteWidth, myTexture, dist = 0) => {
  const platform = group.create(spriteWidth + dist, gameState.sceneHeight, myTexture)
    .setOrigin(0, 1)
    .setScale(0.5);
  if (myTexture === 'ground') {
    platform.setImmovable(true);
    platform.setSize(platform.displayWidth * 2, platform.displayHeight - 50);
  }

  switch (myTexture) {
    case 'ground':
      platform.setDepth(2);
      break;
    case 'plateau':
      platform.setDepth(1);
      break;
    default:
  }
};

const updatePlatform = (group, spriteWidth, myTexture, dist = 0) => {
  const child = group.get(spriteWidth - dist, gameState.sceneHeight, myTexture);
  child.setVisible(true);
  child.setActive(true);
  switch (myTexture) {
    case 'ground':
      child.setDepth(2);
      break;
    case 'plateau':
      child.setDepth(1);
      break;
    default:
  }
};

const moveBackgroundPlatform = (group, platformWidth, myTexture, scrollFactor) => {
  group.children.iterate((child) => {
    child.x -= scrollFactor;
    if (child.x < -(child.displayWidth)) {
      group.killAndHide(child);
      updatePlatform(group, platformWidth, myTexture, scrollFactor);
    }
  });
};


class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
    this.timer = 0;
    this.secondTimer = 0;
    this.healthTimer = 0;
    // this.missileScore = 0;
    this.missileScoreCombo = 0;
    this.jumping = false;
    this.tapped = false;
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

  // Start of create function
  create() {
    this.physics.world.setFPS(60);
    this.canvas = this.game.canvas;
    var _this = this;
    window.addEventListener('resize', ()=>{_this.resize(_this.canvas)});
    this.resize(_this.canvas);

    this.input.on('pointerdown', function(pointer, localX, localY, event){ 
      this.tapped = true;
    }, this);

    this.gameTheme = this.sound.add('theme2', { loop: true });
    this.gameTheme.volume = 0.5;

    playStopAudio(gameState.music, this.gameTheme);

    this.addSoundEffects();

    gameState.score = 0;
    this.health = 300;

    this.scoreText = this.add.text(50, 25, 'Crypto: ', {
      fontSize: '40px',
      fill: '#9bfff5',
      fontFamily: '"Akaya Telivigala"',
      strokeThickness: 4,
      stroke: '#1f3331',
    }).setDepth(8);

    this.scoreValue = this.add.text(170, 25, `${gameState.score}`, {
      fontSize: '40px',
      fill: '#9bfff5',
      fontFamily: '"Akaya Telivigala"',
      strokeThickness: 4,
      stroke: '#1f3331',
    }).setDepth(8);

    this.healthText = this.add.text(50, 75, 'Health: ', {
      fontSize: '30px',
      fill: '#9bfff5',
      strokeThickness: 4,
      fontFamily: '"Akaya Telivigala"',
      stroke: '#1f3331',
    }).setDepth(8);


    this.progressBox = this.add.graphics();
    this.progressBar = this.add.graphics();
    this.progressBox.setDepth(8);
    this.progressBar.setDepth(8);

    this.progressBox.lineStyle(3, 0x0275d8, 1);
    this.progressBox.strokeRect(170, 95, this.health, 10);

    this.progressBar.fillStyle(0x9bfff5, 1);
    this.progressBar.fillRect(170, 95, this.health, 10);


    this.addGameBackground();

    this.player = this.physics.add.sprite(200, gameState.sceneHeight - 300, 'player').setScale(1.5);

    this.physics.add.collider(this.player, this.groundGroup);  
    this.player.setGravityY(800);
    this.player.setDepth(6);
    this.player.body.setCollideWorldBounds();
    this.player.body.setSize(20, 48);
    this.player.body.setOffset(40, 30);

    this.createAnimations('run', 'player', 18, 23, -1, 16);

    this.createAnimations('jump', 'player', 18, 23, -1, 16);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.jumpTimes = 2;
    this.jump = 0;

    // Birds SECTION

    this.birdGroup = this.physics.add.group();

    const createBird = () => {
      const myY = Phaser.Math.Between(100, 300);
      const bird = this.birdGroup.create(gameState.sceneWidth + 100, myY, 'bird').setScale(0.3);
      bird.setVelocityX(-100);
      bird.flipX = true;
      bird.setDepth(6);
      bird.setSize(bird.displayWidth - 10, bird.displayHeight - 10);
    };

    this.createAnimations('fly', 'bird', 0, 8, -1, 7);

    this.birdCreationTime = this.time.addEvent({
      callback: createBird,
      delay: Phaser.Math.Between(2500, 5000),
      callbackScope: this,
      loop: true,
    });

    // Coins SECTION

    this.ethGroup = this.physics.add.group();
    this.dodgeGroup = this.physics.add.group();
    this.btcGroup = this.physics.add.group();
    const createCoin = () => {
      let random = Math.random();
      if(random <= 0.1){
        this.createBirdDrop(this.btcGroup, 'btc');
      }if(random > 0.1 && random <= 0.4){
        this.createBirdDrop(this.ethGroup, 'eth');
      } else {
        this.createBirdDrop(this.dodgeGroup, 'dodge');
      }
    };

    this.physics.add.collider(this.dodgeGroup, this.groundGroup, (singleCoin) => {
      singleCoin.setVelocityX(-200);
    });
    this.physics.add.collider(this.ethGroup, this.groundGroup, (singleCoin) => {
      singleCoin.setVelocityX(-200);
    });
    this.physics.add.collider(this.btcGroup, this.groundGroup, (singleCoin) => {
      singleCoin.setVelocityX(-200);
    });
    this.physics.add.collider(this.dodgeGroup, this.groundGroup, (singleCoin) => {
      singleCoin.setVelocityX(-200);
    });

    this.physics.add.overlap(this.player, this.dodgeGroup, (player, singleCoin) => {
      this.pickCoin.play();
      singleCoin.destroy();
      gameState.score += 1;
      this.health += 1;
      this.scoreValue.setText(`${gameState.score}`);
      this.hoveringTextScore(player, '1+', '#0000ff');
    });

    this.physics.add.overlap(this.player, this.ethGroup, (player, singleCoin) => {
      this.pickCoin.play();
      singleCoin.destroy();
      gameState.score += 2;
      this.health += 2;
      this.scoreValue.setText(`${gameState.score}`);
      this.hoveringTextScore(player, '2+', '#0000ff');
    });

    this.physics.add.overlap(this.player, this.btcGroup, (player, singleCoin) => {
      this.pickCoin.play();
      singleCoin.destroy();
      gameState.score += 5;
      this.health += 5;
      this.scoreValue.setText(`${gameState.score}`);
      this.hoveringTextScore(player, '5+', '#0000ff', '#00ff00');
    });

    this.coinCreationTime = this.time.addEvent({
      callback: createCoin,
      delay: 1000,
      callbackScope: this,
      loop: true,
    });


    // Spikes SECTION

    this.spikeGroup = this.physics.add.group();
    function createSpike() {
      this.createBirdDrop(this.spikeGroup, 'spike');
    }

    this.spikeCreationTime = this.time.addEvent({
      callback: createSpike,
      delay: 5000,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(this.spikeGroup, this.groundGroup, (singleSpike) => {
      singleSpike.setVelocityX(-200);
    });

    this.physics.add.overlap(this.player, this.spikeGroup, (player, singleSpike) => {
      this.spikeSound.play();
      singleSpike.destroy();
      this.health -= 10;
      this.hoveringTextScore(player, '-10 '+(this.missileScoreCombo > 1 ? this.missileScoreCombo+'x Combo Lost!' : ''), '#CCCC00', '#800080');
      this.missileScoreCombo = 0;
    });

    // Missiles SECTION

    this.missileGroup = this.physics.add.group();

    this.explosion = this.add.sprite(-100, -100, 'explosion').setScale(0.5).setDepth(8);

    this.createAnimations('explode', 'explosion', 0, 15, 0, 20);

    this.createAnimations('idle', 'explosion', 15, 15, -1, 1);
    this.explosion.play('idle', true);

    this.physics.add.collider(this.player, this.missileGroup, (player, missile) => {
      if (player.body.touching.down && missile.body.touching.up) {
        this.killMissile.play();
        player.setVelocityY(-300);
        missile.setVelocityY(300);
        let message = '';
        this.missileScoreCombo++;
        if(this.missileScoreCombo > 5){
          this.missileScoreCombo = 5;
        }
        if (missile.y < 350) {
          let score = 5 * this.missileScoreCombo;
          // this.missileScore += score;
          this.health += 5;
          message = '+'+score + (this.missileScoreCombo > 1 ? ' ' + this.missileScoreCombo + 'x Combo!' : '');
        } else {
          let score = 2 * this.missileScoreCombo;
          // this.missileScore += score;
          this.health += 2;
          message = '+'+ score + (this.missileScoreCombo > 1 ? ' ' + this.missileScoreCombo + 'x Combo!': '');
        }
        if(this.missileScoreCombo > 1){
          this.hoveringTextScore(player, message, '#000000', '#00ff00');
        } else {
          this.hoveringTextScore(player, message, '#000000', '#ffffff');
        }
      } else {
        this.explodeSound.play();
        if (missile.y < 350) {
          this.health -= 25;
          this.hoveringTextScore(player, '-25 '+(this.missileScoreCombo > 1 ? this.missileScoreCombo+'x Combo Lost!' : ''), '#ff0000', '#ff0000');
        } else {
          this.health -= 15;
          this.hoveringTextScore(player, '-15 '+(this.missileScoreCombo > 1 ? this.missileScoreCombo+'x Combo Lost!' : ''), '#ff0000', '#ff0000');
        }
        this.missileScoreCombo = 0;
        missile.destroy();
        player.setVelocityY(0);

        this.explosion.x = player.x;
        this.explosion.y = player.y;
        this.explosion.play('explode', true);
      }
    });

    this.leftBound = this.add.rectangle(-50, 0, 10, gameState.sceneHeight, 0x000000).setOrigin(0);
    this.bottomBound = this.add.rectangle(0, gameState.sceneHeight,
      gameState.sceneWidth, 10, 0x000000).setOrigin(0);
    this.boundGroup = this.physics.add.staticGroup();
    this.boundGroup.add(this.leftBound);
    this.boundGroup.add(this.bottomBound);

    this.physics.add.collider(this.birdGroup, this.boundGroup, (singleBird) => {
      singleBird.destroy();
    });

    this.physics.add.collider(this.dodgeGroup, this.boundGroup, (singleCoin) => {
      singleCoin.destroy();
    });

    this.physics.add.collider(this.ethGroup, this.boundGroup, (singleCoin) => {
      singleCoin.destroy();
    });

    this.physics.add.collider(this.btcGroup, this.boundGroup, (singleCoin) => {
      singleCoin.destroy();
    });

    this.physics.add.collider(this.spikeGroup, this.boundGroup, (singleSpike) => {
      singleSpike.destroy();
    });

    this.physics.add.collider(this.missileGroup, this.boundGroup, (singleMissile) => {
      singleMissile.destroy();
    });


    // Health bar update

    const reduceHealthTimely = () => {
      this.health -= 1;
      this.progressBar.clear();
      this.progressBar.fillStyle(0x63ccc1, 1);
      this.progressBar.fillRect(170, 95, this.health, 10);
      this.healthTimer = 0;
    };

    this.time.addEvent({
      callback: reduceHealthTimely,
      delay: 500,
      loop: true,
      callbackScope: this,
    });
  }

  // END of create function above

  createAnimations(animKey, spriteKey, startFrame, endFrame, loopTimes, frameRate) {
    return (this.anims.create({
      key: animKey,
      frames: this.anims.generateFrameNumbers(spriteKey, { start: startFrame, end: endFrame }),
      frameRate,
      repeat: loopTimes,
    }));
  }

  addGameBackground() {
    this.add.image(gameState.sceneWidth / 2, gameState.sceneHeight / 2, 'sky').setScale(0.5);

    this.mountainGroup = this.add.group();
    this.firstMountain = this.mountainGroup.create(0, gameState.sceneHeight, 'mountains').setScale(0.5).setOrigin(0, 1);
    this.mountainWidth = this.firstMountain.displayWidth;
    createPlatform(this.mountainGroup, this.mountainWidth, 'mountains');

    this.plateauGroup = this.add.group();
    this.firstPlateau = this.plateauGroup.create(0, gameState.sceneHeight, 'plateau').setScale(0.5).setOrigin(0, 1);
    this.plateauWidth = this.firstPlateau.displayWidth;
    createPlatform(this.plateauGroup, this.plateauWidth, 'plateau');

    this.groundGroup = this.physics.add.group();
    this.first = this.groundGroup.create(0, this.scale.height, 'ground')
      .setOrigin(0, 1)
      .setScale(0.5);
    this.first.setImmovable(true);

    this.groundWidth = this.first.displayWidth;
    this.groundHeight = this.first.displayHeight;
    this.first.setSize(this.groundWidth * 2, this.groundHeight - 50);

    createPlatform(this.groundGroup, this.groundWidth, 'ground');
  }


  createBirdDrop(group, texture) {
    if (this.birdGroup.getLength() >= 2) {
      const child = this.birdGroup.getChildren()[Phaser.Math.Between(0,
        this.birdGroup.getLength() - 1)];
      const drop = group.create(child.x, child.y, texture).setScale(0.075);
      if (texture === 'spike') {
        drop.setScale(0.2);
      }
      drop.setGravityY(700);
      drop.setGravityX(0);
      drop.setDepth(6);
      drop.setBounce(1);
      drop.setSize(drop.width - 200, drop.height - 200);
    }
  }

  createMissile(height, texture) {
    const missile = this.missileGroup.create(gameState.sceneWidth + 100, height, texture);
    missile.setScale(0.1);
    missile.setDepth(6);
    missile.setSize(missile.width, missile.height - 300);
    missile.setOffset(0, 150);
  }

  hoveringTextScore(player, message, strokeColor, fillColor = '#ffffff') {
    const singleScoreText = this.add.text(player.x, player.y, message, {
      fontSize: '30px',
      fill: fillColor,
      fontFamily: '"Akaya Telivigala"',
      strokeThickness: 2,
      stroke: strokeColor,
    }).setDepth(7);
    singleScoreText.setAlpha(1);

    this.tweens.add({
      targets: singleScoreText,
      repeat: 0,
      duration: 2500,
      ease: 'linear',
      alpha: 0,
      y: singleScoreText.y - 100,
      onComplete() {
        singleScoreText.destroy();
      },
    });
  }

  createSoundEffect(soundKey, volumeLevel, loopStatus = false) {
    const effect = this.sound.add(soundKey, { loop: loopStatus });
    effect.volume = volumeLevel;
    return effect;
  }

  addSoundEffects() {
    this.pickCoin = this.createSoundEffect('pickCoin', 1, false);
    this.explodeSound = this.createSoundEffect('explosion', 1, false);
    this.killMissile = this.createSoundEffect('killMissile', 0.5, false);
    this.jumpSound = this.createSoundEffect('jumpSound', 0.25, false);
    this.spikeSound = this.createSoundEffect('spikeSound', 1, false);
  }

  update(time, delta) {

    // at 60FPS in fixed time of 1/60 sec per step
    var f = (delta / (1000 / 60)); // 1000 ms / 60fps

    moveBackgroundPlatform(this.mountainGroup, this.mountainWidth, 'mountains', 1*f);
    moveBackgroundPlatform(this.plateauGroup, this.plateauWidth, 'plateau', 2.8*f);
    moveBackgroundPlatform(this.groundGroup, this.groundWidth, 'ground', 9*f);

    if (this.health <= 0) {
      fetchScoreData.postScores(fetchScoreData.apiUrl, { user: gameState.playerName, wallet: gameState.wallet, score: gameState.score });

      this.gameTheme.stop();
      this.scene.stop();
      this.scene.start('GameOver');
    }

    // if (this.missileScore >= 1) {
    //   this.health += 1;
    //   this.missileScore -= 1;
    // }

    this.player.anims.play('run', true);
    this.birdGroup.children.iterate((child) => {
      child.anims.play('fly', true);
    });

    this.missileGroup.children.iterate((child) => {
      child.x -= 10*f;
    });

    this.timer += delta;
    if (this.timer >= 5000) {
      this.createMissile(415, 'missile');
      this.timer = 0;
    }

    this.secondTimer += delta;
    if (this.secondTimer >= 7000) {
      this.createMissile(300, 'missile2');
      this.secondTimer = 0;
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || this.tapped) {
      this.tapped = false;
      if (this.player.body.touching.down || (this.jump < this.jumpTimes && (this.jump > 0))) {
        this.player.setVelocityY(-400);
        this.jumpSound.play();

        if ((this.player.body.touching.down)) {
          this.jump = 0;
        }
        this.jump += 1;
      }
    }

    if (!this.player.body.touching.down) {
      this.player.anims.play('jump', true);
    }

    // if (this.cursors.down.isDown) {
    //   if (!this.player.body.touching.down) {
    //     this.player.setGravityY(1300);
    //   }
    // }

    if (this.player.body.touching.down) {
      this.player.setGravityY(800);
    }
  }
}

export default Game;