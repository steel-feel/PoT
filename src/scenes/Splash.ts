import Phaser from 'phaser'
import WebWorkerClient from '../zk/WebWorkerClient'

export default class Splash extends Phaser.Scene {
    constructor() {
        super('splash')
    }

    async timeout(seconds: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, seconds * 1000);
        });
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

        const zkappWorkerClient = new WebWorkerClient();
       
        const title = this.add.text(loadingX - 150, loadingY - 190 , 'zk Collector', { font: '64px Arial' });
        title.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

        this.add.text(loadingX - 370, this.cameras.main.centerY + 60 , 
            `Welcome to the world of zk Collector 🔥, where adventure awaits you at every turn! 
            You are Minar, a young hero who must save the land from the evil Ganon and his minions. 😈 
            
            Along the way, you will explore dungeons 🏰, solve puzzles 🧩, collect items 🎁, and fight enemies ⚔️. 
            You will also meet many friends and allies who will help you on your quest. 👫
            Are you ready to embark on this epic journey with divine Zero Knowlegde powered by Mina Protocol ? 🚀
            Then grab your sword 🗡️ and shield 🛡️, and let's go! 🙌

            How to play (Version 0.1):
            1. Collect treasures by walking over them 💎
            2. Commit treasure to blockchain using SAVE button 💾

         Note: 📝
         - This game requires Mina Enabled wallet like Auro Wallet 💳
         - Game is live on Berkley network. Make sure you have enough balance for transactions 💰
         - Each Box is unique. So, can only be collected once. 🚫

            `
        , { font: '20px Arial',wordWrap: { width: 700, useAdvancedWrap: true} });
          await this.timeout(5)
        await zkappWorkerClient.loadContract();
        await zkappWorkerClient.compileContract();

       const gameScene = this.scene.get('game-ui')
       //@ts-ignore
       gameScene.zkappWorkerClient = zkappWorkerClient
        
        //~~~~~~~~~~~~~~~ Destroy loading 
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
