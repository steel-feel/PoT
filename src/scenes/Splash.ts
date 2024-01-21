import Phaser from 'phaser'
import { Game } from '../zk/contracts'

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('splash')
    }

   async create() {

        await Game.compile(); 

        //TODO: button beautification
        const startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start game')
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', this.handleConnection, this)
            .on('pointerover', () => startButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => startButton.setStyle({ fill: '#FFF' }))

        //TODO: Add game instructions    

    }

    async handleConnection() {
        try {
            // Accounts is an array of string Mina addresses.
            //@ts-ignore
            await window.mina.requestAccounts();

            this.scene.start("game")
        } catch (err) {
            // If the user has a wallet installed but has not created an account, an
            // exception will be thrown. Consider showing "not connected" in your UI.
            console.log(err);
        }

    }
}
