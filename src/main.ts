import Phaser from 'phaser'

import Game from './scenes/Game'
import Preloader from './scenes/Preloader'
import GameUI from './scenes/GameUI'

// let width = 1200
// let height = 800

const config: Phaser.Types.Core.GameConfig = {
	audio: {
        disableWebAudio: true
    },
	type: Phaser.AUTO,
	scale: {
        mode: Phaser.Scale.ScaleModes.RESIZE,
        parent: 'app',
        autoCenter: Phaser.Scale.CENTER_BOTH,
		// zoom:0.6,
    },
	physics: {
		default: "matter",
		arcade: {
			gravity: {y:0}
		},
		matter : {
			// debug: true,
			gravity: {y:0}, 	
		}
	},
	scene: [Preloader,Game,GameUI],
}

export default new Phaser.Game(config)