import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import words from './chinese_words';
import Phaser from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {
        // Initialize elapsed time
        this.elapsedTime = 0;

        // Display elapsed time
        this.timeText = this.add.text(20, 20, 'Time: 0s', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff'
        }).setDepth(200);

        // Initialize score
        this.score = 0;

        // Display score
        this.scoreText = this.add.text(900, 20, 'Score: 0', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            align: 'right'
        }).setOrigin(1, 0).setDepth(200);

        // Add background image
        this.add.image(512, 384, 'background')

        // Define animatons
        var config2 = {
            key: 'explosion',
            frames: 'explosion',
            hideOnComplete: true
        };

        this.anims.create(config2);

        // Add game instructions
        this.add.text(512, 50, 'Type the words to destroy the asteroids!', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setDepth(200);

        // Add player ship
        this.player = this.add.image(512, 700, 'ship').setDepth(100);

        // Initialize the group for asteroids with physics
        this.asteroids = this.physics.add.group();

        // Create a text box to display typed input
        this.typedText = this.add.text(512, 650, '', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Initialize an empty string to store the typed input
        this.currentInput = '';

        // Set up text input for word typing
        this.input.keyboard.on('keydown', this.handleTyping, this);

        // Spawn asteroids periodically
        this.time.addEvent({
            delay: 4000,
            callback: this.spawnAsteroid,
            callbackScope: this,
            loop: true
        });

        // Start the game timer
        this.startTime = Date.now();

        // Emit event to indicate the current scene is ready
        EventBus.emit('current-scene-ready', this);
    }

    spawnAsteroid() {
        
        
        const word = Phaser.Utils.Array.GetRandom(words);
        const asteroid = this.asteroids.create(Phaser.Math.Between(50, 950), 0, 'asteroid');
        asteroid.word = word[0];
        // console.log(word);
        asteroid.pinyin = word[1];
        asteroid.eDef = word[2];
        asteroid.cSen = word[3];
        asteroid.pSen = word[4];
        asteroid.eSen = word[5];


        asteroid.setVelocity(0, 35);

        // Add word text to asteroid
        const wordText = this.add.text(asteroid.x, asteroid.y, asteroid.word, {
            fontFamily: 'Arial Black', fontSize: 20, color: '#ff0000',
            stroke: '#000000', strokeThickness: 6,
            align: 'center' 
        }).setOrigin(0.5).setDepth(100);
        
        wordText.setData('parent', asteroid);
        asteroid.setData('text', wordText);
    }

    handleTyping() {
        let name = document.querySelector('input[name="name"]');
        if(name.value != "") {
            this.asteroids.getChildren().forEach((asteroid) => {
                if (name.value === asteroid.word) {
                    const wordText = asteroid.getData('text');

                    // Increment the score
                    this.score += 10 * asteroid.word.length;
                    this.scoreText.setText('Score: ' + this.score);
                    name.value = ""
                    asteroid.play('explosion');
                    
                    if (wordText) {
                        wordText.setVisible(false).destroy();
                    }

                    asteroid.on('animationcomplete', () => {
                        asteroid.destroy();
                    });
                }
            });
        }
    }

    update() {
        // Update elapsed time
        this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
        this.timeText.setText('Time: ' + this.elapsedTime + 's');

        // Check if any asteroids have reached the bottom
        this.asteroids.getChildren().forEach((asteroid) => {
            if (asteroid.getData('text') != null) {
                asteroid.getData('text').y = asteroid.y;
            }
            
            if (asteroid.y > 700) {
                this.scene.start(`GameOver`, { score: this.score, elapsedTime: this.elapsedTime, deathMsg : `You got (${asteroid.pinyin})'ed`, helpSentence : `English Definition: ${asteroid.eDef}\nChinese Sentence: ${asteroid.cSen}\nPinying Sentence: ${asteroid.pSen}\nEnglish Sentence: ${asteroid.eSen}`}); // Game over if any asteroid reaches the bottom
                
            }
        });
    }
}

