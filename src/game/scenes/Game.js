import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import Phaser from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {


        // Set background color
        this.cameras.main.setBackgroundColor(0x00ff00);

        // Add background image
        this.add.image(512, 384, 'background').setAlpha(0.5);

        // Add game instructions
        this.add.text(512, 50, 'Type the words to destroy the asteroids!', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

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
            delay: 2000,
            callback: this.spawnAsteroid,
            callbackScope: this,
            loop: true
        });

        // Emit event to indicate the current scene is ready
        EventBus.emit('current-scene-ready', this);
    }

    spawnAsteroid() {
        const words = [
            "的", "一", "是", "在", "不", "了", "有", "和", "人", "这",
            "中", "大", "为", "上", "个", "国", "我", "以", "要", "他",
            "时", "来", "用", "们", "生", "到", "作", "地", "于", "出",
            "就", "分", "对", "成", "会", "可", "主", "发", "年", "动",
            "同", "工", "也", "能", "下", "过", "子", "说", "产", "种",
            "面", "而", "方", "后", "多", "定", "行", "学", "法", "所"
            // Add more characters as needed
        ];
        
    
        
        const word = Phaser.Utils.Array.GetRandom(words);
        const asteroid = this.asteroids.create(Phaser.Math.Between(50, 950), 0, 'asteroid');
        asteroid.word = word;
        asteroid.setVelocity(0, 50);

        // Add word text to asteroid
        const wordText = this.add.text(asteroid.x, asteroid.y, word, {
            fontFamily: 'Arial Black', fontSize: 20, color: '#ff0000',
            stroke: '#000000', strokeThickness: 6,
            align: 'center' 
        }).setOrigin(0.5).setDepth(100);
        
        wordText.setData('parent', asteroid);
        asteroid.setData('text', wordText);
    }

    handleTyping(event) {

        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.returnKey.on("down", event => {
            let name = document.querySelector('input[name="name"]');
            if(name.value != "") {
                this.asteroids.getChildren().forEach((asteroid) => {
                    // Add logic to match typed word with asteroid's word
                    if (name.value === asteroid.word) {
                        const wordText = asteroid.getData('text');
                        asteroid.destroy();
                        
                        if (wordText) {
                            wordText.setVisible(false).destroy();
                        } // Destroy the asteroid if there's a match
                    }
                });

                name.value = ""
            }
        });
    }

    update() {
        // Check if any asteroids have reached the bottom
        this.asteroids.getChildren().forEach((asteroid) => {
            if (asteroid.getData('text') != null) {
                asteroid.getData('text').y = asteroid.y;
            }
            
            

            if (asteroid.y > 800) {
                this.scene.start('GameOver'); // Game over if any asteroid reaches the bottom
            }
        });
    }
}
