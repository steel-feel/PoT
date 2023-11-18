import Phaser from 'phaser'
import { sceneEvents } from '../events/EventCenter'

export default class GameUI extends Phaser.Scene
{
    score: number
    scoreText!:Phaser.GameObjects.Text

	constructor()
	{
		super({ key: 'game-ui' })
        this.score = 0

	}


	create()
	{

        sceneEvents.on('coin-collected', this.handleCoinCollection, this)

        // this.scoreText = "Coins"
        this.scoreText = this.add.text(50,50,`Score: ${this.score}`, {
            fontSize : 40,
            color: "black",
        })

	}

    handleCoinCollection(x: number, y: number) {
        console.debug(`COIN x: ${x} , y : ${y}`)
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`)
    }

}