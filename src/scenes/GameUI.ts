import Phaser from 'phaser'
import { sceneEvents } from '../events/EventCenter'

export default class GameUI extends Phaser.Scene {
    score: number
    scoreText!: Phaser.GameObjects.Text

    private music: boolean

    constructor() {
        super({ key: 'game-ui' })
        this.score = 0
        this.music = false

    }

    create() {

        sceneEvents.on('coin-collected', this.handleCoinCollection, this)
        sceneEvents.once('game-over', this.handleEndGame, this)

        // this.scoreText = "Coins"
        this.scoreText = this.add.text(20, 50, `Score: ${this.score}`, {
            fontSize: 40,
            color: "black",
        })

        const paddings = 5
        const button = this.add.text(70, 100, 'Music: ON', {
            // fontFamily: 'Roboto',
            backgroundColor:"grey",
            fontSize: '16px',
            padding: 
            {
                left: paddings,
                right: paddings,
                top: paddings,
                bottom: paddings
            },
            color: "white",
            align: 'center',

        }).setOrigin(0.5);
        button.setInteractive({ useHandCursor: true });

        const music = this.sound.add('theme', {
            loop: true
        });

        button.on('pointerdown', () => {
            this.music = !this.music;

            button.setText(`Music: ${this.music ? 'OFF' : 'ON'}`)
            if (this.music) {
                if (music.isPaused)
                    music.resume();
                else
                    music.play();
            } else {
                music.pause()
            }

        });





    }

    handleCoinCollection(x: number, y: number) {
        console.debug(`COIN x: ${x} , y : ${y}`)
        this.score++;
        this.sound.playAudioSprite('sfx', "ping");
        this.scoreText.setText(`Score: ${this.score}`)
    }

    handleEndGame(playerPath:number[]) {
        this.sound.playAudioSprite('sfx', "death");
        this.add.text(200, 200, `Game Over`, {
            fontSize: 100,
            color: "black",
        })
        //ToDo: @soham call service here, 
        //player path is your variable
        console.log({playerPath});
        
    }

}