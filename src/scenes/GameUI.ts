import Phaser from 'phaser'

export default class GameUI extends Phaser.Scene
{
    score!: string

	constructor()
	{
		super({ key: 'game-ui' })
        this.score = `coins 0`
	}

	create()
	{
        this.add.text(50,50,this.score, {
            fontSize : 40,
            color: "black",
        } )
	}

}