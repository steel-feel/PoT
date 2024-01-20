import Phaser from "phaser";
import { sceneEvents } from "../events/EventCenter";

export default class GameUI extends Phaser.Scene {
  score: number;
  scoreText!: Phaser.GameObjects.Text;
  displayAccount!: string;

  constructor() {
    super({ key: "game-ui" });
    this.score = 0;
  }


  async init ()
  {
    //@ts-ignore
    const accounts = await window.mina.requestAccounts();

    this.displayAccount = `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
   
    this.add.text(20, 30,  this.displayAccount, {
      fontStyle: "bold",
      backgroundColor: "white",
      fontSize: 20,
      color: "green",
    });

  }


 async create() {
    sceneEvents.on("coin-collected", this.handleCoinCollection, this);
    // this.scoreText = "Coins"
    this.scoreText = this.add.text(20, 50, `Score: ${this.score}`, {
      fontSize: 40,
      color: "black",
    });
   
  }


  handleCoinCollection() {
    this.score++;
    this.sound.playAudioSprite("sfx", "ping");
    this.scoreText.setText(`Score: ${this.score}`);
  }


}
