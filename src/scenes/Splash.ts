import Phaser from 'phaser'
import { Game } from '../zk/contracts'

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('splash')
    }



    async create() {

        const loadingX = this.cameras.main.centerX,
        loadingY = this.cameras.main.centerY - 30;

        const bar1 = this.add.nineslice(loadingX, loadingY, 'loading-ui', 'ButtonOrange');
        const fill1 = this.add.nineslice(loadingX - 114, loadingY - 2, 'loading-ui', 'ButtonOrangeFill1', 13, 39, 6, 6);

        fill1.setOrigin(0, 0.5);

        const loadingTween = this.tweens.add({
            targets: fill1,
            width: 228,
            duration: 10000,
            ease: 'sine.inout',
            yoyo: false,
        });

        await new Promise(r => setTimeout(r, 8000));

        await Game.compile()

        loadingTween.destroy();
        fill1.destroy();
        bar1.destroy();

        const startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start game')
            .setOrigin(0.5)
            .setPadding(10)
            .setFontSize(32)
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
