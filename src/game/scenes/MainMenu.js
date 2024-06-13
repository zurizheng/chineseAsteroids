import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    logoTween;

    constructor ()
    {
        super('MainMenu');
    }

    create() {
        // Add background image
        this.add.image(512, 384, 'background');
    
        // Add logo image
        this.logo = this.add.image(512, 300, 'logo').setDepth(100);
    
        // Add Start Game button
        const startButton = this.add.text(512, 460, 'Start Game', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#5FD7E8',
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        }).setDepth(100).setOrigin(0.5).setInteractive({ useHandCursor: true });
    
        // Add event listener for button click
        startButton.on('pointerdown', () => {
            this.scene.start('Game');
        });
    
        // Emit event to indicate the current scene is ready
        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }

    moveLogo (reactCallback)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
        }
        else
        {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (reactCallback)
                    {
                        reactCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }
}
